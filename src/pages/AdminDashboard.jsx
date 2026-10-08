import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, supabaseReady, normalizeMobile } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";
import { PROGRAMS, ACADEMY } from "../data.js";
import { usePrograms } from "../usePrograms.js";

function useIsAdmin(session) {
  const [state, setState] = useState("checking"); // checking | yes | no
  useEffect(() => {
    if (!session) { setState("no"); return; }
    (async () => {
      const { data } = await supabase
        .from("admins")
        .select("id")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();
      setState(data ? "yes" : "no");
    })();
  }, [session]);
  return state;
}

function Overview({ students, leaves }) {
  const total = students.length;
  const boys = students.filter((s) => s.gender === "Boy").length;
  const girls = students.filter((s) => s.gender === "Girl").length;
  const approved = students.filter((s) => s.status === "Approved").length;
  const pending = students.filter((s) => s.status === "Pending").length;
  const feesPaid = students.filter((s) => s.fee_status === "Paid").length;
  const feesPending = students.filter((s) => s.fee_status === "Pending").length;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const totalCollected = feesPaid * ACADEMY.feeAmount;
  const totalPending = feesPending * ACADEMY.feeAmount;

  const cards = [
    ["Total Students", total],
    ["Total Boys", boys],
    ["Total Girls", girls],
    ["Fee Paid", feesPaid],
    ["Fee Pending", feesPending],
    ["Pending Leave Requests", pendingLeaves],
  ];

  return (
    <div>
      <div className="grid">
        {cards.map(([label, value]) => (
          <div className="card" key={label}>
            <h3 style={{ fontSize: "2.2rem" }}>{value}</h3>
            <p>{label}</p>
          </div>
        ))}
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 style={{ fontSize: "2rem", color: "#1a7a33" }}>₹{totalCollected.toLocaleString("en-IN")}</h3>
          <p>Total Collected</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "2rem", color: "#c0392b" }}>₹{totalPending.toLocaleString("en-IN")}</h3>
          <p>Total Pending</p>
        </div>
      </div>
      <p className="sub" style={{ marginTop: 10, opacity: .7 }}>
        Registration status in use: {approved} approved, {pending} pending (not shown above to keep this screen simple — see the Students tab).
      </p>
    </div>
  );
}

function toCsv(rows) {
  const headers = ["Student ID", "Name", "Mobile", "Email", "Age", "Gender", "Course", "Reg. Date", "Status", "Monthly Fee", "Fee Status"];
  const lines = [headers.join(",")];
  rows.forEach((s) => {
    const line = [s.student_id, s.full_name, s.mobile, s.email, s.age, s.gender, s.course, s.registration_date, s.status, ACADEMY.fee, s.fee_status]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",");
    lines.push(line);
  });
  return lines.join("\n");
}

function downloadCsv(rows) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function PendingFeesPanel({ students, reload }) {
  const [busyId, setBusyId] = useState(null);
  const pendingStudents = students.filter((s) => s.fee_status === "Pending");
  const total = pendingStudents.length * ACADEMY.feeAmount;

  const markPaid = async (id) => {
    setBusyId(id);
    await supabase.from("students").update({ fee_status: "Paid" }).eq("id", id);
    await reload();
    setBusyId(null);
  };

  return (
    <div>
      <p className="sub">Students who have not yet paid this month's fee.</p>
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Student Name</th><th>Mobile</th><th>Fee</th><th>Action</th></tr></thead>
          <tbody>
            {pendingStudents.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.full_name}</td>
                <td>{s.mobile}</td>
                <td>{ACADEMY.fee}</td>
                <td>
                  <button className="btn btn-gold small" disabled={busyId === s.id} onClick={() => markPaid(s.id)}>
                    Mark Paid
                  </button>
                </td>
              </tr>
            ))}
            {pendingStudents.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No pending fees. 🎉</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 14, fontWeight: 700 }}>
        Total Fee Pending: ₹{total.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function leaveStatusFor(studentId, leaves) {
  const today = new Date().toISOString().slice(0, 10);
  const covering = (leaves || []).filter(
    (l) => l.student_id === studentId && l.start_date <= today && today <= l.end_date
  );
  const approved = covering.find((l) => l.status === "Approved");
  if (approved) return { text: "Approved", cls: "badge-green" };
  const pending = covering.find((l) => l.status === "Pending");
  if (pending) return { text: "Pending", cls: "badge-orange" };
  return { text: "No active leave", cls: "badge-grey" };
}

function AddStudentForm({ reload }) {
  const { programs } = usePrograms({ includeInactive: true });
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ fullName: "", mobile: "", age: "", gender: "Boy", course: PROGRAMS[0].title });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const { error } = await supabase.from("students").insert({
      full_name: f.fullName,
      mobile: normalizeMobile(f.mobile),
      age: f.age ? Number(f.age) : null,
      gender: f.gender,
      course: f.course,
      status: "Approved",
    });
    setSaving(false);
    if (error) {
      setErr(error.code === "23505"
        ? "A student with this mobile number already exists."
        : `Could not add student: ${error.message}`);
      return;
    }
    setF({ fullName: "", mobile: "", age: "", gender: "Boy", course: PROGRAMS[0].title });
    setOpen(false);
    await reload();
  };

  if (!open) {
    return (
      <button className="btn btn-gold small" style={{ marginBottom: 14 }} onClick={() => setOpen(true)}>
        + Add New Student
      </button>
    );
  }

  return (
    <form className="form" style={{ marginBottom: 14 }} onSubmit={submit}>
      <label>Full Name
        <input required value={f.fullName} onChange={set("fullName")} />
      </label>
      <label>Mobile Number
        <input required type="tel" value={f.mobile} onChange={set("mobile")} />
      </label>
      <label>Age
        <input type="number" min="8" max="60" value={f.age} onChange={set("age")} />
      </label>
      <label>Gender
        <select value={f.gender} onChange={set("gender")}>
          <option>Boy</option>
          <option>Girl</option>
        </select>
      </label>
      <label>Course
        <select value={f.course} onChange={set("course")}>
          {programs.map((p) => <option key={p.title}>{p.title}</option>)}
        </select>
      </label>
      {err && <p className="full note" role="alert">{err}</p>}
      <div className="row full" style={{ marginTop: 0 }}>
        <button className="btn btn-gold small" type="submit" disabled={saving}>
          {saving ? "Adding..." : "Save Student"}
        </button>
        <button className="btn btn-ghost small" type="button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

function StudentsPanel({ students, leaves, reload }) {
  const { programs } = usePrograms({ includeInactive: true });
  const [tab, setTab] = useState("All"); // All | Boy | Girl
  const [quickFilter, setQuickFilter] = useState("All"); // All | Present | Absent | Paid | Pending
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc"); // name | date_desc
  const [busyId, setBusyId] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase.from("attendance").select("student_id, status").eq("date", today).then(({ data }) => {
      const map = {};
      (data || []).forEach((r) => { map[r.student_id] = r.status; });
      setTodayAttendance(map);
    });
  }, [students]);

  const filtered = students
    .filter((s) => tab === "All" || s.gender === tab)
    .filter((s) => {
      if (quickFilter === "Present") return todayAttendance[s.id] === "Present";
      if (quickFilter === "Absent") return todayAttendance[s.id] === "Absent";
      if (quickFilter === "Paid") return s.fee_status === "Paid";
      if (quickFilter === "Pending") return s.fee_status === "Pending";
      return true;
    })
    .filter((s) => !statusFilter || s.status === statusFilter)
    .filter((s) => !courseFilter || s.course === courseFilter)
    .filter((s) => !feeFilter || s.fee_status === feeFilter)
    .filter((s) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return s.full_name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.full_name.localeCompare(b.full_name);
      return new Date(b.registration_date) - new Date(a.registration_date);
    });

  const setStatus = async (id, status) => {
    setBusyId(id);
    await supabase.from("students").update({ status }).eq("id", id);
    await reload();
    setBusyId(null);
  };
  const setFee = async (id, fee_status) => {
    setBusyId(id);
    await supabase.from("students").update({ fee_status }).eq("id", id);
    await reload();
    setBusyId(null);
  };

  return (
    <div>
      <div className="row" style={{ marginTop: 0 }}>
        {["All", "Boy", "Girl"].map((t) => (
          <button key={t} className={t === tab ? "btn btn-gold small" : "btn btn-ghost small"} onClick={() => setTab(t)}>
            {t === "All" ? `All Students (${students.length})` : `${t === "Boy" ? "Boys" : "Girls"} (${students.filter((s) => s.gender === t).length})`}
          </button>
        ))}
      </div>

      <p className="sub" style={{ marginBottom: 6 }}>Quick filter (today's attendance / fee status):</p>
      <div className="row" style={{ marginTop: 0 }}>
        {["All", "Present", "Absent", "Paid", "Pending"].map((qf) => (
          <button key={qf} className={qf === quickFilter ? "btn btn-gold small" : "btn btn-ghost small"} onClick={() => setQuickFilter(qf)}>
            {qf === "All" ? "All Students" : qf === "Paid" ? "Fee Paid" : qf === "Pending" ? "Fee Pending" : qf}
          </button>
        ))}
      </div>

      <div className="form" style={{ marginTop: 16 }}>
        <label>Search by name or Student ID
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
        </label>
        <label>Registration Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </label>
        <label>Course
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">All Courses</option>
            {programs.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
        <label>Fee Status
          <select value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)}>
            <option value="">All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </label>
        <label>Sort By
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Registration Date (newest)</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </label>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn btn-ghost small" onClick={() => downloadCsv(filtered)}>
          Export to CSV ({filtered.length})
        </button>
      </div>

      <AddStudentForm reload={reload} />

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student ID</th><th>Name</th><th>Mobile</th><th>Email</th><th>Age</th><th>Gender</th>
              <th>Course</th><th>Reg. Date</th><th>Status</th><th>Attendance Today</th><th>Leave</th><th>Monthly Fee</th><th>Fee Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.student_id}</td>
                <td>{s.full_name}</td>
                <td>{s.mobile}</td>
                <td>{s.email || "—"}</td>
                <td>{s.age}</td>
                <td>{s.gender}</td>
                <td>{s.course}</td>
                <td>{s.registration_date}</td>
                <td>{s.status}</td>
                <td>
                  <span className={`badge ${todayAttendance[s.id] === "Present" ? "badge-green" : todayAttendance[s.id] === "Absent" ? "badge-red" : "badge-grey"}`}>
                    {todayAttendance[s.id] || "Not marked"}
                  </span>
                </td>
                <td>
                  {(() => {
                    const ls = leaveStatusFor(s.id, leaves);
                    return <span className={`badge ${ls.cls}`}>{ls.text}</span>;
                  })()}
                </td>
                <td>{ACADEMY.fee}</td>
                <td>
                  <span className={`badge ${s.fee_status === "Paid" ? "badge-green" : "badge-orange"}`}>
                    {s.fee_status}
                  </span>
                </td>
                <td className="actions">
                  {s.status !== "Approved" && (
                    <button className="btn btn-gold small" disabled={busyId === s.id} onClick={() => setStatus(s.id, "Approved")}>Approve</button>
                  )}
                  {s.status !== "Rejected" && (
                    <button className="btn btn-ghost small" disabled={busyId === s.id} onClick={() => setStatus(s.id, "Rejected")}>Reject</button>
                  )}
                  <button className="btn btn-ghost small" disabled={busyId === s.id} onClick={() => setFee(s.id, s.fee_status === "Paid" ? "Pending" : "Paid")}>
                    Mark Fee {s.fee_status === "Paid" ? "Pending" : "Paid"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="14" style={{ textAlign: "center", padding: 20 }}>No students match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function dateRange(start, end) {
  const out = [];
  let d = new Date(start);
  const last = new Date(end);
  while (d <= last) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function LeavesPanel({ leaves, reload }) {
  const [busyId, setBusyId] = useState(null);
  const respond = async (id, status, leave) => {
    const remark = window.prompt(`Optional remark for this ${status.toLowerCase()} leave:`, "");
    setBusyId(id);
    await supabase.from("leave_requests").update({ status, remark: remark || null }).eq("id", id);
    if (status === "Approved") {
      // Mark Leave in attendance for each date, without overwriting an existing record.
      const rows = dateRange(leave.start_date, leave.end_date).map((date) => ({
        student_id: leave.student_id, date, status: "Leave",
      }));
      await supabase.from("attendance").upsert(rows, { onConflict: "student_id,date", ignoreDuplicates: true });
    }
    await reload();
    setBusyId(null);
  };
  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr><th>Student</th><th>Dates</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id}>
              <td>{l.students?.full_name} ({l.students?.student_id})</td>
              <td>{l.start_date} to {l.end_date}</td>
              <td>{l.reason}</td>
              <td>{l.status}{l.remark ? ` — ${l.remark}` : ""}</td>
              <td className="actions">
                {l.status !== "Approved" && (
                  <button className="btn btn-gold small" disabled={busyId === l.id} onClick={() => respond(l.id, "Approved", l)}>Approve</button>
                )}
                {l.status !== "Rejected" && (
                  <button className="btn btn-ghost small" disabled={busyId === l.id} onClick={() => respond(l.id, "Rejected", l)}>Reject</button>
                )}
              </td>
            </tr>
          ))}
          {leaves.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No leave requests yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AttendancePanel({ students }) {
  const { programs } = usePrograms({ includeInactive: true });
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState({}); // student_id -> status
  const [existing, setExisting] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const approved = students.filter((s) => !course || s.course === course);

  const loadExisting = async (d) => {
    const { data } = await supabase.from("attendance").select("student_id, status").eq("date", d);
    const map = {};
    (data || []).forEach((r) => { map[r.student_id] = r.status; });
    setExisting(map);
    setMarks(map);
  };

  useEffect(() => { loadExisting(date); /* eslint-disable-next-line */ }, [date]);

  const mark = (id, status) => setMarks({ ...marks, [id]: status });

  const save = async () => {
    setSaving(true);
    setSavedMsg("");
    const rows = approved
      .filter((s) => marks[s.id])
      .map((s) => ({ student_id: s.id, date, course: s.course, status: marks[s.id] }));
    if (rows.length > 0) {
      await supabase.from("attendance").upsert(rows, { onConflict: "student_id,date" });
    }
    await loadExisting(date);
    setSaving(false);
    setSavedMsg("Attendance saved.");
  };

  const present = Object.values(marks).filter((v) => v === "Present").length;
  const absent = Object.values(marks).filter((v) => v === "Absent").length;
  const leave = Object.values(marks).filter((v) => v === "Leave").length;

  return (
    <div>
      <div className="form" style={{ marginTop: 0 }}>
        <label>Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>Course / Batch
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All Courses</option>
            {programs.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
      </div>
      <p className="sub">Present: {present} · Absent: {absent} · Leave: {leave}</p>
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>Student ID</th><th>Name</th><th>Gender</th><th>Course</th><th>Mark</th></tr></thead>
          <tbody>
            {approved.map((s) => (
              <tr key={s.id}>
                <td>{s.student_id}</td>
                <td>{s.full_name}</td>
                <td>{s.gender}</td>
                <td>{s.course}</td>
                <td className="actions">
                  {["Present", "Absent", "Leave"].map((st) => (
                    <button
                      key={st}
                      className={marks[s.id] === st ? "btn btn-gold small" : "btn btn-ghost small"}
                      onClick={() => mark(s.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
            {approved.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No approved students for this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="btn btn-gold" style={{ marginTop: 16 }} onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save Attendance"}
      </button>
      {savedMsg && <span style={{ marginLeft: 12 }}>{savedMsg}</span>}
    </div>
  );
}

function MaterialsPanel({ materials, reload }) {
  const { programs } = usePrograms({ includeInactive: true });
  const [f, setF] = useState({ title: "", description: "", course: "", link: "", published_at: new Date().toISOString().slice(0, 10) });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const [saving, setSaving] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("study_materials").insert(f);
    setF({ title: "", description: "", course: "", link: "", published_at: new Date().toISOString().slice(0, 10) });
    await reload();
    setSaving(false);
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    await supabase.from("study_materials").delete().eq("id", id);
    await reload();
  };

  return (
    <div>
      <p className="sub">
        Paste a link to the material (e.g. a Google Drive/PDF link you already have). This project
        doesn't upload files directly — that keeps it free and simple.
      </p>
      <form className="form" onSubmit={add}>
        <label>Title
          <input required value={f.title} onChange={set("title")} />
        </label>
        <label>Course (optional)
          <select value={f.course} onChange={set("course")}>
            <option value="">General (all courses)</option>
            {programs.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
        <label>Link (PDF / Drive / Doc URL)
          <input required type="url" value={f.link} onChange={set("link")} placeholder="https://..." />
        </label>
        <label>Publish Date
          <input required type="date" value={f.published_at} onChange={set("published_at")} />
        </label>
        <label className="full">Description
          <textarea rows="2" value={f.description} onChange={set("description")} />
        </label>
        <button className="btn btn-gold full" type="submit" disabled={saving}>
          {saving ? "Publishing..." : "Publish Material"}
        </button>
      </form>

      <ul className="points" style={{ marginTop: 20 }}>
        {materials.map((m) => (
          <li key={m.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <span>
              <strong>{m.title}</strong>{m.course ? ` (${m.course})` : ""} —{" "}
              <a href={m.link} target="_blank" rel="noreferrer">Open</a>
            </span>
            <button className="btn btn-ghost small" onClick={() => remove(m.id)}>Delete</button>
          </li>
        ))}
        {materials.length === 0 && <li>No materials yet.</li>}
      </ul>
    </div>
  );
}

function ProgramForm({ program, onSaved, onCancel }) {
  const editing = Boolean(program);
  const [f, setF] = useState({
    name: program?.title || "",
    short: program?.short || "",
    details: program?.details || "",
    objectives: (program?.objectives || []).join("\n"),
    icon: program?.icon || "",
    active: program ? program.active : true,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const row = {
      program_name: f.name.trim(),
      short_description: f.short.trim(),
      detailed_description: f.details.trim(),
      training_objectives: f.objectives.split("\n").map((x) => x.trim()).filter(Boolean),
      icon: f.icon.trim() || null,
      is_active: f.active,
    };
    const { error } = editing
      ? await supabase.from("training_programs").update(row).eq("id", program.id)
      : await supabase.from("training_programs").insert(row);
    setSaving(false);
    if (error) {
      setErr(error.code === "23505"
        ? "A program with this name already exists."
        : `Could not save: ${error.message}`);
      return;
    }
    onSaved();
  };

  return (
    <form className="form" style={{ marginBottom: 18 }} onSubmit={submit}>
      <label className="full">Program Name
        <input required value={f.name} onChange={set("name")} />
      </label>
      <label className="full">Short Description (shown on the program card)
        <input required value={f.short} onChange={set("short")} />
      </label>
      <label className="full">Detailed Description (leave a blank line between paragraphs)
        <textarea rows="5" value={f.details} onChange={set("details")} />
      </label>
      <label className="full">Training Objectives (one per line)
        <textarea rows="5" value={f.objectives} onChange={set("objectives")} />
      </label>
      <label>Icon (optional emoji)
        <input value={f.icon} onChange={set("icon")} placeholder="🏃" maxLength={4} />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "end" }}>
        <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} style={{ width: "auto" }} />
        Active (visible on the website)
      </label>
      {editing && (
        <p className="full sub" style={{ margin: 0 }}>
          Note: students already registered keep the program name they chose at registration, even if you rename it here.
        </p>
      )}
      {err && <p className="full note" role="alert">{err}</p>}
      <div className="row full" style={{ marginTop: 0 }}>
        <button className="btn btn-gold small" type="submit" disabled={saving}>
          {saving ? "Saving..." : editing ? "Save Changes" : "Add Program"}
        </button>
        <button className="btn btn-ghost small" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ProgramsPanel() {
  const { programs, loading, error, reload } = usePrograms({ includeInactive: true, fallback: false });
  const [editing, setEditing] = useState(null); // null | "new" | program
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  const toggle = async (p) => {
    setBusyId(p.id);
    setMsg("");
    const { error: err } = await supabase.from("training_programs").update({ is_active: !p.active }).eq("id", p.id);
    if (err) setMsg(`Could not update: ${err.message}`);
    await reload();
    setBusyId(null);
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone. (Tip: use Deactivate to just hide it.)`)) return;
    setBusyId(p.id);
    setMsg("");
    const { error: err } = await supabase.from("training_programs").delete().eq("id", p.id);
    if (err) setMsg(`Could not delete: ${err.message}`);
    await reload();
    setBusyId(null);
  };

  const addDefaults = async () => {
    setMsg("");
    const rows = PROGRAMS.map((p, i) => ({
      program_name: p.title,
      short_description: p.short,
      detailed_description: p.details,
      training_objectives: p.objectives,
      icon: p.icon,
      is_active: true,
      sort_order: (i + 1) * 10,
    }));
    const { error: err } = await supabase.from("training_programs").insert(rows);
    if (err) setMsg(`Could not add default programs: ${err.message}`);
    await reload();
  };

  const saved = async () => { setEditing(null); await reload(); };

  if (editing) {
    return <ProgramForm program={editing === "new" ? null : editing} onSaved={saved} onCancel={() => setEditing(null)} />;
  }

  return (
    <div>
      <p className="sub">
        These are the programs shown in the website's Physical Training Programs section. Inactive programs are hidden from
        visitors and from the registration form.
      </p>
      {error && (
        <p className="note" role="alert">
          Could not read the programs table ({error}). Run <code>supabase-schema-programs.sql</code> in Supabase first.
        </p>
      )}
      {msg && <p className="note" role="alert">{msg}</p>}

      <div className="row" style={{ marginTop: 0, marginBottom: 12 }}>
        <button className="btn btn-gold small" onClick={() => setEditing("new")}>+ Add New Program</button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>Program Name</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td>{p.icon} {p.title}</td>
                <td><span className={`badge ${p.active ? "badge-green" : "badge-grey"}`}>{p.active ? "Active" : "Inactive"}</span></td>
                <td className="actions">
                  <button className="btn btn-ghost small" disabled={busyId === p.id} onClick={() => setEditing(p)}>Edit</button>
                  <button className="btn btn-ghost small" disabled={busyId === p.id} onClick={() => toggle(p)}>
                    {p.active ? "Deactivate" : "Activate"}
                  </button>
                  <button className="btn btn-ghost small" disabled={busyId === p.id} onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && programs.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                No programs saved in the database yet — the website is currently showing the built-in default programs.
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-gold small" onClick={addDefaults}>Add the 6 default programs to the database</button>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="sub" style={{ marginTop: 10 }}>
        Once at least one program is saved here, the website shows only the programs in this list.
      </p>
    </div>
  );
}

function UpdatesPanel({ updates, reload }) {
  const [f, setF] = useState({ title: "", description: "", published_at: new Date().toISOString().slice(0, 10) });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const [saving, setSaving] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("updates").insert(f);
    setF({ title: "", description: "", published_at: new Date().toISOString().slice(0, 10) });
    await reload();
    setSaving(false);
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await supabase.from("updates").delete().eq("id", id);
    await reload();
  };

  return (
    <div>
      <form className="form" onSubmit={add}>
        <label>Title
          <input required value={f.title} onChange={set("title")} />
        </label>
        <label>Publish Date
          <input required type="date" value={f.published_at} onChange={set("published_at")} />
        </label>
        <label className="full">Description
          <textarea rows="2" value={f.description} onChange={set("description")} />
        </label>
        <button className="btn btn-gold full" type="submit" disabled={saving}>
          {saving ? "Publishing..." : "Publish Announcement"}
        </button>
      </form>

      <ul className="points" style={{ marginTop: 20 }}>
        {updates.map((u) => (
          <li key={u.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <span><strong>{u.published_at}:</strong> {u.title}{u.description ? ` — ${u.description}` : ""}</span>
            <button className="btn btn-ghost small" onClick={() => remove(u.id)}>Delete</button>
          </li>
        ))}
        {updates.length === 0 && <li>No announcements yet.</li>}
      </ul>
    </div>
  );
}

export default function AdminDashboard() {
  const { session, loading } = useAuth();
  const isAdmin = useIsAdmin(session);
  const [tab, setTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadAll = async () => {
    const [s, l, u, m] = await Promise.all([
      supabase.from("students").select("*").order("created_at", { ascending: false }),
      supabase.from("leave_requests").select("*, students(full_name, student_id)").order("created_at", { ascending: false }),
      supabase.from("updates").select("*").order("published_at", { ascending: false }),
      supabase.from("study_materials").select("*").order("published_at", { ascending: false }),
    ]);
    setStudents(s.data || []);
    setLeaves(l.data || []);
    setUpdates(u.data || []);
    setMaterials(m.data || []);
    setDataLoading(false);
  };

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => { setRefreshing(true); await loadAll(); setRefreshing(false); };

  useEffect(() => {
    if (isAdmin === "yes") loadAll();
    // eslint-disable-next-line
  }, [isAdmin]);

  // Pick up new registrations automatically when the admin returns to this tab.
  useEffect(() => {
    if (isAdmin !== "yes") return;
    const onVisible = () => { if (document.visibilityState === "visible") loadAll(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
    // eslint-disable-next-line
  }, [isAdmin]);

  if (!supabaseReady) {
    return <section className="section"><h2>Admin Dashboard</h2><p className="note">Database isn't connected yet — see SETUP.md.</p></section>;
  }
  if (loading || isAdmin === "checking") return <section className="section"><p className="sub">Loading...</p></section>;
  if (!session || isAdmin === "no") return <Navigate to="/admin-login" replace />;
  if (dataLoading) return <section className="section"><p className="sub">Loading dashboard...</p></section>;

  const logout = async () => { await supabase.auth.signOut(); window.location.href = "/admin-login"; };

  return (
    <section className="section wide-section">
      <div className="row" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <h2 style={{ marginBottom: 0 }}>Owner Admin Dashboard</h2>
        <div className="row" style={{ marginTop: 0 }}>
          <button className="btn btn-ghost small" onClick={refresh} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-ghost small" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row">
        {["overview", "attendance", "fees", "pendingfees", "students", "programs", "materials", "updates", "leaves"].map((t) => (
          <button key={t} className={t === tab ? "btn btn-gold small" : "btn btn-ghost small"} onClick={() => setTab(t)}>
            {{ overview: "Overview", attendance: "Attendance", fees: "Fee Management", pendingfees: "Pending Fees", students: "Student List", programs: "Training Programs", materials: "Study Materials", updates: "Updates", leaves: "Leave Requests" }[t]}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === "overview" && <Overview students={students} leaves={leaves} />}
        {tab === "attendance" && <AttendancePanel students={students} />}
        {tab === "fees" && <StudentsPanel students={students} leaves={leaves} reload={loadAll} />}
        {tab === "pendingfees" && <PendingFeesPanel students={students} reload={loadAll} />}
        {tab === "students" && <StudentsPanel students={students} leaves={leaves} reload={loadAll} />}
        {tab === "programs" && <ProgramsPanel />}
        {tab === "materials" && <MaterialsPanel materials={materials} reload={loadAll} />}
        {tab === "updates" && <UpdatesPanel updates={updates} reload={loadAll} />}
        {tab === "leaves" && <LeavesPanel leaves={leaves} reload={loadAll} />}
      </div>
    </section>
  );
}

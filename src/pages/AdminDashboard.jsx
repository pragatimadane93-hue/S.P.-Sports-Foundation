import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, supabaseReady } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";
import { PROGRAMS } from "../data.js";

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

  const cards = [
    ["Total Registered Students", total],
    ["Total Boys", boys],
    ["Total Girls", girls],
    ["Approved Students", approved],
    ["Pending Registrations", pending],
    ["Fees Paid (students)", feesPaid],
    ["Fees Pending (students)", feesPending],
    ["Pending Leave Requests", pendingLeaves],
  ];

  return (
    <div className="grid">
      {cards.map(([label, value]) => (
        <div className="card" key={label}>
          <h3 style={{ fontSize: "2.2rem" }}>{value}</h3>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

function StudentsPanel({ students, reload }) {
  const [tab, setTab] = useState("All"); // All | Boy | Girl
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState("");
  const [busyId, setBusyId] = useState(null);

  const filtered = students
    .filter((s) => tab === "All" || s.gender === tab)
    .filter((s) => !statusFilter || s.status === statusFilter)
    .filter((s) => !courseFilter || s.course === courseFilter)
    .filter((s) => !feeFilter || s.fee_status === feeFilter)
    .filter((s) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return s.full_name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q);
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
            {PROGRAMS.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
        <label>Fee Status
          <select value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)}>
            <option value="">All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student ID</th><th>Name</th><th>Mobile</th><th>Age</th><th>Gender</th>
              <th>Course</th><th>Reg. Date</th><th>Status</th><th>Fee</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.student_id}</td>
                <td>{s.full_name}</td>
                <td>{s.mobile}</td>
                <td>{s.age}</td>
                <td>{s.gender}</td>
                <td>{s.course}</td>
                <td>{s.registration_date}</td>
                <td>{s.status}</td>
                <td>{s.fee_status}</td>
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
              <tr><td colSpan="10" style={{ textAlign: "center", padding: 20 }}>No students match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeavesPanel({ leaves, reload }) {
  const [busyId, setBusyId] = useState(null);
  const respond = async (id, status) => {
    const remark = window.prompt(`Optional remark for this ${status.toLowerCase()} leave:`, "");
    setBusyId(id);
    await supabase.from("leave_requests").update({ status, remark: remark || null }).eq("id", id);
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
                  <button className="btn btn-gold small" disabled={busyId === l.id} onClick={() => respond(l.id, "Approved")}>Approve</button>
                )}
                {l.status !== "Rejected" && (
                  <button className="btn btn-ghost small" disabled={busyId === l.id} onClick={() => respond(l.id, "Rejected")}>Reject</button>
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
  const [dataLoading, setDataLoading] = useState(true);

  const loadAll = async () => {
    const [s, l, u] = await Promise.all([
      supabase.from("students").select("*").order("created_at", { ascending: false }),
      supabase.from("leave_requests").select("*, students(full_name, student_id)").order("created_at", { ascending: false }),
      supabase.from("updates").select("*").order("published_at", { ascending: false }),
    ]);
    setStudents(s.data || []);
    setLeaves(l.data || []);
    setUpdates(u.data || []);
    setDataLoading(false);
  };

  useEffect(() => {
    if (isAdmin === "yes") loadAll();
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
        <button className="btn btn-ghost small" onClick={logout}>Logout</button>
      </div>

      <div className="row">
        {["overview", "students", "leaves", "updates"].map((t) => (
          <button key={t} className={t === tab ? "btn btn-gold small" : "btn btn-ghost small"} onClick={() => setTab(t)}>
            {t === "overview" ? "Overview" : t === "students" ? "Students" : t === "leaves" ? "Leave Requests" : "Updates"}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === "overview" && <Overview students={students} leaves={leaves} />}
        {tab === "students" && <StudentsPanel students={students} reload={loadAll} />}
        {tab === "leaves" && <LeavesPanel leaves={leaves} reload={loadAll} />}
        {tab === "updates" && <UpdatesPanel updates={updates} reload={loadAll} />}
      </div>
    </section>
  );
}

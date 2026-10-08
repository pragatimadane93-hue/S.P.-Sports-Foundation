import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, supabaseReady } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";
import { ACADEMY, YOUTUBE_URL, wa } from "../data.js";

function DashboardHome({ student, attendance, leaves }) {
  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const marked = present + absent;
  const pct = marked > 0 ? Math.round((present / marked) * 100) : 0;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;

  const cards = [
    ["My Attendance %", `${pct}%`],
    ["Present Days", present],
    ["Absent Days", absent],
    ["Fee Status", student.fee_status],
    ["Pending Leave Requests", pendingLeaves],
  ];

  return (
    <div className="grid">
      {cards.map(([label, value]) => (
        <div className="card" key={label}>
          <h3 style={{ fontSize: "2rem" }}>{value}</h3>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

function ProfilePanel({ student }) {
  const rows = [
    ["Student ID", student.student_id],
    ["Full Name", student.full_name],
    ["Mobile", student.mobile],
    ["Email", student.email || "—"],
    ["Gender", student.gender],
    ["Age", student.age],
    ["Course", student.course],
    ["Address", student.address || "—"],
    ["Parent / Guardian", student.parent_name || "—"],
    ["Parent Contact", student.parent_contact || "—"],
    ["Registration Status", student.status],
    ["Registration Date", student.registration_date],
  ];
  return (
    <ul className="points">
      {rows.map(([label, value]) => (
        <li key={label}><strong>{label}:</strong> {value}</li>
      ))}
    </ul>
  );
}

function AttendancePanel({ attendance }) {
  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const marked = present + absent;
  const pct = marked > 0 ? Math.round((present / marked) * 100) : 0;
  return (
    <div>
      <p className="sub">Attendance %: <strong>{pct}%</strong> · Present: {present} · Absent: {absent}</p>
      {attendance.length === 0 ? (
        <p className="sub">No attendance recorded yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.date}>
                  <td>{a.date}</td>
                  <td>
                    <span className={`badge ${a.status === "Present" ? "badge-green" : a.status === "Absent" ? "badge-red" : "badge-orange"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FeesPanel({ student }) {
  const payMsg = `Hello, I (${student.full_name}, ${student.student_id}) have paid my monthly fee of ${ACADEMY.fee}. Please verify and update my fee status.`;
  return (
    <div>
      <p>Monthly Fee: <strong>{ACADEMY.fee}</strong></p>
      <p>Status: <span className={`badge ${student.fee_status === "Paid" ? "badge-green" : "badge-orange"}`}>{student.fee_status}</span></p>
      {student.fee_status !== "Paid" && (
        <a className="btn btn-gold" target="_blank" rel="noreferrer" href={wa(ACADEMY.contacts[0].tel, payMsg)}>
          I've Paid — Notify Admin
        </a>
      )}
      <p className="sub" style={{ marginTop: 14 }}>
        Online payment (Razorpay/UPI) will be added once the academy's payment account is set
        up. Until then, pay by cash or UPI and notify the admin using the button above — nothing
        is marked Paid automatically.
      </p>
    </div>
  );
}

function ApplyLeavePanel({ studentRowId, onSaved }) {
  const [f, setF] = useState({ start: "", end: "", reason: "" });
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    const { error } = await supabase.from("leave_requests").insert({
      student_id: studentRowId,
      start_date: f.start,
      end_date: f.end,
      reason: f.reason,
    });
    if (!error) {
      setF({ start: "", end: "", reason: "" });
      onSaved();
    }
    setStatus("idle");
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>From Date
        <input required type="date" value={f.start} onChange={set("start")} />
      </label>
      <label>To Date
        <input required type="date" value={f.end} onChange={set("end")} />
      </label>
      <label className="full">Reason
        <textarea required rows="2" value={f.reason} onChange={set("reason")} />
      </label>
      <button className="btn btn-gold full" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Submitting..." : "Submit Leave Request"}
      </button>
    </form>
  );
}

function LeaveHistoryPanel({ leaves }) {
  if (leaves.length === 0) return <p className="sub">No leave requests yet.</p>;
  return (
    <ul className="points">
      {leaves.map((l) => (
        <li key={l.id}>
          {l.start_date} to {l.end_date} — {l.reason} —{" "}
          <span className={`badge ${l.status === "Approved" ? "badge-green" : l.status === "Rejected" ? "badge-red" : "badge-orange"}`}>
            {l.status}
          </span>
          {l.remark ? ` (${l.remark})` : ""}
        </li>
      ))}
    </ul>
  );
}

function StudyMaterialPanel({ materials }) {
  if (materials.length === 0) return <p className="sub">No study materials uploaded yet.</p>;
  return (
    <ul className="points">
      {materials.map((m) => (
        <li key={m.id}>
          <strong>{m.title}</strong>{m.course ? ` (${m.course})` : ""}
          {m.description ? ` — ${m.description}` : ""}{" "}
          — <a href={m.link} target="_blank" rel="noreferrer">Open</a>
        </li>
      ))}
    </ul>
  );
}

function NotificationsPanel({ updates }) {
  if (updates.length === 0) return <p className="sub">No notifications yet.</p>;
  return (
    <ul className="points">
      {updates.map((u) => (
        <li key={u.id}><strong>{u.published_at}:</strong> {u.title}{u.description ? ` — ${u.description}` : ""}</li>
      ))}
    </ul>
  );
}

export default function StudentDashboard() {
  const { session, loading } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const load = async () => {
    if (!session) return;
    const { data: s } = await supabase
      .from("students")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .single();
    setStudent(s || null);
    if (s) {
      const [a, l, m, u] = await Promise.all([
        supabase.from("attendance").select("date, status").eq("student_id", s.id).order("date", { ascending: false }),
        supabase.from("leave_requests").select("*").eq("student_id", s.id).order("created_at", { ascending: false }),
        supabase.from("study_materials").select("*").order("published_at", { ascending: false }),
        supabase.from("updates").select("*").order("published_at", { ascending: false }),
      ]);
      setAttendance(a.data || []);
      setLeaves(l.data || []);
      setMaterials(m.data || []);
      setUpdates(u.data || []);
    }
    setLoadingData(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [session]);

  if (!supabaseReady) {
    return <section className="section"><h2>Student Dashboard</h2><p className="note">Database isn't connected yet — see SETUP.md.</p></section>;
  }
  if (loading || loadingData) return <section className="section"><p className="sub">Loading...</p></section>;
  if (!session) return <Navigate to="/student-login" replace />;

  const logout = async () => { await supabase.auth.signOut(); window.location.href = "/student-login"; };

  if (!student) {
    return (
      <section className="section">
        <h2>Student Dashboard</h2>
        <p className="note">Could not find your student profile. Please contact the academy.</p>
      </section>
    );
  }

  const tabs = ["dashboard", "profile", "attendance", "fees", "apply-leave", "leave-history", "study", "notifications"];
  const labels = {
    dashboard: "Dashboard", profile: "My Profile", attendance: "My Attendance", fees: "My Fees",
    "apply-leave": "Apply Leave", "leave-history": "Leave History", study: "Study Material", notifications: "Notifications",
  };

  return (
    <section className="section wide-section">
      <div className="row" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <h2 style={{ marginBottom: 0 }}>Welcome, {student.full_name}</h2>
        <button className="btn btn-ghost small" onClick={logout}>Logout</button>
      </div>

      <div className="row">
        {tabs.map((t) => (
          <button key={t} className={t === tab ? "btn btn-gold small" : "btn btn-ghost small"} onClick={() => setTab(t)}>
            {labels[t]}
          </button>
        ))}
        <a className="btn btn-ghost small" href={YOUTUBE_URL} target="_blank" rel="noreferrer">YouTube</a>
        <a className="btn btn-ghost small" href={ACADEMY.instagram[0].url} target="_blank" rel="noreferrer">Instagram</a>
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === "dashboard" && <DashboardHome student={student} attendance={attendance} leaves={leaves} />}
        {tab === "profile" && <ProfilePanel student={student} />}
        {tab === "attendance" && <AttendancePanel attendance={attendance} />}
        {tab === "fees" && <FeesPanel student={student} />}
        {tab === "apply-leave" && <ApplyLeavePanel studentRowId={student.id} onSaved={load} />}
        {tab === "leave-history" && <LeaveHistoryPanel leaves={leaves} />}
        {tab === "study" && <StudyMaterialPanel materials={materials} />}
        {tab === "notifications" && <NotificationsPanel updates={updates} />}
      </div>
    </section>
  );
}

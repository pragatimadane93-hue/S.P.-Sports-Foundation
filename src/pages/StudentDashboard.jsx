import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase, supabaseReady } from "../supabaseClient.js";
import { useAuth } from "../AuthContext.jsx";

function LeaveForm({ studentRowId, onSaved }) {
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
      <label>Leave Start Date
        <input required type="date" value={f.start} onChange={set("start")} />
      </label>
      <label>Leave End Date
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

export default function StudentDashboard() {
  const { session, loading } = useAuth();
  const [student, setStudent] = useState(null);
  const [leaves, setLeaves] = useState([]);
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
      const { data: l } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("student_id", s.id)
        .order("created_at", { ascending: false });
      setLeaves(l || []);
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

  return (
    <section className="section">
      <h2>Student Dashboard</h2>
      {!student ? (
        <p className="note">Could not find your student profile. Please contact the academy.</p>
      ) : (
        <>
          <div className="card wide">
            <h3>{student.full_name}</h3>
            <p>Student ID: <strong>{student.student_id}</strong></p>
            <p>Course: {student.course}</p>
            <p>Status: <strong>{student.status}</strong></p>
            <p>Fee Status: <strong>{student.fee_status}</strong></p>
          </div>

          <h3 className="form-title">Submit a Leave Request</h3>
          <LeaveForm studentRowId={student.id} onSaved={load} />

          <h3 className="form-title">Your Leave History</h3>
          {leaves.length === 0 ? (
            <p className="sub">No leave requests yet.</p>
          ) : (
            <ul className="points">
              {leaves.map((l) => (
                <li key={l.id}>
                  {l.start_date} to {l.end_date} — {l.reason} — <strong>{l.status}</strong>
                  {l.remark ? ` (${l.remark})` : ""}
                </li>
              ))}
            </ul>
          )}

          <div className="row">
            <Link className="btn btn-ghost" to="/online-study">Online Study</Link>
            <Link className="btn btn-ghost" to="/updates">Latest Updates</Link>
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          </div>
        </>
      )}
    </section>
  );
}

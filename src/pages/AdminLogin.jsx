import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, supabaseReady } from "../supabaseClient.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  if (!supabaseReady) {
    return (
      <section className="section narrow">
        <h2>Owner Admin Login</h2>
        <p className="note">Database isn't connected yet — see SETUP.md.</p>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg("Email or password is incorrect.");
      setStatus("error");
      return;
    }
    const { data: adminRow } = await supabase
      .from("admins")
      .select("id")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();
    if (!adminRow) {
      await supabase.auth.signOut();
      setErrorMsg("This account is not authorized as an admin.");
      setStatus("error");
      return;
    }
    navigate("/admin-dashboard");
  };

  return (
    <section className="section narrow">
      <h2>Owner Admin Login</h2>
      <p className="sub">
        This login is only for the academy owner/admin. The account must first be created and
        approved in Supabase — see SETUP.md ("Phase 2: Creating the admin account").
      </p>
      <form className="form" onSubmit={submit}>
        <label className="full">Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="full">Password
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {status === "error" && <p className="full note" role="alert">{errorMsg}</p>}
        <button className="btn btn-gold full" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="sub">Looking for the student login? <Link to="/student-login">Go here</Link>.</p>
    </section>
  );
}

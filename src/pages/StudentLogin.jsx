import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, supabaseReady, mobileToEmail } from "../supabaseClient.js";

export default function StudentLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  if (!supabaseReady) {
    return (
      <section className="section">
        <h2>Student Login</h2>
        <p className="note">Database isn't connected yet — see SETUP.md.</p>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email: mobileToEmail(mobile),
      password,
    });
    if (error) {
      setErrorMsg("Mobile number or password is incorrect.");
      setStatus("error");
      return;
    }
    navigate("/student-dashboard");
  };

  return (
    <section className="section narrow">
      <h2>Student Login</h2>
      <form className="form" onSubmit={submit}>
        <label className="full">Mobile Number
          <input required type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>
        <label className="full">Password
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {status === "error" && <p className="full note" role="alert">{errorMsg}</p>}
        <button className="btn btn-gold full" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="sub">New student? <Link to="/#admission">Register here</Link>.</p>
    </section>
  );
}

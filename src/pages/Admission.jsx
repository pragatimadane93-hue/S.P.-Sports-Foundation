import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase, supabaseReady, mobileToEmail } from "../supabaseClient.js";
import { PROGRAMS } from "../data.js";

const emptyForm = (courseFromUrl) => ({
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  age: "",
  gender: "Boy",
  address: "",
  course: courseFromUrl || PROGRAMS[0].title,
  parentName: "",
  parentContact: "",
  password: "",
});

export default function Admission() {
  const [params] = useSearchParams();
  const [f, setF] = useState(emptyForm(params.get("course")));
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [studentId, setStudentId] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (!supabaseReady) {
    return (
      <section className="section">
        <h2>Admission / Registration</h2>
        <p className="note">
          Online registration isn't connected to a database yet. See <code>SETUP.md</code> in the
          project folder to connect a free Supabase database, then this form will save real
          student registrations and create a student login automatically.
        </p>
      </section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");
    try {
      // Step 1: create the login (Supabase Auth) using the mobile number.
      const { data: signUp, error: signUpErr } = await supabase.auth.signUp({
        email: mobileToEmail(f.mobile),
        password: f.password,
      });
      if (signUpErr) throw signUpErr;
      const authUserId = signUp.user?.id;
      if (!authUserId) throw new Error("Could not create a login for this registration.");

      // Step 2: insert the student profile, linked to that login.
      const { data: inserted, error: insertErr } = await supabase
        .from("students")
        .insert({
          auth_user_id: authUserId,
          full_name: f.fullName,
          mobile: f.mobile,
          email: f.email || null,
          dob: f.dob || null,
          age: f.age ? Number(f.age) : null,
          gender: f.gender,
          address: f.address,
          course: f.course,
          parent_name: f.parentName,
          parent_contact: f.parentContact,
        })
        .select("student_id")
        .single();
      if (insertErr) throw insertErr;

      setStudentId(inserted.student_id);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <section className="section">
        <h2>Registration Successful</h2>
        <div className="note">
          <p><strong>Your Student ID:</strong> {studentId}</p>
          <p>Log in using your <strong>Mobile Number</strong> and the password you just created. Save your Student ID for reference.</p>
          <p>Your registration status is <strong>Pending</strong> until the academy approves it.</p>
        </div>
        <Link className="btn btn-gold" to="/student-login">Go to Student Login</Link>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Admission / Registration</h2>
      <p className="sub">Fields marked required must be filled. You'll get a Student ID and can log in right after.</p>
      <form className="form" onSubmit={submit}>
        <label>Full Name
          <input required value={f.fullName} onChange={set("fullName")} />
        </label>
        <label>Mobile Number
          <input required type="tel" pattern="[0-9+ ]{10,15}" value={f.mobile} onChange={set("mobile")} />
        </label>
        <label>Email Address (optional)
          <input type="email" value={f.email} onChange={set("email")} />
        </label>
        <label>Date of Birth
          <input required type="date" value={f.dob} onChange={set("dob")} />
        </label>
        <label>Age
          <input required type="number" min="8" max="60" value={f.age} onChange={set("age")} />
        </label>
        <label>Gender
          <select value={f.gender} onChange={set("gender")}>
            <option>Boy</option>
            <option>Girl</option>
          </select>
        </label>
        <label className="full">Address
          <input required value={f.address} onChange={set("address")} />
        </label>
        <label>Course / Training Program
          <select value={f.course} onChange={set("course")}>
            {PROGRAMS.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
        <label>Parent / Guardian Name
          <input required value={f.parentName} onChange={set("parentName")} />
        </label>
        <label>Parent / Guardian Contact Number
          <input required type="tel" value={f.parentContact} onChange={set("parentContact")} />
        </label>
        <label className="full">Create a Password (for Student Login)
          <input required type="password" minLength={6} value={f.password} onChange={set("password")} />
        </label>
        {status === "error" && <p className="full note" role="alert">{errorMsg}</p>}
        <button className="btn btn-gold full" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </section>
  );
}

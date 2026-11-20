
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import { friendlyAuthError } from "../authErrors";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim()
      });

      navigate("/dashboard");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-wrap">
      <div className="card auth-card">
        <h2>Create your account</h2>
        <p className="auth-sub">
          Enter your name, email and password to get started.
        </p>

        <form className="form" onSubmit={handleRegister}>

          {/* Full Name */}
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password">Password</label>

            <div className="password-wrap">
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle"
                onClick={() => setShow((s) => !s)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary btn-block"
            disabled={busy}
          >
            {busy ? "Creating account…" : "Create account"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

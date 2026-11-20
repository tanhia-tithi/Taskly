
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main className="auth-wrap">
      <div className="card auth-card">

        <span className="eyebrow">
          Welcome back
        </span>

        <h2>Sign in to your account</h2>

        <p className="auth-sub">
          Welcome back! Enter your details to continue.
        </p>

        <form className="form" onSubmit={handleLogin}>

          {/* Email Field */}
          <div className="field">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="field">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrap">
              <input
                id="password"
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
          >
            Sign in
          </button>

        </form>

        {/* Registration Link */}
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create account
          </Link>
        </p>

      </div>
    </main>
  );
}

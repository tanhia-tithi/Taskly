import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "🔐",
    title: "Secure sign-in",
    text: "Your login is handled by Firebase Authentication, so your password is never stored in this app.",
  },
  {
    icon: "📊",
    title: "Your dashboard",
    text: "See your account details and recent activity as soon as you log in.",
  },
  {
    icon: "🛡️",
    title: "Private pages",
    text: "Dashboard and profile are only visible when you are logged in.",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">Welcome to Home Page</span>
        <h1>
          Your account, in{" "}
          <span className="gradient-text">one calm place.</span>
        </h1>
        <p>
          Create an account or log in to see your dashboard and manage your
          profile. It takes less than a minute.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Create account
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="feature-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
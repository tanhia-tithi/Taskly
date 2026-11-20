
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const fmt = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not available";

export default function Dashboard() {
  const { user } = useAuth();

  const name =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "there";

  const stats = [
    {
      icon: "✉",
      label: "Email address",
      value: user?.email || "Not available",
      description: "Your registered email",
    },
    {
      icon: "📅",
      label: "Member since",
      value: fmt(user?.metadata?.creationTime),
      description: "Your account creation date",
    },
    {
      icon: "🕒",
      label: "Last login",
      value: fmt(user?.metadata?.lastSignInTime),
      description: "Your most recent sign-in",
    },
  ];

  return (
    <main className="dashboard">
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-tag">✦ YOUR PERSONAL SPACE</span>
          <h1>Welcome back, {name}!</h1>
          <p>
            It's great to have you here. Everything you need
            is right here in your dashboard.
          </p>
          <Link to="/profile" className="hero-button">
            View My Profile <span>→</span>
          </Link>
        </div>

        <div className="hero-decoration">
          <div className="hero-circle circle-one"></div>
          <div className="hero-circle circle-two"></div>
          <div className="hero-symbol">✦</div>
        </div>
      </section>

      <section className="dashboard-heading">
        <div>
          <h2>Account Overview</h2>
          <p>A quick look at your account details.</p>
        </div>
        <span className="status-pill">
          <span className="status-dot"></span>
          Active account
        </span>
      </section>

      <section className="dashboard-stats">
        {stats.map((stat) => (
          <article className="dashboard-card" key={stat.label}>
            <div className="card-icon">{stat.icon}</div>
            <p className="card-label">{stat.label}</p>
            <h3>{stat.value}</h3>
            <span className="card-description">
              {stat.description}
            </span>
          </article>
        ))}
      </section>

      <section className="dashboard-bottom">
        <div className="bottom-card">
          <div className="bottom-icon">👤</div>
          <div>
            <h3>Your profile</h3>
            <p>Manage your personal information and account details.</p>
          </div>
          <Link to="/profile" className="text-link">
            Open profile →
          </Link>
        </div>

        <div className="bottom-card welcome-card">
          <div className="bottom-icon">✨</div>
          <div>
            <h3>You're all set!</h3>
            <p>Your account is connected and ready to use.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

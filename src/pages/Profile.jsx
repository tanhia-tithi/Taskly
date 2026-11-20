
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  const taskData = useTasks();

  console.log("Task Context:", taskData);

  const {
    tasks = [],
    coins = 0,
    completedTasks = [],
    history = [],
    loading = false,
  } = taskData || {};

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const totalEarned = history
    .filter(
      (item) =>
        item.type === "earned" || item.type === "bonus"
    )
    .reduce((total, item) => total + item.amount, 0);

  const totalSpent = history
    .filter((item) => item.type === "spent")
    .reduce((total, item) => total + item.amount, 0);

  const accountCreated = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Not available";

  if (loading) {
    return (
      <p className="profile-loading">
        Loading profile...
      </p>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h1>My Profile</h1>
        <p>
          View your account details and productivity achievements.
        </p>
      </div>

      <section className="profile-card">
        <div className="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div className="profile-user-info">
          <h2>{userName}</h2>
          <p>{user?.email}</p>
          <span className="profile-status">
            Active account
          </span>
        </div>
      </section>

      <section className="profile-stats">
        <div className="profile-stat">
          <span className="stat-icon">🪙</span>
          <p>Current Balance</p>
          <h2>{coins}</h2>
          <small>Available coins</small>
        </div>

        <div className="profile-stat">
          <span className="stat-icon">🏆</span>
          <p>Total Coins Earned</p>
          <h2>{totalEarned}</h2>
          <small>Including daily bonuses</small>
        </div>

        <div className="profile-stat">
          <span className="stat-icon">✅</span>
          <p>Completed Tasks</p>
          <h2>{completedTasks.length}</h2>
          <small>Currently completed</small>
        </div>

        <div className="profile-stat">
          <span className="stat-icon">📋</span>
          <p>Total Tasks</p>
          <h2>{tasks.length}</h2>
          <small>Tasks created</small>
        </div>
      </section>

      <section className="account-details">
        <h2>Account Details</h2>

        <div className="detail-row">
          <span>Username</span>
          <strong>{userName}</strong>
        </div>

        <div className="detail-row">
          <span>Email Address</span>
          <strong>{user?.email}</strong>
        </div>

        <div className="detail-row">
          <span>Account Created</span>
          <strong>{accountCreated}</strong>
        </div>

        <div className="detail-row">
          <span>Total Coins Spent</span>
          <strong>{totalSpent} coins</strong>
        </div>

        <div className="detail-row">
          <span>Authentication</span>
          <strong>Firebase Email & Password</strong>
        </div>
      </section>
    </main>
  );
}

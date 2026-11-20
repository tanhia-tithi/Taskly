
import { NavLink, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Account";

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to={user ? "/dashboard" : "/"} className="brand">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" fill="#2f3a8f" />
            <path
              d="M25 8C15 11 12 25 21 32C12 32 7 25 9 18C11 11 18 7 25 8Z"
              fill="#ffffff"
            />
          </svg>
          {user && <span>{userName}</span>}
        </Link>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }>
                Dashboard
              </NavLink>

              <NavLink to="/tasks" className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }>
                Tasks
              </NavLink>

              <NavLink to="/profile" className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }>
                Profile
              </NavLink>

              <div className="user-chip">
                <span className="chip-avatar">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="chip-email">{user.email}</span>
              </div>

              <button onClick={logout} className="btn btn-outline btn-small">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }>
                Login
              </NavLink>

              <NavLink to="/register" className={({ isActive }) =>
                `btn btn-primary btn-small ${isActive ? "active" : ""}`
              }>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

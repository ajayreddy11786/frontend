import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        VAULT<span className="navbar-brand-accent">DUEL</span>
      </div>
      {user && (
        <nav className="navbar-links">
          <NavLink to={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
        </nav>
      )}
      {user && (
        <div className="navbar-user">
          <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
          <span className="navbar-name">{user.fullName}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}

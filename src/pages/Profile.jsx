import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { profileApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateLocalName } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      await profileApi.update({ fullName });
      updateLocalName(fullName);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      await profileApi.update({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setSuccess("Password changed.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>Profile</h1>
          <p className="page-subtitle">Update your name or change your password.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <section className="panel">
          <h2 className="panel-title">Account details</h2>
          <form className="item-form" onSubmit={handleNameSubmit}>
            <div className="form-row">
              <label>
                Full name
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </label>
              <label>
                Email
                <input value={user.email} disabled title="Email can't be changed" />
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                Save name
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <h2 className="panel-title">Change password</h2>
          <form className="item-form" onSubmit={handlePasswordSubmit}>
            <div className="form-row">
              <label>
                Current password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                Change password
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MatchForm from "../components/MatchForm";
import MatchTable from "../components/MatchTable";
import { matchesApi, adminApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("matches");

  const [matches, setMatches] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadMatches = async () => {
    setMatchesLoading(true);
    setError("");
    try {
      setMatches(await matchesApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setMatchesLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    setError("");
    try {
      setUsers(await adminApi.listUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    loadUsers();
  }, []);

  const handleMatchSubmit = async (data) => {
    setBusy(true);
    setError("");
    try {
      if (editingMatch) {
        await matchesApi.update(editingMatch.id, data);
      } else {
        await matchesApi.create(data);
      }
      setEditingMatch(null);
      await loadMatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleMatchDelete = async (match) => {
    if (!confirm(`Delete the match against "${match.opponentName}"? This can't be undone.`)) return;
    setError("");
    try {
      await matchesApi.remove(match.id);
      await loadMatches();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleToggle = async (target) => {
    const nextRole = target.role === "ADMIN" ? "USER" : "ADMIN";
    setError("");
    try {
      await adminApi.updateUser(target.id, { role: nextRole });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnabledToggle = async (target) => {
    setError("");
    try {
      await adminApi.updateUser(target.id, { enabled: !target.enabled });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserDelete = async (target) => {
    if (!confirm(`Delete the account for ${target.email}? This can't be undone.`)) return;
    setError("");
    try {
      await adminApi.deleteUser(target.id);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">Manage every logged match and every account.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="tabs">
          <button className={`tab ${tab === "matches" ? "tab-active" : ""}`} onClick={() => setTab("matches")}>
            All matches
          </button>
          <button className={`tab ${tab === "users" ? "tab-active" : ""}`} onClick={() => setTab("users")}>
            Users
          </button>
        </div>

        {tab === "matches" && (
          <>
            <section className="panel">
              <h2 className="panel-title">{editingMatch ? "Edit match" : "Log a new match"}</h2>
              <MatchForm
                editingMatch={editingMatch}
                onSubmit={handleMatchSubmit}
                onCancel={() => setEditingMatch(null)}
                busy={busy}
              />
            </section>

            <section className="panel">
              <h2 className="panel-title">All matches ({matches.length})</h2>
              {matchesLoading ? (
                <div className="empty-state">Loading…</div>
              ) : (
                <MatchTable matches={matches} onEdit={setEditingMatch} onDelete={handleMatchDelete} showOwner />
              )}
            </section>
          </>
        )}

        {tab === "users" && (
          <section className="panel">
            <h2 className="panel-title">All users ({users.length})</h2>
            {usersLoading ? (
              <div className="empty-state">Loading…</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSelf = u.email.toLowerCase() === user.email.toLowerCase();
                      return (
                        <tr key={u.id}>
                          <td className="cell-strong">
                            {u.fullName} {isSelf && <span className="tag-you">you</span>}
                          </td>
                          <td className="cell-muted">{u.email}</td>
                          <td>
                            <span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                          </td>
                          <td>
                            <span className={`status-dot ${u.enabled ? "status-on" : "status-off"}`} />
                            {u.enabled ? "Active" : "Disabled"}
                          </td>
                          <td className="cell-actions">
                            <button className="btn btn-small" onClick={() => handleRoleToggle(u)} disabled={isSelf}>
                              Make {u.role === "ADMIN" ? "User" : "Admin"}
                            </button>
                            <button
                              className="btn btn-small"
                              onClick={() => handleEnabledToggle(u)}
                              disabled={isSelf}
                            >
                              {u.enabled ? "Disable" : "Enable"}
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleUserDelete(u)}
                              disabled={isSelf}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

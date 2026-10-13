import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MatchForm from "../components/MatchForm";
import MatchTable from "../components/MatchTable";
import StatsBar from "../components/StatsBar";
import { matchesApi } from "../api";

export default function UserDashboard() {
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMatch, setEditingMatch] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [matchList, statsResult] = await Promise.all([matchesApi.list(), matchesApi.stats()]);
      setMatches(matchList);
      setStats(statsResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data) => {
    setBusy(true);
    setError("");
    try {
      if (editingMatch) {
        await matchesApi.update(editingMatch.id, data);
      } else {
        await matchesApi.create(data);
      }
      setEditingMatch(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (match) => {
    if (!confirm(`Delete the match against "${match.opponentName}"? This can't be undone.`)) return;
    setError("");
    try {
      await matchesApi.remove(match.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>My Matches</h1>
          <p className="page-subtitle">Log and track your Vault Duel games.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <StatsBar stats={stats} />

        <section className="panel">
          <h2 className="panel-title">{editingMatch ? "Edit match" : "Log a new match"}</h2>
          <MatchForm
            editingMatch={editingMatch}
            onSubmit={handleSubmit}
            onCancel={() => setEditingMatch(null)}
            busy={busy}
          />
        </section>

        <section className="panel">
          <h2 className="panel-title">Your matches ({matches.length})</h2>
          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : (
            <MatchTable matches={matches} onEdit={setEditingMatch} onDelete={handleDelete} />
          )}
        </section>
      </main>
    </div>
  );
}

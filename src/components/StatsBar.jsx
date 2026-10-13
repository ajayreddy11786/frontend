import React from "react";

export default function StatsBar({ stats }) {
  if (!stats) return null;
  return (
    <div className="stats-bar">
      <div className="stat-tile">
        <div className="stat-value">{stats.totalMatches}</div>
        <div className="stat-label">Logged</div>
      </div>
      <div className="stat-tile stat-win">
        <div className="stat-value">{stats.wins}</div>
        <div className="stat-label">Won</div>
      </div>
      <div className="stat-tile stat-loss">
        <div className="stat-value">{stats.losses}</div>
        <div className="stat-label">Lost</div>
      </div>
      <div className="stat-tile">
        <div className="stat-value">{stats.draws}</div>
        <div className="stat-label">Drawn</div>
      </div>
      <div className="stat-tile stat-rate">
        <div className="stat-value">{stats.winRate}%</div>
        <div className="stat-label">Win rate</div>
      </div>
    </div>
  );
}

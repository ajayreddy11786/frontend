import React from "react";

const resultLabel = { WON: "Won", LOST: "Lost", DRAW: "Draw" };

/** `showOwner` is turned on in the admin dashboard, where matches belong to many different users. */
export default function MatchTable({ matches, onEdit, onDelete, showOwner }) {
  if (matches.length === 0) {
    return <div className="empty-state">No matches logged yet. Add your first one above.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Opponent</th>
            <th>Result</th>
            <th>Guesses</th>
            <th>Codes</th>
            {showOwner && <th>Logged by</th>}
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id}>
              <td className="cell-muted">{m.playedAt}</td>
              <td className="cell-strong">{m.opponentName}</td>
              <td>
                <span className={`result-badge result-${m.result.toLowerCase()}`}>{resultLabel[m.result]}</span>
              </td>
              <td>{m.guessesTaken}</td>
              <td className="cell-muted cell-mono">
                {m.yourSecretCode || "----"} / {m.opponentSecretCode || "----"}
              </td>
              {showOwner && <td className="cell-muted">{m.ownerName}</td>}
              <td className="cell-actions">
                <button className="btn btn-small" onClick={() => onEdit(m)}>
                  Edit
                </button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(m)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";

const todayISO = () => new Date().toISOString().slice(0, 10);

const BLANK = {
  opponentName: "",
  yourSecretCode: "",
  opponentSecretCode: "",
  guessesTaken: "",
  result: "WON",
  playedAt: todayISO(),
  notes: "",
  roomCode: "",
};

/** Shared create/edit form for logging a Vault Duel match. */
export default function MatchForm({ editingMatch, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    if (editingMatch) {
      setForm({
        opponentName: editingMatch.opponentName,
        yourSecretCode: editingMatch.yourSecretCode || "",
        opponentSecretCode: editingMatch.opponentSecretCode || "",
        guessesTaken: String(editingMatch.guessesTaken),
        result: editingMatch.result,
        playedAt: editingMatch.playedAt,
        notes: editingMatch.notes || "",
        roomCode: editingMatch.roomCode || "",
      });
    } else {
      setForm(BLANK);
    }
  }, [editingMatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      opponentName: form.opponentName.trim(),
      yourSecretCode: form.yourSecretCode.trim(),
      opponentSecretCode: form.opponentSecretCode.trim(),
      guessesTaken: Number(form.guessesTaken),
      result: form.result,
      playedAt: form.playedAt,
      notes: form.notes.trim(),
      roomCode: form.roomCode.trim(),
    });
  };

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Opponent
          <input name="opponentName" value={form.opponentName} onChange={handleChange} required maxLength={100} />
        </label>
        <label>
          Result
          <select name="result" value={form.result} onChange={handleChange}>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
            <option value="DRAW">Draw</option>
          </select>
        </label>
        <label>
          Date played
          <input
            type="date"
            name="playedAt"
            value={form.playedAt}
            onChange={handleChange}
            max={todayISO()}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Your code
          <input
            name="yourSecretCode"
            value={form.yourSecretCode}
            onChange={handleChange}
            placeholder="4 digits"
            inputMode="numeric"
            maxLength={4}
            pattern="\d{4}"
            title="4 digits"
          />
        </label>
        <label>
          Opponent's code
          <input
            name="opponentSecretCode"
            value={form.opponentSecretCode}
            onChange={handleChange}
            placeholder="4 digits"
            inputMode="numeric"
            maxLength={4}
            pattern="\d{4}"
            title="4 digits"
          />
        </label>
        <label>
          Guesses taken
          <input
            type="number"
            name="guessesTaken"
            value={form.guessesTaken}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>

      <label>
        Room code <span className="label-optional">(optional)</span>
        <input name="roomCode" value={form.roomCode} onChange={handleChange} maxLength={10} />
      </label>

      <label>
        Notes <span className="label-optional">(optional)</span>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} maxLength={1000} />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {editingMatch ? "Save changes" : "Log match"}
        </button>
        {editingMatch && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

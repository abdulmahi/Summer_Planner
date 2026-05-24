import { useState } from "react"
import "./App.css"

function App() {
  const [entries, setEntries] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    person: "Mahi",
    date: "",
    startTime: "",
    endTime: "",
    note: "",
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.date || !form.startTime || !form.endTime) return

    if (editingId) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingId ? { ...form, id: editingId } : entry
        )
      )
      setEditingId(null)
    } else {
      setEntries([...entries, { ...form, id: Date.now() }])
    }

    setForm({
      person: "Mahi",
      date: "",
      startTime: "",
      endTime: "",
      note: "",
    })
  }

  function handleEdit(entry) {
    setForm(entry)
    setEditingId(entry.id)
  }

  function handleDelete(id) {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Shared Availability</p>
        <h1>Summer & Mahi Planner</h1>
        <p className="subtitle">
          Add shifts, free windows, and call-friendly times in one simple place.
        </p>
      </header>

      <main className="layout">
        <section className="card">
          <h2>{editingId ? "Edit Availability" : "Add Availability"}</h2>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Person
              <select name="person" value={form.person} onChange={handleChange}>
                <option value="Mahi">Mahi</option>
                <option value="Summer">Summer</option>
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>

            <div className="time-row">
              <label>
                Start
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                />
              </label>

              <label>
                End
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Note
              <input
                type="text"
                name="note"
                placeholder="e.g. Free to call, night shift, busy"
                value={form.note}
                onChange={handleChange}
              />
            </label>

            <button type="submit">
              {editingId ? "Update Entry" : "Add Entry"}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Availability List</h2>

          {entries.length === 0 ? (
            <p className="empty">No availability added yet.</p>
          ) : (
            <div className="entries">
              {entries.map((entry) => (
                <div className="entry" key={entry.id}>
                  <div>
                    <strong>{entry.person}</strong>
                    <p>
                      {entry.date} · {entry.startTime} - {entry.endTime}
                    </p>
                    {entry.note && <span>{entry.note}</span>}
                  </div>

                  <div className="actions">
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
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

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .order("date", { ascending: true })

    if (error) {
      console.error("Fetch error:", error)
      return
    }

    setEntries(data)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.date || !form.startTime || !form.endTime) return

    if (editingId) {
      const { error } = await supabase
        .from("availability")
        .update({
          person: form.person,
          date: form.date,
          start_time: form.startTime,
          end_time: form.endTime,
          note: form.note,
        })
        .eq("id", editingId)

      if (error) {
        console.error("Update error:", error)
        return
      }

      setEditingId(null)
    } else {
      const { error } = await supabase.from("availability").insert({
        person: form.person,
        date: form.date,
        start_time: form.startTime,
        end_time: form.endTime,
        note: form.note,
      })

      if (error) {
        console.error("Insert error:", error)
        return
      }
    }

    setForm({
      person: "Mahi",
      date: "",
      startTime: "",
      endTime: "",
      note: "",
    })

    fetchEntries()
  }

  function handleEdit(entry) {
    setForm({
      person: entry.person,
      date: entry.date,
      startTime: entry.start_time,
      endTime: entry.end_time,
      note: entry.note || "",
    })

    setEditingId(entry.id)
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Delete error:", error)
      return
    }

    fetchEntries()
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Shared Availability</p>
        <h1>Something fun and creative 🤔 🤔 🤔</h1>
        <p className="subtitle">
          Under Construction!
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
                      {entry.date} · {entry.start_time} - {entry.end_time}
                    </p>
                    {entry.note && <span>{entry.note}</span>}
                  </div>

                  <div className="actions">
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>
                      Delete
                    </button>
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
import { useState } from "react";

export default function PostForm({ initial = { title: "", content: "" }, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return setError("Title and content are required.");
    setBusy(true);
    setError("");
    try {
      await onSubmit({ title: form.title.trim(), content: form.content });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="stack">
      <label>
        Title
        <input name="title" value={form.title} onChange={onChange} maxLength={200} required />
      </label>
      <label>
        Content
        <textarea name="content" value={form.content} onChange={onChange} rows={14} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? "Saving…" : submitLabel}</button>
    </form>
  );
}
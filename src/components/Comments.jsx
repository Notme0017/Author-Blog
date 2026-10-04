import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/auth";
import usePaged from "../hooks/usePaged";
import { commentOwnerId, commentUsername, formatDate } from "../utils/helpers";

function CommentForm({ postId, onAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return setError("Please write something first.");
    setBusy(true);
    setError("");
    try {
      onAdded(await api.addComment(postId, text.trim()));
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="stack">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Reply as yourself…" />
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? "Posting…" : "Post comment"}</button>
    </form>
  );
}

function CommentItem({ comment, postId, onUpdated, onDeleted }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const ownerId = commentOwnerId(comment);
  const isOwner = ownerId != null && String(ownerId) === String(user.id);

  async function save(e) {
    e.preventDefault();
    if (!text.trim()) return setError("Comment can't be empty.");
    setBusy(true);
    setError("");
    try {
      onUpdated(await api.editComment(postId, comment.id, text.trim()));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this comment?")) return;
    setBusy(true);
    setError("");
    try {
      await api.deleteComment(postId, comment.id);
      onDeleted(comment.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="comment">
      <p className="muted">
        <strong>{isOwner ? "You" : commentUsername(comment) ?? "Unknown"}</strong> · {formatDate(comment.timestamp)}
      </p>
      {editing ? (
        <form onSubmit={save} className="stack">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
          <div className="row">
            <button disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button
              type="button"
              className="link"
              onClick={() => {
                setEditing(false);
                setText(comment.content);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="body">{comment.content}</p>
      )}
      {error && <p className="error">{error}</p>}
      {!editing && isOwner && (
        <div className="row">
          <button className="link" onClick={() => setEditing(true)} disabled={busy}>Edit</button>
          <button className="link danger" onClick={remove} disabled={busy}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default function Comments({ postId }) {
  const { user } = useAuth();
  const { list: comments, loading, error, more, loadMore, loadingMore, moreError, setList } = usePaged(
    (page) => api.getComments(postId, page),
    postId
  );

  const added = (c) =>
    setList((l) => [{ user: { id: user.id, username: user.username }, ...c }, ...l]); // newest first
  const updated = (c) => setList((l) => l.map((x) => (x.id === c.id ? { ...x, ...c } : x)));
  const deleted = (id) => setList((l) => l.filter((x) => x.id !== id));

  return (
    <section className="comments">
      <h2>Comments{!loading && !more && ` (${comments.length})`}</h2>
      <p className="muted">You can edit or delete only the comments you wrote.</p>

      <CommentForm postId={postId} onAdded={added} />

      {loading && <p className="muted">Loading comments…</p>}
      {error && <p className="error">{error.message}</p>}
      {!loading && !error && comments.length === 0 && <p className="muted">No comments yet.</p>}
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} postId={postId} onUpdated={updated} onDeleted={deleted} />
      ))}
      {moreError && <p className="error">{moreError.message}</p>}
      {more && (
        <button onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Loading…" : "Load more comments"}
        </button>
      )}
    </section>
  );
}
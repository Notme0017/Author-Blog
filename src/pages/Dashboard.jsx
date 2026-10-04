import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/auth";
import usePaged from "../hooks/usePaged";
import { formatDate, isMine } from "../utils/helpers";

function PostRow({ post, onChanged, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function togglePublish() {
    setBusy(true);
    setError("");
    try {
      const updated = await api.setPublished(post.id, !post.published);
      onChanged({ ...post, published: !post.published, ...updated });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await api.deletePost(post.id);
      onDeleted(post.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <div className="row spread">
        <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
        <span className={`badge ${post.published ? "live" : ""}`}>{post.published ? "Published" : "Draft"}</span>
      </div>
      <p className="muted">
        Created {formatDate(post.uploadTime)}
        {post.published && post.publishTime && ` · Published ${formatDate(post.publishTime)}`}
      </p>
      {error && <p className="error">{error}</p>}
      <div className="row">
        <Link to={`/posts/${post.id}/edit`}>Edit</Link>
        <button className="link" onClick={togglePublish} disabled={busy}>
          {post.published ? "Unpublish" : "Publish"}
        </button>
        <Link to={`/posts/${post.id}`}>Comments{post._count ? ` (${post._count.comments})` : ""}</Link>
        <button className="link danger" onClick={remove} disabled={busy}>Delete</button>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { list, loading, error, more, loadMore, loadingMore, moreError, setList } = usePaged(
    (page) => api.getMyPosts(page),
    "mine"
  );

  if (loading) return <p className="muted">Loading your posts…</p>;
  if (error) return <p className="error">{error.message}</p>;

  const posts = list.filter((p) => isMine(p, user));

  return (
    <>
      <div className="row spread">
        <h1>Your posts</h1>
        <Link to="/posts/new" className="button">New post</Link>
      </div>
      {posts.length === 0 && !more && <p className="muted">You haven't written any posts yet.</p>}
      {posts.map((p) => (
        <PostRow
          key={p.id}
          post={p}
          onChanged={(u) => setList((l) => l.map((x) => (x.id === u.id ? u : x)))}
          onDeleted={(id) => setList((l) => l.filter((x) => x.id !== id))}
        />
      ))}
      {moreError && <p className="error">{moreError.message}</p>}
      {more && (
        <button onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      )}
    </>
  );
}
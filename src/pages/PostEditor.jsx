import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/auth";
import useFetch from "../hooks/useFetch";
import PostForm from "../components/PostForm";
import NotFound from "./NotFound";
import { isMine } from "../utils/helpers";

export default function PostEditor() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [{ data: post, error, loading }] = useFetch(
    () => (editing ? api.getPost(id) : Promise.resolve(null)),
    id ?? "new"
  );

  if (loading) return <p className="muted">Loading…</p>;
  if (error) return [403, 404].includes(error.status) ? <NotFound /> : <p className="error">{error.message}</p>;
  if (editing && !isMine(post, user)) return <NotFound />;

  async function save(data) {
    if (editing) await api.updatePost(id, data);
    else await api.createPost(data);
    navigate("/");
  }

  return (
    <>
      <Link to="/">← Your posts</Link>
      <h1>{editing ? "Edit post" : "New post"}</h1>
      {!editing && <p className="muted">New posts are saved as drafts. Publish them from your dashboard.</p>}
      <PostForm
        initial={editing ? { title: post.title, content: post.content } : undefined}
        onSubmit={save}
        submitLabel={editing ? "Save changes" : "Save draft"}
      />
    </>
  );
}
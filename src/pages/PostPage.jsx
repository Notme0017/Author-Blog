import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/auth";
import useFetch from "../hooks/useFetch";
import Comments from "../components/Comments";
import NotFound from "./NotFound";
import { formatDate, isMine } from "../utils/helpers";

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [{ data: post, error, loading }] = useFetch(() => api.getPost(id), id);

  if (loading) return <p className="muted">Loading post…</p>;
  if (error) return [403, 404].includes(error.status) ? <NotFound /> : <p className="error">{error.message}</p>;
  if (!isMine(post, user)) return <NotFound />;

  return (
    <article>
      <Link to="/">← Your posts</Link>
      <div className="row spread">
        <h1>{post.title}</h1>
        <span className={`badge ${post.published ? "live" : ""}`}>{post.published ? "Published" : "Draft"}</span>
      </div>
      <p className="muted">
        Created {formatDate(post.uploadTime)}
        {post.published && post.publishTime && ` · Published ${formatDate(post.publishTime)}`}
      </p>
      <div className="content">{post.content}</div>
      <p><Link to={`/posts/${post.id}/edit`}>Edit post</Link></p>
      <Comments postId={id} />
    </article>
  );
}
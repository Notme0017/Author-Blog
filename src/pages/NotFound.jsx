import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="muted">That page doesn't exist, or the post isn't available.</p>
      <Link to="/">Back to your posts</Link>
    </>
  );
}
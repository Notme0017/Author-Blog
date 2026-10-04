import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function ProtectedRoute() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;


  if (!user.isAuthor) {
    return (
      <div className="stack">
        <h1>Not authorized</h1>
        <p className="muted">This site is for authors only. Log in with an author account.</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return <Outlet />;
}
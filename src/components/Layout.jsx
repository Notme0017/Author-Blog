import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Layout() {
  const { user, loading, logout } = useAuth();

  return (
    <>
      <header className="header">
        <div className="container bar">
          <Link to="/" className="brand">Author Studio</Link>
          <nav>
            {!loading &&
              (user ? (
                <>
                  {user.isAuthor && <Link to="/posts/new">New post</Link>}
                  <span className="muted">{user.username}</span>
                  <button className="link" onClick={logout}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login">Log in</Link>
                  <Link to="/signup">Sign up</Link>
                </>
              ))}
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
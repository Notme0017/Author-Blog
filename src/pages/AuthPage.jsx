import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/auth";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "", agree: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const username = form.username.trim();
    try {
      if (isSignup) await api.authorSignup(username, form.password);
      await login(username, form.password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="stack narrow">
      <h1>{isSignup ? "Create an author account" : "Author log in"}</h1>
      <label>
        Username
        <input name="username" value={form.username} onChange={onChange} required autoComplete="username" />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"}
        />
      </label>
      {isSignup && (
        <>
          <p className="muted">At least 8 characters.</p>
          <label className="row">
            <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} required />
            I want to create an author account
          </label>
        </>
      )}
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? "Please wait…" : isSignup ? "Sign up" : "Log in"}</button>
      <p className="muted">
        {isSignup ? "Already an author? " : "New author? "}
        <Link to={isSignup ? "/login" : "/signup"} state={location.state}>
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
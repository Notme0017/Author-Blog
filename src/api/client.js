import { LIMIT } from "../utils/paging";

const BASE = import.meta.env.VITE_API_URL ?? "/api";
export const TOKEN_KEY = "blog_token";

function messages(d) {
  if (!d) return [];
  if (typeof d === "string") return [d];
  if (Array.isArray(d)) return d.flatMap(messages);
  if (typeof d === "object") {
    for (const k of ["msg", "message", "error", "errors"]) {
      if (d[k]) {
        const m = messages(d[k]);
        if (m.length) return m;
      }
    }
    return Object.values(d).flatMap(messages);
  }
  return [];
}
const errorMessage = (d) => messages(d).join(" ") || null;

async function request(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(body && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body && JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Please try again.");
  }

  if (res.status === 204) return null; // e.g. a successful DELETE has no body
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* not JSON */
  }

  if (!res.ok) {
    // Expired or invalid token: tell the auth context to log out
    if (res.status === 401 && token) window.dispatchEvent(new Event("auth:expired"));
    // Plain-text error bodies are used too, unless they look like an HTML error page
    const plain = !data && text && !text.trim().startsWith("<") ? text.slice(0, 200) : null;
    const err = new Error(errorMessage(data) || plain || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const send = (method, path, body) => request(path, { method, body });
const pick = (key) => (d) => d?.[key] ?? d; // tolerate { post: {...} } / { user: {...} } style wrappers
const paged = (path, page) => request(`${path}?page=${page}&limit=${LIMIT}`);

export const api = {
  authorSignup: (username, password) =>
    send("POST", "/auth/author/signup", { username, password, isAuthor: true }),
  login: (username, password) => send("POST", "/auth/login", { username, password }),
  me: () => request("/auth/me").then(pick("user")),

  getMyPosts: (page = 1) => paged("/posts/all", page),
  getPost: (id) => request(`/posts/${id}`).then(pick("post")),
  createPost: (data) => send("POST", "/posts", data).then(pick("post")),
  updatePost: (id, data) => send("PUT", `/posts/${id}`, data).then(pick("post")),
  setPublished: (id, published) => send("PATCH", `/posts/${id}/publish`, { publishStatus: published }).then(pick("post")),
  deletePost: (id) => send("DELETE", `/posts/${id}`),

  getComments: (postId, page = 1) => paged(`/posts/${postId}/comments`, page),
  addComment: (postId, content) =>
    send("POST", `/posts/${postId}/comments`, { content }).then(pick("comment")),
  editComment: (postId, id, content) =>
    send("PUT", `/posts/${postId}/comments/${id}`, { content }).then(pick("comment")),
  deleteComment: (postId, id) => send("DELETE", `/posts/${postId}/comments/${id}`),
};
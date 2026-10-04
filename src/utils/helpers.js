export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";

export const isMine = (post, user) => {
  const ownerId = post.user?.id ?? post.userId ?? post.authorId;
  return ownerId === undefined || String(ownerId) === String(user.id);
};

export const commentUsername = (c) =>
  c.author?.username ?? c.user?.username ?? c.username ?? (typeof c.author === "string" ? c.author : undefined);

export const commentOwnerId = (c) => c.authorId ?? c.userId ?? c.author?.id ?? c.user?.id;
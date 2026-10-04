export const LIMIT = 10;

export const hasMore = (d, list) =>
  d?.pagination ? d.pagination.currentPage < d.pagination.totalPages : list.length === LIMIT;

export const items = (d) => (Array.isArray(d) ? d : d?.posts ?? d?.comments ?? d?.data ?? []);
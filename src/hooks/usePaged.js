import { useEffect, useState } from "react";
import { hasMore, items } from "../utils/paging";

const initial = { list: [], page: 1, more: false, loading: true, loadingMore: false, error: null, moreError: null };

export default function usePaged(fetchPage, key) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    setState(initial);
    fetchPage(1)
      .then((d) => {
        if (cancelled) return;
        const list = items(d);
        setState((s) => ({ ...s, list, more: hasMore(d, list), loading: false }));
      })
      .catch((error) => !cancelled && setState((s) => ({ ...s, error, loading: false })));
    return () => {
      cancelled = true;
    };
  }, [key]);

  async function loadMore() {
    const next = state.page + 1;
    setState((s) => ({ ...s, loadingMore: true, moreError: null }));
    try {
      const d = await fetchPage(next);
      const list = items(d);
      setState((s) => {
        const seen = new Set(s.list.map((x) => x.id)); // avoid duplicates if items shifted between pages
        return { ...s, list: [...s.list, ...list.filter((x) => !seen.has(x.id))], page: next, more: hasMore(d, list), loadingMore: false };
      });
    } catch (moreError) {
      setState((s) => ({ ...s, loadingMore: false, moreError }));
    }
  }

  const setList = (fn) => setState((s) => ({ ...s, list: fn(s.list) }));

  return { ...state, loadMore, setList };
}
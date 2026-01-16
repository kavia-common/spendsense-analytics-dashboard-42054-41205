import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function pickKnown(params, keys) {
  const out = {};
  keys.forEach((k) => {
    const v = params.get(k);
    if (v !== null && String(v).trim() !== "") out[k] = v;
  });
  return out;
}

function toSearchParams(obj) {
  const sp = new URLSearchParams();
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  return sp;
}

// PUBLIC_INTERFACE
export function useQueryFilters(keys) {
  /**
   * Hook that reads/writes a filter object from URL query params.
   * - keys: list of allowed filter param names (whitelist)
   */
  const location = useLocation();
  const navigate = useNavigate();

  const value = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return pickKnown(params, keys);
  }, [location.search, keys]);

  const setValue = useCallback(
    (next) => {
      const sp = toSearchParams(next);
      const search = sp.toString();
      navigate(
        {
          pathname: location.pathname,
          search: search ? `?${search}` : ""
        },
        { replace: true }
      );
    },
    [location.pathname, navigate]
  );

  return { value, setValue };
}

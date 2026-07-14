import { useEffect } from 'react';

/** Set document title without react-helmet (avoids removeChild races on route change). */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

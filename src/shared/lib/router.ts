import { useEffect, useState } from 'react';

export function go(path: string) {
  window.location.hash = path;
}

export function useRoute() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/projects');
  useEffect(() => {
    const update = () => setRoute(window.location.hash.slice(1) || '/projects');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route.split('/').filter(Boolean);
}

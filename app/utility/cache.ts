export function getCached<T>(key: string, CACHE_TTL_MS: number): T | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  const { data, timestamp } = JSON.parse(raw);
  if (Date.now() - timestamp > CACHE_TTL_MS) return null;
  return data as T;
}

export function setCached<T>(key: string, data: T) {
  sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

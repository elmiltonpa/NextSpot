const ipCache = new Map<string, { count: number; lastAttempt: number }>();

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userData = ipCache.get(ip);

  if (!userData) {
    ipCache.set(ip, { count: 1, lastAttempt: now });
    return false;
  }

  if (now - userData.lastAttempt > WINDOW_MS) {
    ipCache.set(ip, { count: 1, lastAttempt: now });
    return false;
  }

  userData.count++;

  if (userData.count > MAX_ATTEMPTS) {
    return true;
  }

  return false;
}

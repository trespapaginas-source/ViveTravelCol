const FAVORITES_KEY = "vive-travel-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(cabinId: string): boolean {
  return getFavorites().includes(cabinId);
}

export function toggleFavorite(cabinId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(cabinId);
  if (index === -1) {
    favorites.push(cabinId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true; // now favorite
  } else {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false; // no longer favorite
  }
}

const WatchlistKey = "crypto-watchlist";

export const getWatchList = (): string[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WatchlistKey) || "[]");
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addToWatchList = (id: string) => {
  const current = getWatchList();
  if (!current.includes(id)) {
    localStorage.setItem(WatchlistKey,JSON.stringify([...current, id]));
  }
};

export const removeFromWatchList = (id: string) => {
  const current = getWatchList().filter((coinId) => coinId !== id);
  localStorage.setItem(WatchlistKey, JSON.stringify(current));
};

export const isInWatchList = (id: string): boolean => {
    return getWatchList().includes(id)
};

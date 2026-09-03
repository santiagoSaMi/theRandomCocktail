const STORAGE_KEY = 'random-cocktail:favorites';

export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

export function isFavorite(id) {
    return getFavorites().some(cocktail => cocktail.id === id);
}

export function addFavorite(cocktail) {
    const favorites = getFavorites();

    if (favorites.some(item => item.id === cocktail.id)) {
        return favorites;
    }

    const updated = [...favorites, cocktail];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export function removeFavorite(id) {
    const updated = getFavorites().filter(cocktail => cocktail.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

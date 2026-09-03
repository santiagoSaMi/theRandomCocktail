export function renderFavorites(container, favorites) {
    if (!favorites.length) {
        container.innerHTML = '<div class="no-favorites">Your collection is empty. Discover a cocktail and save it here.</div>';
        return;
    }

    container.innerHTML = favorites.map(cocktail => `
        <article class="favorite-card">
            <img src="${escapeHTML(cocktail.image)}" alt="${escapeHTML(cocktail.name)}" loading="lazy">
            <div class="favorite-card-body">
                <h3>${escapeHTML(cocktail.name)}</h3>
                <div class="favorite-card-actions">
                    <button class="button button-secondary" data-action="view" data-id="${escapeHTML(cocktail.id)}" type="button">View</button>
                    <button class="button button-secondary" data-action="remove" data-id="${escapeHTML(cocktail.id)}" type="button" aria-label="Remove ${escapeHTML(cocktail.name)} from favorites">Remove</button>
                </div>
            </div>
        </article>
    `).join('');
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

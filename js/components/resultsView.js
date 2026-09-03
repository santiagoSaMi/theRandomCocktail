function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

export function renderResults(container, cocktails, favorites) {
    if (!cocktails.length) {
        container.innerHTML = `
            <div class="results-empty">
                <span class="empty-icon" aria-hidden="true">⌕</span>
                <h3>No cocktails found.</h3>
                <p>Try another name, category or ingredient.</p>
            </div>`;
        return;
    }

    const favoriteIds = new Set(favorites.map(item => item.id));
    container.innerHTML = cocktails.map(cocktail => {
        const id = cocktail.idDrink;
        const name = cocktail.strDrink;
        const image = cocktail.strDrinkThumb;
        const favorite = favoriteIds.has(id);
        return `
            <article class="result-card">
                <button class="result-image-button" type="button" data-action="view-result" data-id="${escapeHTML(id)}" aria-label="View ${escapeHTML(name)}">
                    <img src="${escapeHTML(image)}" alt="${escapeHTML(name)}" loading="lazy">
                </button>
                <div class="result-body">
                    <div>
                        <p class="result-category">${escapeHTML(cocktail.strCategory || 'Cocktail')}</p>
                        <h3>${escapeHTML(name)}</h3>
                    </div>
                    <button class="icon-button ${favorite ? 'is-favorite' : ''}" type="button" data-action="toggle-result-favorite" data-id="${escapeHTML(id)}" aria-label="${favorite ? 'Remove' : 'Add'} ${escapeHTML(name)} ${favorite ? 'from' : 'to'} favorites" aria-pressed="${favorite}">
                        <span aria-hidden="true">${favorite ? '♥' : '♡'}</span>
                    </button>
                </div>
            </article>`;
    }).join('');
}

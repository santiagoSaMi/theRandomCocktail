import { isFavorite } from '../services/favoritesService.js';

export function renderCocktail(container, cocktail) {
    const favorite = isFavorite(cocktail.id);

    container.classList.remove('is-empty');
    container.innerHTML = `
        <div class="cocktail-content">
            <div class="cocktail-image-wrap">
                <img class="cocktail-image" src="${escapeAttribute(cocktail.image)}" alt="${escapeAttribute(cocktail.name)}" loading="lazy">
            </div>
            <div class="cocktail-info">
                <p class="eyebrow">DISCOVERED COCKTAIL</p>
                <h2 class="cocktail-title">${escapeHTML(cocktail.name)}</h2>
                <div class="cocktail-meta">
                    ${cocktail.category ? `<span class="meta-pill">${escapeHTML(cocktail.category)}</span>` : ''}
                    ${cocktail.alcoholic ? `<span class="meta-pill">${escapeHTML(cocktail.alcoholic)}</span>` : ''}
                    ${cocktail.glass ? `<span class="meta-pill">${escapeHTML(cocktail.glass)}</span>` : ''}
                </div>

                <h3>Ingredients</h3>
                <ul class="ingredients">
                    ${cocktail.ingredients.map(({ ingredient, measure }) => `
                        <li class="ingredient">
                            <span>${escapeHTML(ingredient)}</span>
                            <span>${escapeHTML(measure)}</span>
                        </li>
                    `).join('')}
                </ul>

                <h3>Instructions</h3>
                <p class="instructions">${escapeHTML(cocktail.instructions || 'No instructions available.')}</p>

                <div class="cocktail-actions">
                    <button class="button button-secondary favorite-button ${favorite ? 'is-favorite' : ''}" data-action="favorite" type="button">
                        ${favorite ? '♥ Saved' : '♡ Add to favorites'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function renderLoading(container) {
    container.classList.remove('is-empty');
    container.innerHTML = `
        <div class="cocktail-content">
            <div class="cocktail-image-wrap skeleton"></div>
            <div class="cocktail-info skeleton"></div>
        </div>
    `;
}

export function renderError(container, message) {
    container.classList.remove('is-empty');
    container.innerHTML = `
        <div class="error-state">
            <span class="empty-icon" aria-hidden="true">!</span>
            <h2>Something went wrong.</h2>
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function escapeAttribute(value = '') {
    return escapeHTML(value);
}

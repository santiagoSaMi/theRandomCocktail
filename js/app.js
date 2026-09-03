import { getCocktailById, getRandomCocktail } from './api/cocktailApi.js';
import { renderCocktail, renderError, renderLoading } from './components/cocktailView.js';
import { renderFavorites } from './components/favoritesView.js';
import { addFavorite, getFavorites, isFavorite, removeFavorite } from './services/favoritesService.js';
import { normalizeCocktail } from './utils/cocktail.js';

const randomButton = document.querySelector('#random-button');
const cocktailCard = document.querySelector('#cocktail-card');
const cocktailStatus = document.querySelector('#cocktail-status');
const favoritesGrid = document.querySelector('#favorites-grid');
const favoriteCount = document.querySelector('#favorite-count');
const favoritesSummary = document.querySelector('#favorites-summary');

let currentCocktail = null;

function updateFavoritesUI() {
    const favorites = getFavorites();
    renderFavorites(favoritesGrid, favorites);
    favoriteCount.textContent = favorites.length;
    favoritesSummary.textContent = favorites.length === 0
        ? 'No favorites yet'
        : `${favorites.length} saved cocktail${favorites.length === 1 ? '' : 's'}`;
}

async function loadRandomCocktail() {
    setBusy(true);
    renderLoading(cocktailCard);
    cocktailStatus.textContent = 'Finding something delicious...';

    try {
        const drink = await getRandomCocktail();
        currentCocktail = normalizeCocktail(drink);
        renderCocktail(cocktailCard, currentCocktail);
        cocktailStatus.textContent = '';
    } catch (error) {
        renderError(cocktailCard, 'We could not reach the cocktail service. Please try again.');
        cocktailStatus.textContent = error.message;
    } finally {
        setBusy(false);
    }
}

async function loadCocktailById(id) {
    setBusy(true);
    renderLoading(cocktailCard);
    cocktailStatus.textContent = 'Loading cocktail details...';

    try {
        const drink = await getCocktailById(id);
        currentCocktail = normalizeCocktail(drink);
        renderCocktail(cocktailCard, currentCocktail);
        cocktailStatus.textContent = '';
        document.querySelector('#discover').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        renderError(cocktailCard, 'We could not load that cocktail. Please try again.');
        cocktailStatus.textContent = error.message;
    } finally {
        setBusy(false);
    }
}

function setBusy(busy) {
    randomButton.disabled = busy;
    randomButton.querySelector('span').textContent = busy ? 'Discovering...' : 'Surprise me';
}

randomButton.addEventListener('click', loadRandomCocktail);

cocktailCard.addEventListener('click', event => {
    const button = event.target.closest('[data-action="favorite"]');
    if (!button || !currentCocktail) return;

    if (isFavorite(currentCocktail.id)) {
        removeFavorite(currentCocktail.id);
        cocktailStatus.textContent = `${currentCocktail.name} was removed from your favorites.`;
    } else {
        addFavorite(currentCocktail);
        cocktailStatus.textContent = `${currentCocktail.name} is in your favorites.`;
    }

    updateFavoritesUI();
    renderCocktail(cocktailCard, currentCocktail);
});

favoritesGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === 'remove') {
        removeFavorite(id);
        updateFavoritesUI();
        return;
    }

    if (action === 'view') {
        loadCocktailById(id);
    }
});

updateFavoritesUI();

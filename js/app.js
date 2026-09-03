import { getCategories, getCocktailById, getIngredients, getRandomCocktail, searchCocktails, filterCocktailsByCategory, filterCocktailsByIngredient } from './api/cocktailApi.js';
import { renderCocktail, renderError, renderLoading } from './components/cocktailView.js';
import { renderFavorites } from './components/favoritesView.js';
import { renderResults } from './components/resultsView.js';
import { addFavorite, getFavorites, isFavorite, removeFavorite } from './services/favoritesService.js';
import { normalizeCocktail } from './utils/cocktail.js';

const randomButton = document.querySelector('#random-button');
const cocktailCard = document.querySelector('#cocktail-card');
const cocktailStatus = document.querySelector('#cocktail-status');
const favoritesGrid = document.querySelector('#favorites-grid');
const favoriteCount = document.querySelector('#favorite-count');
const favoritesSummary = document.querySelector('#favorites-summary');
const themeToggle = document.querySelector('#theme-toggle');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const categoryFilter = document.querySelector('#category-filter');
const ingredientFilter = document.querySelector('#ingredient-filter');
const clearFilters = document.querySelector('#clear-filters');
const resultsGrid = document.querySelector('#results-grid');
const exploreStatus = document.querySelector('#explore-status');
const searchSummary = document.querySelector('#search-summary');

let currentCocktail = null;
let currentResults = [];

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    themeToggle.querySelector('span').textContent = dark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name=theme-color]').setAttribute('content', dark ? '#171412' : '#f7f3ed');
}

const savedTheme = localStorage.getItem('random-cocktail:theme');
const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(preferredTheme);

function updateFavoritesUI() {
    const favorites = getFavorites();
    renderFavorites(favoritesGrid, favorites);
    favoriteCount.textContent = favorites.length;
    favoritesSummary.textContent = favorites.length === 0 ? 'No favorites yet' : `${favorites.length} saved cocktail${favorites.length === 1 ? '' : 's'}`;
    if (currentResults.length) renderResults(resultsGrid, currentResults, favorites);
}

async function loadRandomCocktail() {
    setBusy(true);
    renderLoading(cocktailCard);
    cocktailStatus.textContent = 'Finding something delicious...';
    try {
        currentCocktail = normalizeCocktail(await getRandomCocktail());
        renderCocktail(cocktailCard, currentCocktail);
        cocktailStatus.textContent = '';
    } catch (error) {
        renderError(cocktailCard, 'We could not reach the cocktail service. Please try again.');
        cocktailStatus.textContent = error.message;
    } finally { setBusy(false); }
}

async function loadCocktailById(id) {
    setBusy(true);
    renderLoading(cocktailCard);
    cocktailStatus.textContent = 'Loading cocktail details...';
    try {
        currentCocktail = normalizeCocktail(await getCocktailById(id));
        renderCocktail(cocktailCard, currentCocktail);
        cocktailStatus.textContent = '';
        document.querySelector('#discover').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        renderError(cocktailCard, 'We could not load that cocktail. Please try again.');
        cocktailStatus.textContent = error.message;
    } finally { setBusy(false); }
}

function setBusy(busy) {
    randomButton.disabled = busy;
    randomButton.querySelector('span').textContent = busy ? 'Discovering...' : 'Surprise me';
}

function populateSelect(select, items, labelKey) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        const value = item[labelKey];
        if (!value) return;
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        fragment.appendChild(option);
    });
    select.appendChild(fragment);
}

async function loadFilterOptions() {
    try {
        const [categories, ingredients] = await Promise.all([getCategories(), getIngredients()]);
        populateSelect(categoryFilter, categories, 'strCategory');
        populateSelect(ingredientFilter, ingredients, 'strIngredient1');
    } catch {
        exploreStatus.textContent = 'Filters could not be loaded. Search is still available.';
    }
}

async function runSearch() {
    const query = searchInput.value.trim();
    const category = categoryFilter.value;
    const ingredient = ingredientFilter.value;

    if (!query && !category && !ingredient) {
        currentResults = [];
        resultsGrid.innerHTML = '';
        exploreStatus.textContent = '';
        searchSummary.textContent = 'Search by name or filter your options';
        return;
    }

    exploreStatus.textContent = 'Searching the bar...';
    resultsGrid.innerHTML = '<div class="results-loading">Loading cocktails...</div>';

    try {
        let results;
        if (query) results = await searchCocktails(query);
        else if (category) results = await filterCocktailsByCategory(category);
        else results = await filterCocktailsByIngredient(ingredient);

        if (category && query) results = results.filter(item => item.strCategory === category);
        if (ingredient && query) {
            results = results.filter(item => Array.from({ length: 15 }, (_, i) => item[`strIngredient${i + 1}`]).some(value => value?.toLowerCase() === ingredient.toLowerCase()));
        }
        currentResults = results;
        renderResults(resultsGrid, results, getFavorites());
        exploreStatus.textContent = results.length ? '' : 'No cocktails match those filters.';
        searchSummary.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
    } catch (error) {
        currentResults = [];
        resultsGrid.innerHTML = '';
        exploreStatus.textContent = error.message;
        searchSummary.textContent = 'Search by name or filter your options';
    }
}

randomButton.addEventListener('click', loadRandomCocktail);

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('random-cocktail:theme', nextTheme);
    applyTheme(nextTheme);
});

searchForm.addEventListener('submit', event => { event.preventDefault(); runSearch(); });
categoryFilter.addEventListener('change', runSearch);
ingredientFilter.addEventListener('change', runSearch);
clearFilters.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    ingredientFilter.value = '';
    currentResults = [];
    resultsGrid.innerHTML = '';
    exploreStatus.textContent = '';
    searchSummary.textContent = 'Search by name or filter your options';
});

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
    if (action === 'remove') { removeFavorite(id); updateFavoritesUI(); return; }
    if (action === 'view') loadCocktailById(id);
});

resultsGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    const result = currentResults.find(item => item.idDrink === id);
    if (!result) return;
    if (action === 'view-result') loadCocktailById(id);
    if (action === 'toggle-result-favorite') {
        const normalized = normalizeCocktail(result);
        if (isFavorite(id)) removeFavorite(id); else addFavorite(normalized);
        updateFavoritesUI();
    }
});

updateFavoritesUI();
loadFilterOptions();

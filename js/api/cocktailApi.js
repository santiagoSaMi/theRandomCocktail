const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

async function request(endpoint, allowEmpty = false) {
    const response = await fetch(`${API_BASE}/${endpoint}`);

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!allowEmpty && !data.drinks?.length) {
        throw new Error('No cocktails found.');
    }

    return data.drinks || [];
}

export async function getRandomCocktail() {
    return (await request('random.php'))[0];
}

export async function getCocktailById(id) {
    return (await request(`lookup.php?i=${encodeURIComponent(id)}`))[0];
}

export function searchCocktails(query) {
    return request(`search.php?s=${encodeURIComponent(query)}`, true);
}

export function filterCocktailsByCategory(category) {
    return request(`filter.php?c=${encodeURIComponent(category)}`, true);
}

export function filterCocktailsByIngredient(ingredient) {
    return request(`filter.php?i=${encodeURIComponent(ingredient)}`, true);
}

export async function getCategories() {
    const response = await fetch(`${API_BASE}/list.php?c=list`);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const data = await response.json();
    return data.drinks || [];
}

export async function getIngredients() {
    const response = await fetch(`${API_BASE}/list.php?i=list`);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const data = await response.json();
    return data.drinks || [];
}

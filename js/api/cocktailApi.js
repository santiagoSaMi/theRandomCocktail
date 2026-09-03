const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

async function request(endpoint) {
    const response = await fetch(`${API_BASE}/${endpoint}`);

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.drinks?.length) {
        throw new Error('No cocktails found.');
    }

    return data.drinks[0];
}

export function getRandomCocktail() {
    return request('random.php');
}

export function getCocktailById(id) {
    return request(`lookup.php?i=${encodeURIComponent(id)}`);
}

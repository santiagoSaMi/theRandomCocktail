export function normalizeCocktail(drink) {
    return {
        id: drink.idDrink,
        name: drink.strDrink,
        category: drink.strCategory,
        alcoholic: drink.strAlcoholic,
        glass: drink.strGlass,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients: getIngredients(drink)
    };
}

function getIngredients(drink) {
    const ingredients = [];

    for (let i = 1; i <= 15; i += 1) {
        const ingredient = drink[`strIngredient${i}`]?.trim();
        const measure = drink[`strMeasure${i}`]?.trim();

        if (ingredient) {
            ingredients.push({ ingredient, measure: measure || '' });
        }
    }

    return ingredients;
}

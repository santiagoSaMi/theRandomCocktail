const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
const saved = document.getElementById('guardados');
const contenedor = document.getElementById('random_item');

document.addEventListener('DOMContentLoaded', function() {
    mostrarFavoritos();
});

function limpiarDatos() {
    contenedor.innerHTML = '';
}

function obtenerCoctel() {
    limpiarDatos();
    contenedor.innerHTML = '<p>...........CARGANDO..............</p>';
    pedirCoctel()
    .then(data => mostrarCoctel(data))
    .catch(error => console.error('Error: ',error));
    
}

async function pedirCoctel() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function mostrarCoctel(data) {
    limpiarDatos();
    contenedor.innerHTML = `
        <p>ID: ${data.drinks[0].idDrink}</p>
        <p>Name: ${data.drinks[0].strDrink}</p>
        <p>Category: ${data.drinks[0].strCategory}</p>
        <p>Ingredient 1: ${data.drinks[0].strIngredient1} (${data.drinks[0].strMeasure1})</p>
        <p>Ingredient 2: ${data.drinks[0].strIngredient2} (${data.drinks[0].strMeasure2})</p>
        <p>Ingredient 3: ${data.drinks[0].strIngredient3} (${data.drinks[0].strMeasure3})</p>
        <p>Ingredient 4: ${data.drinks[0].strIngredient4} (${data.drinks[0].strMeasure4})</p>
        <p>Ingredient 5: ${data.drinks[0].strIngredient5} (${data.drinks[0].strMeasure5})</p>
        <p>Instructions: ${data.drinks[0].strInstructions}</p>
        <button onclick="nuevoFavorito('${data.drinks[0].idDrink}','${data.drinks[0].strDrink}')">FAVORITE</button>
        `;
    document.getElementById('imagen').src=`${data.drinks[0].strDrinkThumb}`;
    
}

function nuevoFavorito(id,nombre) {
    console.log('funciona');
    let cocteles = JSON.parse(localStorage.getItem('cocteles')) || [];
    cocteles.push({id, nombre});
    localStorage.setItem('cocteles', JSON.stringify(cocteles));
    mostrarFavoritos();
}

function mostrarFavoritos(){
    let cocteles = JSON.parse(localStorage.getItem('cocteles')) || [];
    cocteles.forEach(coctel =>{
        saved.innerHTML += `
            <div>
                <p>${coctel.nombre}</p>
                <button onclick="mostrarFavorito('${coctel.id}')">DETAILS</button>
            </div>
        `;
    });
}

function mostrarFavorito(id){
    limpiarDatos();
    contenedor.innerHTML = '<p>...........CARGANDO..............</p>';

    pedirEspecifico(id)
    .then(data => mostrarCoctel(data))
    .catch(error => console.error('Error: ',error));
}

async function pedirEspecifico(id){
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data;
}

# 🍸 The Random Cocktail

A modern vanilla JavaScript application for discovering, exploring and saving cocktail recipes using [TheCocktailDB](https://www.thecocktaildb.com/).

## ✨ Features

- 🎲 Discover a random cocktail
- 📖 View complete cocktail details
- 🧪 Dynamically render ingredients and measurements
- ❤️ Save favorite cocktails with LocalStorage
- 🗑️ Remove saved cocktails
- 📱 Responsive interface
- ♿ Semantic HTML and accessible interactive elements
- 🧩 Modular JavaScript architecture
- 🛡️ Basic UI-safe rendering for API data

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript ES Modules
- Fetch API
- LocalStorage
- TheCocktailDB API

## 🏗️ Project structure

```text
.
├── index.html
├── assets/
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
└── js/
    ├── api/
    │   └── cocktailApi.js
    ├── components/
    │   ├── cocktailView.js
    │   └── favoritesView.js
    ├── services/
    │   └── favoritesService.js
    ├── utils/
    │   └── cocktail.js
    └── app.js
```

## 🚀 Getting started

Because the project uses JavaScript modules, run it through a local development server instead of opening `index.html` directly with `file://`.

For example, with VS Code, install **Live Server** and open `index.html` with the extension.

## 🔌 API

This project uses TheCocktailDB for cocktail data. No API key is required for the current endpoints used by this project.

## 📚 What this project demonstrates

This project was originally created as a small vanilla JavaScript exercise. It has been reworked into a more maintainable frontend application with separation between API communication, state persistence, data normalization and UI rendering.

The project intentionally avoids a frontend framework to demonstrate core web platform skills such as ES modules, asynchronous JavaScript, DOM events, API consumption and browser storage.

## 🔮 Future improvements

- Cocktail search
- Category and ingredient filters
- Dark mode
- Favorites export/import
- Automated tests
- GitHub Pages deployment

## 📄 License

MIT



### Sharing recipes

Every recipe can be shared with a URL containing its cocktail ID. Opening that URL loads the recipe directly, making individual cocktails easy to bookmark or send to someone else.

### Local development

Because the project uses ES modules, run it through a local HTTP server such as VS Code Live Server or:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
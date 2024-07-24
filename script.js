const categoryUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const cocktailList = document.querySelector('#cocktailList');
const cocktailDetails = document.querySelector('#cocktailDetails');

fetch(categoryUrl)
    .then(response => response.json())
    .then(data => {
        const categories = data.drinks;
        cocktailList.innerHTML = categories.map((category, index) => {
            return `<option value="${category.strCategory}">${category.strCategory}</option>`;
        }).join('');

        cocktailList.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            fetchCocktailsByCategory(selectedCategory);
        });

        if (categories.length > 0) {
            fetchCocktailsByCategory(categories[0].strCategory);
        }
    })
    .catch(error => console.error('Error fetching categories:', error));

function fetchCocktailsByCategory(category) {
    const cocktailsUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;

    fetch(cocktailsUrl)
        .then(response => response.json())
        .then(data => {
            const cocktails = data.drinks;
            const cocktailPromises = cocktails.map(cocktail => {
                const cocktailDetailsUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`;
                return fetch(cocktailDetailsUrl).then(response => response.json());
            });

            Promise.all(cocktailPromises)
                .then(cocktailDetailsArray => {
                    cocktailDetails.innerHTML = cocktailDetailsArray.map(cocktailData => {
                        const cocktail = cocktailData.drinks[0];
                        return `
                                    <div class="cocktail">
                                        <h2>${cocktail.strDrink}</h2>
                                        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" width="200">
                                        <p>${cocktail.strInstructions}</p>
                                    </div>
                                `;
                    }).join('');
                });
        })
        .catch(error => console.error('Error fetching cocktails:', error));
}
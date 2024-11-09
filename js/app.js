const API_KEY = "27c89344-5f72-400e-9ab2-63b004080f4e";
const API_URL_BASE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";

const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getBoxOffice(API_URL_BASE);

async function getBoxOffice(url) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });

    const respData = await res.json();
    showMovies(respData);
    
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    }else if (vote > 5) {
        return "orange";
    }else {
        return "red";
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector('.movies');

    // Очистка контейнера перед добавлением новых элементов
    document.querySelector(".movies").innerHTML = "";


    // Проверяем, есть ли в ответе свойство films и является ли оно массивом
    if (data.films && Array.isArray(data.films)) {
        data.films.forEach((movie) => {
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
                <div class="movie__cover-inner">
                    <img src="${movie.posterUrlPreview}" 
                    class="movie__cover" 
                    alt="${movie.nameRu}">
                    <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__cotegory">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
                    ${movie.rating && (`
                    <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>`)}
                </div>`;
            moviesEl.appendChild(movieEl);
        });
    } else {
        console.error("Ошибка: структура данных отличается от ожидаемой.");
    }
}


const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (el) => {
    el.preventDefault();
    
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if(search.value) {
        getBoxOffice(apiSearchUrl);

        search.value = '';
    }
});
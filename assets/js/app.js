const API_KEY = "27c89344-5f72-400e-9ab2-63b004080f4e";
const API_URL_BASE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";

const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getMovies(API_URL_BASE);

async function getMovies(url) {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const respData = await resp.json();
    showMovies(respData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  // Очищаем предыдущие фильмы
  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <div class="movie__cover-inner">
            <img
            src="${movie.posterUrlPreview}"
            class="movie__cover"
            alt="${movie.nameRu}"
            />
            <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
            )}</div>
            ${
            movie.rating &&
            `
            <div class="movie__average movie__average--${getClassByRate(
            movie.rating
            )}">${movie.rating}</div>
            `
            }
        </div>
        `;
    movieEl.addEventListener("click", () => openModal(movie.filmId));
    moviesEl.appendChild(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});


// Модальное окно
const modalEl = document.querySelector('.modal');   

async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
    });
    const data = await resp.json();

    modalEl.classList.toggle("modal--show");
    document.body.classList.add("stop-scrolling");

    modalEl.innerHTML = `
    <div class="modal__card">
        <img class="modal__movie-backdrop" src="${data.posterUrl}" alt="">
        <h2>
            <span class="modal__movie-title">${data.nameRu}</span>
            <span class="modal__movie-release-year">${data.year}</span>
        </h2>
        <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">${data.genres.map((el) => ` <span>${el.genre}</span>`)}</li>
            ${data.filmLength ? `<li class="modal__movie-runtime">${data.filmLength} мин</li>` : ''}
            <li>Сайт: <a href="${data.webUrl}" class="modal__movie-site">${data.webUrl}</a></li>
            <li class="modal__movie-overview">${data.description}</li>
        </ul>
        <button type="button" class="modal__button-close">Закрыть</button>
    </div>
    `;
    const btnClose = document.querySelector('.modal__button-close');
    btnClose.addEventListener('click', () => closeModal());
}

function closeModal() {
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
    if (e.target === modalEl) {
        closeModal();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();       
    } 
});


































































// const allMovies = [
//     { title: "Фильм 1", category: "Кинопремьеры", rating: 7.8, year: 2023 },
//     { title: "Фильм 2", category: "Latte", rating: 6.5, year: 2021 },
//     { title: "Фильм 3", category: "Кинопремьеры", rating: 8.3, year: 2024 },
//     { title: "Фильм 4", category: "Green Tea", rating: 7.2, year: 2022 },
//     { title: "Фильм 5", category: "Кинопремьеры", rating: 6.9, year: 2020 },
// ];

// // Функция для отображения фильмов
// function renderMovies(movies) {
//     const movieContainer = document.querySelector('.movies');
//     movieContainer.innerHTML = ''; // очищаем старые карточки

//     movies.forEach(movie => {
//         const movieCard = document.createElement('div');
//         movieCard.classList.add('movie');
//         movieCard.innerHTML = `
//             <div class="movie__cover">
//                 <h3 class="movie__title">${movie.title}</h3>
//                 <p class="movie__category">${movie.category}</p>
//                 <p class="movie__rating">Рейтинг: ${movie.rating}</p>
//                 <p class="movie__year">Год: ${movie.year}</p>
//             </div>
//         `;
//         movieContainer.appendChild(movieCard);
//     });
// }

// // Фильтрация по категории
// document.getElementById('filter-category').addEventListener('change', function() {
//     const selectedCategory = this.value;
//     let filteredMovies = allMovies;

//     if (selectedCategory === "2") {
//         filteredMovies = allMovies.filter(movie => movie.category === "Кинопремьеры");
//     } else if (selectedCategory === "3") {
//         filteredMovies = allMovies.filter(movie => movie.category === "Latte");
//     } else if (selectedCategory === "4") {
//         filteredMovies = allMovies.filter(movie => movie.category === "Green Tea");
//     }

//     renderMovies(filteredMovies);
// });

// // Фильтрация по рейтингу (например, по году)
// document.getElementById('filter-rating').addEventListener('change', function() {
//     const selectedFilter = this.value;
//     let sortedMovies = [...allMovies];

//     if (selectedFilter === "year") {
//         sortedMovies.sort((a, b) => b.year - a.year);
//     } else if (selectedFilter === "rating") {
//         sortedMovies.sort((a, b) => b.rating - a.rating);
//     }

//     renderMovies(sortedMovies);
// });

// // Изначально отображаем все фильмы
// renderMovies(allMovies);
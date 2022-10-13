const baseUrl = 'https://api.themoviedb.org/3';
const apiKey = 'a91ddca94552de06405c36b7f9fdf960';
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';

let films = [];

const MovieCard = (title, rating, release, imgUrl) => {
  const date = new Date(release);
  const newDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `
    <div class="col-md-4 d-flex align-items-stretch">
      <div class="card" style="width: 18rem;">
          <img src="${imgUrl}" class="card-img-top" alt="${title} poster">
          <div class="card-body">
              <div class="row">
                  <div class="col-6">
                      <p>${title}</p>
                  </div>
                  <div class="col-6 text-end">
                      <p><b>${rating}</b></p>
                  </div>
              </div>
              <p class="card-text">${newDate}</p>
          </div>
      </div>
    </div>
  `;
};

const refresh = () => {
  let moviesHtml = '';

  films.forEach((movie) => {
    moviesHtml += MovieCard(
      movie.title,
      movie.vote_average,
      movie.release_date,
      imgBaseUrl + movie.poster_path,
    );
  });

  document.getElementById('movieList').innerHTML = moviesHtml;
};

const popularMovie = async () => {
  const response = await fetch(
    baseUrl +
    `/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=1`, {
    method: 'GET',
  });

  const responseJson = await response.json();
  return responseJson.results;
};

const searchMovie = async (query) => {
  const response = await fetch(
    baseUrl +
    `/search/movie?api_key=${apiKey}&query=${query}&page=1`, {
    method: 'GET',
  });

  const responseJson = await response.json();
  return responseJson.results;
};

const initData = async () => {
  films = await popularMovie();
  refresh();
}

const searchHandler = async (event) => {
  event.preventDefault();

  const query = document.getElementById('search').value.trim();

  if (query.length > 0) {
    films = await searchMovie(query);
    refresh();
    return
  }

  initData();
}

document.getElementById('submitSearch').addEventListener('click', searchHandler);

window.onload = async () => {
  await initData();
};
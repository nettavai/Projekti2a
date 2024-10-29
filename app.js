// Elementit
const theaterSelect = document.getElementById('theaterSelect');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieContainer = document.getElementById('movieContainer');

// Teatterit
function fetchTheaters() {
  fetch('http://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const theaters = xml.querySelectorAll('TheatreArea');
      theaters.forEach(theater => {
        const option = document.createElement('option');
        option.value = theater.querySelector('ID').textContent;
        option.textContent = theater.querySelector('Name').textContent;
        theaterSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching theaters:', error));
}

// Showtimes
function fetchMovies(theaterID) {
  const url = `http://www.finnkino.fi/xml/Schedule/?area=${theaterID}`;
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const shows = xml.querySelectorAll('Show');
      movieContainer.innerHTML = ''; // tyhjennys

      shows.forEach(show => {
        const title = show.querySelector('Title').textContent;
        const imageUrl = show.querySelector('EventMediumImagePortrait').textContent;
        const startTime = show.querySelector('dttmShowStart').textContent;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        movieDiv.innerHTML = `
          <img src="${imageUrl}" alt="${title}">
          <h3>${title}</h3>
          <p>Showtime: ${new Date(startTime).toLocaleTimeString()}</p>
        `;

        movieContainer.appendChild(movieDiv);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}

// Event listeners
theaterSelect.addEventListener('change', () => {
  const theaterID = theaterSelect.value;
  if (theaterID) fetchMovies(theaterID);
});

searchButton.addEventListener('click', () => {
  const searchString = searchInput.value;
  if (searchString) fetchOMDbData(searchString);
});

// Optional: Fetch additional movie details from OMDb
function fetchOMDbData(title) {
  const omdbApiKey = 'your-omdb-api-key';
  const url = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${title}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        movieContainer.innerHTML = `
          <div class="movie">
            <img src="${data.Poster}" alt="${data.Title}">
            <h3>${data.Title}</h3>
            <p>${data.Plot}</p>
            <p>Year: ${data.Year}</p>
            <p>IMDB Rating: ${data.imdbRating}</p>
          </div>
        `;
      } else {
        alert("Movie not found!");
      }
    })
    .catch(error => console.error('Error fetching OMDb data:', error));
}

// Initialize
fetchTheaters();

// Function to fetch movies from db.json
function getMovies() {
    return fetch('http://localhost:3000/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const moviesList = document.getElementById('moviesList');
            moviesList.innerHTML = ''; // Clear previous list
            data.forEach(movie => {
                moviesList.innerHTML += `<li>
                    <img src="images/${movie.posterPath}" class="poster" alt="${movie.title} Poster">
                    <span>${movie.title}</span>
                    <button class="btn btn-primary add-to-fav" data-id="${movie.id}">Add to Favourites</button>
                </li>`;
            });
            return data; // Return the JSON response
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        });
}

// Function to fetch favourites from db.json
function getFavourites() {
    return fetch('http://localhost:3000/favourites')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const favouritesList = document.getElementById('favouritesList');
            favouritesList.innerHTML = ''; // Clear previous list
            data.forEach(favourite => {
                favouritesList.innerHTML += `<li>
                    <img src="images/${favourite.posterPath}" class="poster" alt="${favourite.title} Poster">
                    <span>${favourite.title}</span>
                    <button class="btn btn-danger delete-from-fav" data-id="${favourite.id}">Delete</button>
                </li>`;
            });
            return data; // Return the JSON response
        })
        .catch(error => {
            console.error('Error fetching favourites:', error);
        });
}

// Function to add a movie to favourites
function addFavourite(movieId) {
    // Find the movie in movies list by id
    fetch(`http://localhost:3000/movies/${movieId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movie => {
            // Post movie to favourites collection in db.json
            return fetch('http://localhost:3000/favourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Reload favourites list after addition
            getFavourites(); // Alternatively, update the DOM without reloading
        })
        .catch(error => {
            console.error('Error adding favourite:', error);
        });
}

// Function to delete a favourite movie
function deleteFavourite(movieId) {
    // Delete the movie from favourites collection in db.json
    return fetch(`http://localhost:3000/favourites/${movieId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Reload favourites list after deletion
        getFavourites(); // Alternatively, update the DOM without reloading
    })
    .catch(error => {
        console.error('Error deleting favourite:', error);
    });
}

// Event listener for Add to Favourites and Delete from Favourites buttons
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-fav')) {
        const movieId = event.target.dataset.id;
        addFavourite(movieId);
    } else if (event.target.classList.contains('delete-from-fav')) {
        const movieId = event.target.dataset.id;
        deleteFavourite(movieId);
    }
});

// Initial load of movies and favourites
document.addEventListener('DOMContentLoaded', function() {
    getMovies();
    getFavourites();
});

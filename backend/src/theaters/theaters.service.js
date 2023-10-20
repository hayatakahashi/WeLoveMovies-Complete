const db = require("../db/connection");

// returns all the records from the "theaters" table in the database
function list() {
    return db("theaters");
}

// The getMovies function fetches all movies playing in a specific theater.

function getMovies(theaterId) {
    return db("movies as m")

// Joins the MOVIES table with the "movies_theaters" table based on the common "movie_id" column
        
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")

// Adds a filter to query. Filters the results to only include rows where the "theater_id" in the "movies_theaters" table matches the provided "theaterId"
       
        .where({ "mt.theater_id": theaterId })

// "m.*": Returns all columns from the movies table (because of the m alias).
// "mt.is_showing", "mt.theater_id": In addition to the movie details, it also returns the is_showing and theater_id columns from the movies_theaters table.
       
        .select("m.*", "mt.is_showing", "mt.theater_id")
}

module.exports = {
    list, 
    getMovies,
};
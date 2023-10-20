const db = require("../db/connection");

function list(isShowing) {
    if(isShowing) {
        // Giving table aliases 'm' stands for 'movies', 'mt' stands for 'movies_theaters'
        return db("movies as m")
            
            // joins two tables on a common column. Both have "movie_id"
            .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")

            // Filter the rows that are going to be returned. Anything where "is_showing" is true will be returned.
            .where({ "mt.is_showing":true })

            // Selecting "all columns" on the movies table to be shown.
            .select("m.*")

            // Avoids duplicates from showing. Making sure only one id is shown per movie
            .groupBy("m.movie_id")
    }
    return db("movies")
}



function read(movieId) {
    return db("movies").where({ movie_id: movieId });
  }


  //This function is designed to query the database to retrieve a list of theaters where a specific movie (identified by movieId) is being played.
  // movieId: The ID of the movie you want to find theaters for.

  function listTheaters(movieId) {
    return db("theaters as t")
    
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")

// WHERE mt.movie_id = [value of movieId]
        .where({ "mt.movie_id": movieId })

// Selecting what we want to see. In this case all of "theaters" columns, "is_showing" in the "movies_theaters" table, and "movie_id" from the "movies_theaters"
        .select("t.*", "mt.is_showing", "mt.movie_id")

}

// This function JOINS the "reviews" and "critics" tables. 
function listReviewsForMovie(movieId) {
    return db("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .where({ "r.movie_id": movieId })
        .select("r.*", "c.*");
}

module.exports = {
    list,
    read,
    listTheaters,
    listReviewsForMovie,
}
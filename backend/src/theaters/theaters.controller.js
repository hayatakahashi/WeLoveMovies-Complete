const service = require("./theaters.service");
const asyncErrorBoundary = require("../utils/errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

// reduceProperties: Transform the data into a structure where each theater 
// is represented once and has a movies array containing all movies playing in that theater.
// reduceProperties("theater_id) tells reduceProperties that theater_id is the unique identifier for each row. 
// This means rows with the same theater_id should be combined.
const reduceTheaterMovies = reduceProperties("theater_id", {
    theater_id: ["theater_id"],
    name: ["name"],
    address_line_1: ["address_line_1"],
    address_line_2: ["address_line_2"],
    city: ["city"],
    state: ["state"],
    zip: ["zip"],
    created_at: ["created_at"],
    updated_at: ["updated_at"],
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    is_showing: ["movies", null, "is_showing"]
})

/* 
Overall, the goal of this function is to:

Get a list of theaters.
Fetch the movies playing in each of those theaters.
Combine the theaters and their movies into a single structured format.
Transform the combined data if needed using reduceTheaterMovies.
Send this data back as a response to the client.
 */

async function list(req, res) {
    const theaters = await service.list();

    const promises = theaters.map((theater) => {
        return service.getMovies(theater.theater_id)
    }); // for each theater in the theaters array, i'm using the getMovies function to get a list of movies playing in that specific theater.
    
    const theatersMovies = await Promise.all(promises); // Using Promise.all, you ensure that all of the promises in the promises array are resolved before proceeding. This means you're waiting for all the movie lists for each theater to be fetched. The result (theatersMovies) is an array of arrays, where each sub-array contains movies for a specific theater.

    const theatersWithMovies = theaters.map((theater, index) => {
        return { ...theater, movies: theatersMovies[index]}
    });  // the code takes two arrays (theaters and theatersMovies) and merges them into a single array (theatersWithMovies) where each theater is combined with its corresponding list of movies.

    res.json({ data: reduceTheaterMovies(theatersWithMovies) });
}


/* Example of theatersWithMovies:
{
  theater_id: 1, 
  name: "Regal City Center", 
  city: "Vancouver",
  movies: [
    { movie_id: 1, title: "Spirited Away" },
    { movie_id: 2, title: "Inception" }
  ]
}

*/



/*
In essence, reduceProperties is about organizing and grouping. It's a way to take repetitive, "flattened" data and transform it into a more logical, hierarchical format. 
This makes the data easier to work with, especially when you're sending it to a frontend application or displaying it for an end-user.
[
  {
    "theater": {
      "theater_id": 1,
      "name": "Regal City Center"
    },
    "movies": [
      {
        "movie_id": 1,
        "title": "Spirited Away",
        "rating": "PG"
      },
      {
        "movie_id": 2,
        "title": "Interstellar",
        "rating": "PG-13"
      }
    ]
  }
]

*/
module.exports = {
    list: [asyncErrorBoundary(list)]
}
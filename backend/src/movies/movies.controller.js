const service = require("./movies.service");
const asyncErrorBoundary = require("../utils/errors/asyncErrorBoundary");

// middleware to check if movie id provided exists in database.

const _paramsCheck = async (req, res, next) => {
    // Destructuring to extract the movieId property from the req.params object. Short for const movieId = req.params.movieId
    const { movieId } = req.params;
    
    // Converting movieId from a string to a number and storing in match. 
    // It is retrieved from movies.service that has a function to read the movies.
    const match = await service.read(Number(movieId)); 

    // Check if no movie was found with the given movieId or if movieId is not provided
    if (match.length === 0 || !movieId) {
        return res.status(404).json({
            error: `movieId ${movieId} does not exist in the database`
        })
    }

    // If a movie match was found, store the movie data in res.locals.
    // The [0] is needed because we're extracting the movie object from the array.
    res.locals.movie = match[0]

    // continue to the next middleware or route handler
    next();
}

async function list(req, res, next) {
    // In Express req.query refers to the parsed query string parameters of the URL
    // The key value pairs after "?" example: movies?is_showing=true || so this would look like | this is_showing: "true" |
    // req.query.is_showing gives you the value associated with the is_showing, which is true.
    // So this line of code checks the value of req.query.is_showing. Because "true" is just a string at this point, we are turning it into true (boolean)
    const isShowing = req.query.is_showing === "true";
    const movies = await service.list(isShowing);
    res.json({ data: movies });
}

async function listTheaters(req, res) {

// extracts the movieId from the req.params object. req.params holds route parameters. If your route is defined like /movies/:movieId/theaters, and you visit /movies/5/theaters, then req.params.movieId would be 5.
    const movieId = req.params.movieId;

// Now that we have the movieId, we can use the listTheaters function in movies.service.js we created earlier. 
    const theaters = await service.listTheaters(movieId)

// The response is an object with a data key, and the value of this key is the theaters array (or object) that was retrieved in the previous line. 
    res.status(200).json({  data: theaters });
}

async function read(req, res) {
    res.status(200).json({ data: res.locals.movie });
  }

//This function will retrieve the reviews + critics info for the movieId that is provided. 

async function listReviews(req, res) {
    // Extract movieId from request params. 
    const movieId = req.params.movieId
    
    // Fetch reviews for the movie now that we know the movieId to fetch. Uses the listReviewsForMovies function in reviews.service.js.
    const reviews = await service.listReviewsForMovie(movieId);
    
    // Format the response so it's like how the assessment wants. 
    // Takes each review and reformats it. Since the data has combined "reviews" and "critic" info. This step separates into their own nested object.
    // Basically on top of the review, we'll have a special section for critic info.
    const formattedReviews = reviews.map(review => {
        return {
            ...review,
            critic: {
                critic_id: review.critic_id,
                preferred_name: review.preferred_name,
                surname: review.surname,
                organization_name: review.organization_name,
                created_at: review.created_at,
                updated_at: review.updated_at,
            }
        }
    })
    
    res.json({ data: formattedReviews });
    
    }

  module.exports = {
    read: [asyncErrorBoundary(_paramsCheck), asyncErrorBoundary(read)],
    list: [asyncErrorBoundary(list)],
    listTheaters: [asyncErrorBoundary(_paramsCheck), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(_paramsCheck), asyncErrorBoundary(listReviews)]
  }
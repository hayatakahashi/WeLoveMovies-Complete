const service = require("./reviews.service");
const asyncErrorBoundary = require("../utils/errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }
    next({ status: 404, message: "Review cannot be found." });
}

async function read(req, res) {
    res.status(200).json({ data: res.locals.review });
}

async function list(req, res) {
    const reviews = await service.list();
    res.status(200).json({ data: reviews });
}


/*

Changes in reviews.controller.js:

Why: Your original controller was using res.locals.review and req.body.data to construct the updated review data. But based on your Postman request, it seemed that the body was structured as req.body directly without the data property.
The Problem: This mismatch in expected structure was leading to undefined values when trying to spread the contents into the new review object.
The Fix: We updated the spread operation in the controller to use ...req.body instead of ...req.body.data to correctly grab the review update data from the request body.

*/

async function update(req, res) {

// we're getting the data sent with the request. It checks if the request body contains a property named data. If it does, it uses that; otherwise, it falls back to using the entire request body.
    const requestData = req.body.data || req.body;

// This line uses destructuring to extract specific properties from requestData.
    const { content, score, critic_id, movie_id } = requestData;

// creating new constant that holds the new data structure of the updated review.
    const updatedReview = {

// the "..." is the spread operator in JS. Takes properties from the object "res.locals.review" from the "reviewExists" middleware function we created earlier. 
// Essentially, this is copying all existing properties of the review from res.locals.review to updatedReview.
        ...res.locals.review,

// properties content, score, critic_id, and movie_id from requestData are added 
// (or overwritten if they already exist). This ensures updatedReview contains the updated information.
        content, 
        score, 
        critic_id, 
        movie_id
    };
console.log("Review to update:", updatedReview);

// update function from reviews.service is called.
// This function is responsible for updating the review in the database.
// It takes two arguments: the ID of the review to update (extracted from the request parameters) and the data to update it with.
    const data = await service.update(req.params.reviewId, updatedReview);

    console.log("Data returned from service.update:", data);


// Now that the review has been updated, this line fetches the critic associated with the updated review.
// he getCritic function is called from reviews.service, and it fetches the critic based on the critic_id of the updated review.
    const critic = await service.getCritic(data.critic_id);

// Adding a new property called "critic" to the updated review
//  you can simply add a new property critic to the data object and set its value to the critic object:
    data.critic = critic;

    console.log("data.critic = critic:", data.critic);

//
    res.json({ data });
}

/*
Example of data.critic = critic:
{
  review_id: 1,
  content: "Great movie!",
  score: 5,
  critic_id: 123,
  critic: {
    critic_id: 123,
    name: "John Doe",
    organization: "MovieReviews Inc."
  }
}

*/

async function destroy(req, res, next) {
    const deletedRows = await service.remove(res.locals.review.review_id);

// If deletedRows > 0, the code sends a 204 No Content response because the deletion was successful.
// If no rows were deleted (i.e., deletedRows is 0), the function proceeds to the next middleware with an error indicating that the review could not be found.
    if (deletedRows > 0) {
        return res.sendStatus(204); // The 204 status code indicates that the request was successful, but there's no content to send in the response.
    }
    next({ status: 404, message: "Review cannot be found." })
}


module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(reviewExists), read],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}
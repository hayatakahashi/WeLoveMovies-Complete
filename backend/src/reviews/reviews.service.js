const db = require("../db/connection");

async function list() {
    return db("reviews");
}

/* 
Addition of .first() in reviews.service.js and getCritic function:

Why: When querying a database, even if we're confident we're retrieving a single record (like when filtering by a primary key), many query builders (including knex, which you are using) return an array of results. This is because the same query structure can return multiple rows.
The Problem: Without .first(), even if there's only one matching record, it would return an array containing that one record. So, instead of {...}, you'd get [{...}].
The Fix: By adding .first(), you explicitly tell the query to return only the first matching record, giving you a single object rather than an array of one object. This simplifies the data structure and ensures that you are working with the object directly rather than accessing the object inside an array.
*/

async function read(reviewId) {
    return db("reviews").where({ review_id: reviewId }).first();
}




// This will update the review in the database. We receive the reviewId and updatedReviewData from the controller.

// function update(reviewId, updatedReviewData) {
// // Obviously, we want to update the "reviews" data table. 
//     return db("reviews")

// // filter the records so that only the record(s) where the review_id column matches the provided reviewId will be selected.
//     .where({ review_id: reviewId })

// // tells database to update the selected record (above) with the valuse in updatedReviewData (we got this from reviews.controller).
// // "*" optional, but tells the db to return all columns of the updated record after the update is completed. You get to send the actual data. 
//     .update(updatedReviewData)

// // specified so that after the update, the entire updated record is returned. 
//     .returning("*")

// // As of now, the updatedReviewData is a object within an array. That's how KNEX automatically. It looks like this [{ data }]
// // We want just the object { updatedReviewData }. 
//     .then((updatedReviews) => updatedReviews[0]);
// }

async function update(reviewId, updatedReviewData) {
    // Step 1: Update the review.
    // Specifies that we want to update something in the "reviews" table.
    await db("reviews")
    
    // We want to target the review record with the matching reviewId
    .where({ review_id: reviewId })
    
// tells the database to update the selected review record with the new values provided in updatedReviewData.
    .update(updatedReviewData);

    // Step 2: Fetch the updated review using a separate query.
// The .first() method ensures that we get the first (and only) record from the result set. This is especially useful when you know your query will only return one record and you want that record as an object, not as an array.
    const updatedReview = await db("reviews").where({ review_id: reviewId }).first();

    // Step 3: Return the updated review.
    // Whatever calls update() will receive this updated review.
    return updatedReview;
}


/*
Let's break down .then((updatedReviews) => updatedReviews[0]):

Context: You are using Knex, a SQL query builder, to update a record in a database and then retrieve the updated record. The method .returning("*") is specified so that after the update, the entire updated record is returned. However, Knex always returns this as an array, even if it's a single record.

Example Scenario:

Imagine you've updated a review with an ID of 1, and the updated review looks like this:

{
    "review_id": 1,
    "content": "Great movie!",
    "score": 5
}
After updating with Knex and using .returning("*"), what you get is:

[
    {
        "review_id": 1,
        "content": "Great movie!",
        "score": 5
    }
]
Notice it's inside an array.

The .then() Function: After your Knex operation, the .then() function is invoked to handle the result of the update.

updatedReviews is the result of the previous operation (the array containing the updated review).
(updatedReviews) => updatedReviews[0] is an arrow function that takes updatedReviews as an argument and returns the first item in the array (i.e., updatedReviews[0]).
The purpose of this is to extract the single review object from the array so that you can work with just the object in the subsequent logic.

Result: After .then((updatedReviews) => updatedReviews[0]), instead of having:

[
    {
        "review_id": 1,
        "content": "Great movie!",
        "score": 5
    }
]

You simply have:
{
    "review_id": 1,
    "content": "Great movie!",
    "score": 5
}
This is a cleaner and more direct representation for the subsequent logic in your code. By using .then(), you're streamlining the data structure to be more manageable and predictable for the rest of your application logic.
*/

// In summary, the getCritic function facilitates the retrieval of critic details based on a given criticId,
async function getCritic(criticId) {
    return db("critics").where({ critic_id: criticId}).first();
}

// service function to delete a review based on the reviewId that comes in. 
async function remove(reviewId) {
    return db("reviews")
        
        .where({ review_id: reviewId })

        .del();
}

module.exports = {
    list,
    read,
    update,
    getCritic,
    remove,
}
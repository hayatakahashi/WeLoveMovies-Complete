if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors")
const errorHandler = require("./utils/errors/errorHandler");
const notFound = require("./utils/errors/notFound");
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

// These errors were added to the "errors" file so that it can catch the unmentioned errors in the other files.
// Always ensure that your error-handling middleware is defined after all your other routes and middlewares. The order of middleware definitions in Express is important, as they are executed in the order they're defined.
app.use(notFound);
app.use(errorHandler);

module.exports = app;

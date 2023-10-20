const router = require("express").Router();
const methodNotAllowed = require("../utils/errors/methodNotAllowed");
const controller = require("./reviews.controller");

router.route("/:reviewId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.destroy)
    .all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);


module.exports = router;
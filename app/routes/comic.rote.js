const express = require("express");

const comics = require("../controller/comic.controller");

const router = express.Router();

router
  .route("/")
  .get(comics.findAll)
  .post(comics.create)
  .delete(comics.deleteAll);

router.route("/favorite").get(comics.findAllFavorite);

router
  .route("/:id")
  .get(comics.findOne)
  .put(comics.update)
  .delete(comics.delete);

module.exports = router;

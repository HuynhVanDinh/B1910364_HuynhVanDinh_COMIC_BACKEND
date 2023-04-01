const ComicService = require("../services/comic.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.title || !req.body?.author) {
    return next(new ApiError(400, "Title and author can not be empty"));
  }
  try {
    const comicService = new ComicService(MongoDB.client);
    const document = await comicService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the comic")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const comicService = new ComicService(MongoDB.client);
    const { title, author } = req.query;
    if (title && author) {
      documents = await comicService.findByTitleAndAuthor(title, author);
    } else if (title) {
      documents = await comicService.findByTitle(title);
    } else if (author) {
      documents = await comicService.findByAuthor(author);
    } else {
      documents = await comicService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving comics"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const comicService = new ComicService(MongoDB.client);
    const document = await comicService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Comic not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving comic with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const comicService = new ComicService(MongoDB.client);
    const document = await comicService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Comic not found"));
    }
    return res.send({ message: "Comic was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating comic with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const comicService = new ComicService(MongoDB.client);
    const document = await comicService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Comic not found"));
    }
    return res.send({ message: "Comic was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete comic with id=${req.params.id}`)
    );
  }
};

exports.findAllFavorite = async (_req, res, next) => {
  try {
    const comicService = new ComicService(MongoDB.client);
    const documents = await comicService.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retreving favorite comics")
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const comicService = new ComicService(MongoDB.client);
    const documents = await comicService.deleteAll();
    return res.send({
      message: `${deleteCount} comics were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all comics")
    );
  }
};

exports.search = async (req, res, next) => {
  try {
    const comicService = new ComicService(MongoDB.client);
    const { q } = req.query;
    const documents = await comicService.search(q);
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, `Could not search comics with query=${req.query.q}`)
    );
  }
};

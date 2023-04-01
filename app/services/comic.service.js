const { ObjectId } = require("mongodb");

class ComicService {
  constructor(client) {
    this.Comic = client.db().collection("comics");
  }

  extractComicData(payload) {
    const comic = {
      title: payload.title,
      author: payload.author,
      description: payload.description,
      coverImage: payload.coverImage,
      favorite: payload.favorite,
      chapters: payload.chapters || [],
    };
    Object.keys(comic).forEach(
      (key) => comic[key] === undefined && delete comic[key]
    );
    return comic;
  }

  async create(payload) {
    const comic = this.extractComicData(payload);
    const result = await this.Comic.findOneAndUpdate(
      comic,
      { $set: { favorite: comic.favorite === true } },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Comic.find(filter);
    return await cursor.toArray();
  }
  async findByTitle(title) {
    return await this.find({
      title: { $regex: new RegExp(title), $options: "i" },
    });
  }

  async findById(id) {
    return await this.Comic.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractComicData(payload);
    const result = await this.Comic.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Comic.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }
  async deleteAll() {
    const result = await this.Comic.deleteMany({});
    return result.deletedCount;
  }
}
module.exports = ComicService;

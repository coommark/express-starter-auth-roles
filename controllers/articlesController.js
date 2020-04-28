const paginate = require("express-paginate");
const Article = require("../models/posts/Articles");

const create = async (articleData, res) => {
  const newRecord = new Article({
    ...articleData,
  });

  try {
    await newRecord.save();
    return res.status(201).json({
      message: "Aricle successfully created",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to create article",
      success: false,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Article.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
      Article.count({}),
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);
    return res.status(201).json({
      object: "list",
      has_more: paginate.hasNextPages(req)(pageCount),
      data: results,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch articles",
      success: false,
    });
  }
};

module.exports = {
  create,
  getAll,
};

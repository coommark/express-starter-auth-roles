const paginate = require("express-paginate");
const Article = require("../models/posts/Article");

const create = async (req, res) => {
  const newRecord = new Article({
    ...req.body,
    postedBy: req.user._id,
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
    console.log(req.query);
    const [results, itemCount] = await Promise.all([
      Article.find({}, "-body")
        .sort({ createdAt: -1 })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Article.count({}),
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);
    return res.status(201).json({
      object: "list",
      has_more: paginate.hasNextPages(req)(pageCount),
      data: results,
      pageCount,
      itemCount,
      currentPage: req.query.page,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch articles",
      success: false,
    });
  }
};

const getOne = async (req, res) => {
  try {
    //const item = await Article.findOne({ _id: req.params.id });
    const item = await Article.findByIdAndUpdate(req.params.id, {
      $inc: { viewsCount: 1 },
    });

    if (item) {
      console.log(item);
      return res.status(200).json(item);
    }
    return res.status(404).json({
      message: "No item found",
      success: false,
    });
  } catch {
    return res.status(500).json({
      message: "Unable to process request",
      success: false,
    });
  }
};

const updateOne = async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, req.body);
    return res.status(201).json({
      message: "Item successfully updated",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to update item",
      success: false,
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "No item found",
        success: false,
      });
    }
    return res.status(204).json({
      message: "Item successfully deleted",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to delete item",
      success: false,
    });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};

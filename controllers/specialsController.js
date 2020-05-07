const paginate = require("express-paginate");
const Special = require("../models/posts/Special");

const create = async (req, res) => {
  console.log(req.body);
  const newRecord = new Special({
    ...req.body,
    postedBy: req.user._id,
  });

  try {
    await newRecord.save();
    return res.status(201).json({
      message: "Item successfully created",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to create item",
      success: false,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Special.find({})
        .sort({ createdAt: -1 })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Special.count({}),
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
      message: "Unable to fetch items",
      success: false,
    });
  }
};

const getOne = async (req, res) => {
  try {
    //const item = await Special.findOne({ _id: req.params.id });
    const item = await Special.findByIdAndUpdate(req.params.id, {
      $inc: { viewsCount: 1 },
    });
    if (item) {
      return res.status(201).json(item);
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
    await Special.findByIdAndUpdate(req.params.id, req.body);
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
    const deleted = await Special.findByIdAndDelete(req.params.id);

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

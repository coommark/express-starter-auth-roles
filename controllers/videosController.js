const paginate = require("express-paginate");
const Video = require("../models/posts/Video");

const create = async (req, res) => {
  const newRecord = new Video({
    ...req.body,
    postedBy: req.user._id,
  });

  try {
    await newRecord.save();
    return res.status(201).json({
      message: "Video successfully created",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to create video",
      success: false,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const [results, itemCount] = await Promise.all([
      Video.find({})
        .sort({ createdAt: -1 })
        .limit(req.query.limit)
        .skip(req.skip)
        .lean()
        .exec(),
      Video.count({}),
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
      message: "Unable to fetch videos",
      success: false,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const item = await Video.findByIdAndUpdate(req.params.id, {
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
    await Video.findByIdAndUpdate(req.params.id, req.body);
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
    const deleted = await Video.findByIdAndDelete(req.params.id);

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

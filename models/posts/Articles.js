const { Schema, model } = require("mongoose");

const ArticleSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    postUrl: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("articles", ArticleSchema);

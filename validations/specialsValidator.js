const { check, validationResult } = require("express-validator");

const validationRules = () => {
  return [
    check("title")
      .isLength({ min: 2 })
      .withMessage("Title must be at least 2 characters long."),
    check("body")
      .isLength({ min: 12 })
      .withMessage("Body must be at least 12 characters long."),
    /* check("imageUrl")
      .isLength({ min: 2 })
      .withMessage("Image Url must be at least 2 characters long."), */
    check("postUrl")
      .isLength({ min: 10 })
      .withMessage("Post Url must be at least 10 characters long."),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const resultErrors = [];
  errors.array().map((err) => resultErrors.push({ [err.param]: err.msg }));
  resultErrors.push({ message: "Action unsuccessful" });
  resultErrors.push({ success: false });
  const errorObject = Object.assign({}, ...resultErrors);

  return res.status(422).json(errorObject);
};

module.exports = {
  validationRules,
  validate,
};

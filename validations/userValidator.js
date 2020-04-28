const { check, validationResult } = require("express-validator");

const validationRules = () => {
  return [
    check("email").isEmail().withMessage("Please enter a valid email address."),
    check("name").isLength({ min: 1 }).withMessage("Name is a required field."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const resultErrors = [];
  errors.array().map((err) => resultErrors.push({ [err.param]: err.msg }));
  resultErrors.push({ message: "Registration failure" });
  resultErrors.push({ success: false });
  const errorObject = Object.assign({}, ...resultErrors);

  return res.status(422).json(errorObject);
};

module.exports = {
  validationRules,
  validate,
};

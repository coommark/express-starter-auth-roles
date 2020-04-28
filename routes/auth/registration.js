const router = require("express").Router();
const { userRegister } = require("../../utils/Auth");
const {
  validationRules,
  validate,
} = require("../../validations/userValidator");

//User registration
router.post("/register-user", validationRules(), validate, async (req, res) => {
  await userRegister(req.body, "user", res);
});

//Admin Registration
router.post(
  "/register-admin",
  validationRules(),
  validate,
  async (req, res) => {
    await userRegister(req.body, "admin", res);
  }
);

//Super admin Registration
router.post(
  "/register-super-admin",
  validationRules(),
  validate,
  async (req, res) => {
    await userRegister(req.body, "superadmin", res);
  }
);

module.exports = router;

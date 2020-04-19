const router = require("express").Router();
const { userRegister } = require("../../utils/Auth");

//User registration
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "user", res);
});

//Admin Registration
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

//Super admin Registration
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});

module.exports = router;

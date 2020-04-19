const router = require("express").Router();
const { userLogin } = require("../../utils/Auth");

//User login
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

//Admin login
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

//Super admin login
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

module.exports = router;

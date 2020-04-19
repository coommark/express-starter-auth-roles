const router = require("express").Router();
const { ensureAuthenticated, ensureAuthorized } = require("../../utils/Auth");

router.get(
  "/super-dashboard",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  async (req, res) => {
    return res.status(200).json("Hello Admin");
  }
);

module.exports = router;

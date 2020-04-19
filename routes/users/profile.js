const router = require("express").Router();
const { ensureAuthenticated, serializeUser } = require("../../utils/Auth");

router.get("/profile", ensureAuthenticated, async (req, res) => {
  return res.json(serializeUser(req.user));
});

module.exports = router;

const router = require("express").Router();
const { ensureAuthenticated, ensureAuthorized } = require("../../utils/Auth");
const {
  validationRules,
  validate,
} = require("../../validations/articleValidator");
const { create, getAll } = require("../../controllers/articlesController");

router.post(
  "/create",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  validationRules(),
  validate,
  async (req, res) => {
    await create(req.body, res);
  }
);

router.get("/getAll", async (req, res) => {
  await getAll(req, res);
});

module.exports = router;

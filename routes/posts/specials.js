const router = require("express").Router();
const { ensureAuthenticated, ensureAuthorized } = require("../../utils/Auth");
const {
  validationRules,
  validate,
} = require("../../validations/specialsValidator");
const {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("../../controllers/specialsController");

router.post(
  "/",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  validationRules(),
  validate,
  async (req, res) => {
    await create(req, res);
  }
);

router.get("/", async (req, res) => {
  await getAll(req, res);
});

router.get("/:id", async (req, res) => {
  await getOne(req, res);
});

router.put(
  "/:id",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  validationRules(),
  validate,
  async (req, res) => {
    await updateOne(req, res);
  }
);

router.delete(
  "/:id",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  async (req, res) => {
    await deleteOne(req, res);
  }
);

module.exports = router;

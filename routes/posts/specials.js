const path = require("path");
const multer = require("multer");
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
const PATH = "../../public/";

//File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, PATH));
  },
  filename: (req, file, cb) => {
    console.log("IN SAVE IMAGE");
    console.log(file);
    const fileName = Date.now() + path.extname(file.originalname);
    req.body.imageUrl = fileName;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/",
  ensureAuthenticated,
  ensureAuthorized(["admin"]),
  upload.any("files")
);

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

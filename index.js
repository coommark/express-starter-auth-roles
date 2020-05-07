const cors = require("cors");
const express = require("express");
//const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const paginate = require("express-paginate");
const passport = require("passport");
const { success, error } = require("consola");
const { connect } = require("mongoose");

const { DB, PORT } = require("./config");

const app = express();

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: false }));

/* bodyParser = {
  json: { limit: "50mb", extended: true },
  urlencoded: { limit: "50mb", extended: true },
}; */
app.use(passport.initialize());
app.use(express.static(__dirname));

require("./middlewares/passport")(passport);

app.use(paginate.middleware(10, 50));

app.use("/api/auth/register", require("./routes/auth/registration"));
app.use("/api/auth/login", require("./routes/auth/login"));
app.use("/api/users", require("./routes/users/profile"));
app.use("/api/admin", require("./routes/admin/admin"));
app.use("/api/super", require("./routes/admin/super"));

//posts
app.use("/api/articles", require("./routes/posts/articles"));
app.use("/api/videos", require("./routes/posts/videos"));
app.use("/api/specials", require("./routes/posts/specials"));

const startApp = async () => {
  try {
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    success({
      message: `Successfully connected to Database \n${DB}`,
      badge: true,
    });

    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect to Database \n${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();

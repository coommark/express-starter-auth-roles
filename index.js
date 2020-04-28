const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const paginate = require("express-paginate");
const passport = require("passport");
const { success, error } = require("consola");
const { connect } = require("mongoose");

const { DB, PORT } = require("./config");

const app = exp();

app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

app.use(paginate.middleware(10, 50));

app.use("/api/auth/register", require("./routes/auth/registration"));
app.use("/api/auth/login", require("./routes/auth/login"));
app.use("/api/users", require("./routes/users/profile"));
app.use("/api/admin", require("./routes/admin/admin"));
app.use("/api/super", require("./routes/admin/super"));

//posts
app.use("/api/articles", require("./routes/posts/articles"));

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

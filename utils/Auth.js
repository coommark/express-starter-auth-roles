const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/users/User");
const { SECRET } = require("../config");

const userRegister = async (userData, role, res) => {
  try {
    let userTaken = await validateEmail(userData.email);
    if (userTaken) {
      return res.status(400).json({
        message: `Email is already registered`,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({
      message: `Account successfully created`,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Unable to create user account`,
      success: false,
    });
  }
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) {
    return true;
  } else {
    return false;
  }
};

const userLogin = async (userCreds, role, res) => {
  let { email, password } = userCreds;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: `This email number is not registered, invalid login`,
      success: false,
    });
  }

  if (user.role != role) {
    return res.status(403).json({
      message: `Please make sure you are login in from the right portal`,
      success: false,
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      SECRET,
      {
        expiresIn: "7 days",
      }
    );
    let profile = {
      email: user.email,
      role: user.role,
      name: user.name,
    };
    let result = {
      user: profile,
      token: token,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      message: `Login success`,
      success: true,
    });
  } else {
    return res.status(403).json({
      message: `Incorrect password`,
      success: false,
    });
  }
};

const ensureAuthenticated = passport.authenticate("jwt", { session: false });

const ensureAuthorized = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(401).json({
    message: "Unauthorized",
    success: false,
  });
};

const serializeUser = (user) => {
  return {
    email: user.email,
    name: user.name,
    _id: user._id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  userRegister,
  userLogin,
  ensureAuthenticated,
  serializeUser,
  ensureAuthorized,
};

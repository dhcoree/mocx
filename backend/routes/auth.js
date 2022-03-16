const express = require("express");
const router = express.Router();
//config
const config = require("../config");
//jwt
const jwt = require("jsonwebtoken");
const User = require("../db/models/user");
const bcrypt = require("bcryptjs");

const authMiddleware = require("../middlewares/auth");

const generateToken = (tokenDatas) => {
  const generatedToken = jwt.sign(tokenDatas, config.JWT_KEY, {
    expiresIn: "1m",
  });
  return generatedToken;
};

router.post("/register", async (req, res) => {
  const { cpf } = req.body.userData;

  try {
    if (await User.findOne({ cpf }))
      return res.json({ message: "User already exists ", success: false });

    const user = await User.create(req.body.userData);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
      success: true,
    });
  } catch (err) {
    return res.json({ message: err.message, success: false });
  }
});

router.post("/authenticate", async (req, res) => {
  const { cpf, password } = req.body.userData;

  const user = await User.findOne({ cpf }).select("+password");

  if (!user)
    return res.json({ message: "User not found", success: false });

  if (!(await bcrypt.compare(password, user.password)))
    return res
      .json({ message: "Invalid password ", success: false });

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, config.JWT_KEY, {
    expiresIn: 864000,
  });

  res.json({
    user,
    token: generateToken({ id: user.id }),
    success: true,
  });
});

router.get("/verifytoken", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select("+password");

    const token = jwt.sign({ id: user.id }, config.JWT_KEY, {
      expiresIn: 864000,
    });

    res.send({
      token,
      user,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
});

module.exports = router;

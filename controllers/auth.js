const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all credentials");
  }
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new UnauthenticatedError("Please provide valid credentials");
  }
  const isMatchPassword = user.comparePassword(password);
  console.log(isMatchPassword);
  if (!isMatchPassword) {
    throw new UnauthenticatedError("Please provide valid credentials");
  }
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };

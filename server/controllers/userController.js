import User from "../models/User.js";
import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";

// @desc get all users
// @route GET /users
// @access public
const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users?.length)
    return res.status(400).json({ message: "No users found" });
  res.json(users);
});

// @desc edit a user
// @route PUT /users
// @access public
const updateUserInfo = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: id }).exec();
  if (!user) {
    return res.status(400).json({ message: `User ID ${id} not found` });
  }
  const {
    username,
    password,
    calendarLink,
    expiresIn,
    firstName,
    lastName,
    email,
  } = req.body;

  if (req?.body?.username) user.username = username;
  if (req?.body?.firstName) user.firstName = firstName;
  if (req?.body?.lastName) user.lastName = lastName;
  if (req?.body?.email) user.email = email;
  if (req?.body?.password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
  }
  if (req?.body?.calendarLink) user.calendarLink = calendarLink;
  if (req?.body?.expiresIn) user.expiresIn = expiresIn;

  const result = await user.save();

  res.json(result);
});

// @desc create a user
// @route POST /user
// @access public
const handleNewUser = expressAsyncHandler(async (req, res) => {
  if (
    !req?.body?.username ||
    !req?.body?.password ||
    !req?.body?.calendarLinks ||
    !req?.body?.firstName ||
    !req?.body?.lastName ||
    !req?.body?.email
  )
    return res.status(400).json({ message: "All fields are required." });
  // check for duplicate usernames in the db
  const { username, password, calendarLinks, firstName, lastName, email } =
    req.body;
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  //encrypt the password
  const hashedPwd = await bcrypt.hash(password, 10);
  //create and store the new user
  const result = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    username: username,
    password: hashedPwd,
    calendarLinks: calendarLinks,
  });

  res.status(201).json({ success: `New user ${username} created!` });
});

// @desc delete a user
// @route DELETE /users
// @access public
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findById(id).exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  /*   if (user.clients.length) {
    return res.status(400).json({
      message: "Unable to complete deletion. Please reassign clients first!",
    });
  } */
  const result = await user.deleteOne();
  res.json({ message: `User ${user.username} successfully deleted` });
});

export { getAllUsers, handleNewUser, updateUserInfo, deleteUser };

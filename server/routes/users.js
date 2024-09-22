import express from "express";
export const router = express.Router();
import {
  getAllUsers,
  handleNewUser,
  updateUserInfo,
  deleteUser,
} from "../controllers/userController.js";

router
  .route("/")
  .get(getAllUsers)
  .post(handleNewUser)
  .put(updateUserInfo)
  .delete(deleteUser);

import express from "express";
export const router = express.Router();
import { login, refresh, logout } from "../controllers/authController.js";

router.route("/login").post(login);

router.route("/refresh").get(refresh);

router.route("/logout").post(logout);

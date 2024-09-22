import express from "express";
export const router = express.Router();
import {
  getAllRedirects,
  createNewRedirect,
  updateRedirect,
  deleteRedirect,
  redirectToOriginalUrl,
  refreshRedirect,
} from "../controllers/urlController.js";

router
  .route("/")
  .get(getAllRedirects)
  .post(createNewRedirect)
  .put(updateRedirect)
  .delete(deleteRedirect);

router.route("/:urlId").get(redirectToOriginalUrl).put(refreshRedirect);

import express from "express";
export const router = express.Router();
import {
  getAllClients,
  createNewClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

router
  .route("/")
  .get(getAllClients)
  .post(createNewClient)
  .put(updateClient)
  .delete(deleteClient);

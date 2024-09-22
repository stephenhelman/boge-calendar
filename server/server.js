import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import path from "path";

import mongoose from "mongoose";
import { connectDB } from "./config/dbConn.js";

import cookieParser from "cookie-parser";

import { router as userRouter } from "./routes/users.js";
import { router as urlRouter } from "./routes/urls.js";
import { router as clientRouter } from "./routes/clients.js";
import { router as authRouter } from "./routes/auth.js";

import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import { credentials } from "./middleware/credentials.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

//production routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/url", urlRouter);
app.use("/api/client", clientRouter);

//dev routes
/* app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/url", urlRouter);
app.use("/client", clientRouter); */

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, urlShortener Active`);
  });
});

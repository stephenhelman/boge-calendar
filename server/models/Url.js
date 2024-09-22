import mongoose from "mongoose";
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  urlId: {
    type: String,
    required: true,
  },
  originalURL: {
    type: String,
    required: true,
  },
  newURL: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: false,
  },
});

export default mongoose.model("Url", urlSchema);

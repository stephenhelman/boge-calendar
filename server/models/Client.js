import mongoose from "mongoose";
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  stage: {
    type: String,
    required: true,
  },
  calendarLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: false,
  },
});

export default mongoose.model("Client", clientSchema);

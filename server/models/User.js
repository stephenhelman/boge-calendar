import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["Employee"],
  },
  calendarLinks: {
    initialMeeting: {
      type: String,
      required: true,
    },
    fundingCall: {
      type: String,
      required: true,
    },
    strategyCall: {
      type: String,
      required: true,
    },
  },
  linkExpiration: {
    type: Number,
    required: true,
  },
  refreshToken: String,
});

export default mongoose.model("User", userSchema);

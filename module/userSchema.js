import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
    index: true,
    unique: true,
  },

  Email: {
    type: String,
    require: true,
    trim: true,
  },
  Mobile: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  Gender: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

export default User;

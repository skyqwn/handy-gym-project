import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new mongoose.Schema({
  nickname: String,
  email: String,
  password: String,
  avatarUrl: String,
  socialId: Number,
  socialType: String,
  emailVerify: {
    type: Boolean,
    default: false,
  },
  emailVerifyString: {
    type: String,
    default: uuidv4(),
  },
});

const User = mongoose.model("User", UserSchema);
export default User;

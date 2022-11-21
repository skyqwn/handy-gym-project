import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
// import passportLocalMongoose from "passport-local-mongoose";

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

// passportLocalMongoose 적용함.
// UserSchema.plugin(passportLocalMongoose, {
//   usernameField: "email",
// });

const User = mongoose.model("User", UserSchema);
export default User;

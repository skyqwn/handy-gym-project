import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  nickname: String,
  email: String,
  password: String,
  avatarUrl: String,
  socialId: Number,
  socialType: String,
});

// passportLocalMongoose 적용함.
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", UserSchema);
export default User;

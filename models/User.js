import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  nickname: String,
  email: String,
  avatarUrl: String,
  facebookID: Number,
  githubId: Number,
});

// passportLocalMongoose 적용함.
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", UserSchema);
export default User;

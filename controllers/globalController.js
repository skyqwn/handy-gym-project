import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

export const home = (req, res, next) => {
  res.render("home");
};

export const signin = (req, res, next) => {
  res.render("signin");
};

export const signinPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin",
  failureFlash: true,
});
export const signup = (req, res, next) => {
  res.render("signup");
};
export const signupPost = async (req, res, next) => {
  const {
    body: { nickname, email, password: bodypassword, passwordRepeat },
  } = req;
  try {
    if (bodypassword !== passwordRepeat) {
      req.flash("error", "비밀번호가 같지않습니다.");
      console.log("비밀번호가 같지않습니다.");
      return res.redirect("/signin");
    }
    const existUser = await User.exists({ email });
    if (existUser) {
      req.flash("error", "이미 등록된 이메일입니다.");
      console.log("이미 등록된 이메일입니다.");
      return res.redirect("/signin");
    }

    const hashedPassword = bcrypt.hashSync(bodypassword, +process.env.BCRYPT);
    const newUser = new User({
      nickname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const userInfo = { ...newUser._doc };

    const { password, ...otherInfo } = userInfo;
    req.session.user = otherInfo;
    req.flash("success", "회원가입성공!");
    console.log("회원가입성공");
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  req.logout(req.user, (err) => {
    if (err) {
      //flash 처리
      return res.status(500);
    }
    res.redirect("/");
  });
};

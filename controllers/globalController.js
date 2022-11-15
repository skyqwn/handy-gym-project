import User from "../models/User.js";
import passport from "passport";

export const home = (req, res, next) => {
  res.render("home");
};

export const signin = (req, res, next) => {
  res.render("signin");
};

export const signinPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin",
});

export const signup = (req, res, next) => {
  res.render("signup");
};
export const signupPost = async (req, res, next) => {
  const {
    body: { nickname, email, password, passwordRepeat },
  } = req;
  try {
    if (password !== passwordRepeat) {
      console.log("비밀번호가 다릅니다");
      return res.redirect("/signup");
    }

    const user = new User({ nickname, email });

    console.log(user);
    console.log("시작");
    await User.register(user, password);
    console.log("완료");
  } catch (error) {
    console.log(error);
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

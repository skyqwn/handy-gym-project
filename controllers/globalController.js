import User from "../models/User.js";
import sendMail from "../utils/sendMail.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

export const home = (req, res, next) => {
  console.log("홈화면 ", req.user);
  res.render("home");
};

export const signin = (req, res, next) => {
  const {
    query: { redirectUrl },
  } = req;
  res.render("signin", {
    csrfToken: req.csrfToken(),
    redirectUrl: redirectUrl || "",
  });
};

export const signinPost = (req, res) => {
  const {
    query: { redirectUrl },
  } = req;
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error", "로그인 문제 발생 잠시후 시도해주세요.");
      return res.redirect("/signin");
    }
    if (!user) {
      req.flash("error", info.message);
      if (info.message === "등록된 유저가 아닙니다") {
        return res.redirect("/signup");
      } else {
        return res.redirect("/signin");
      }
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "로그인 문제 발생 잠시후 시도해주세요.");
        return res.redirect("/signin");
      }
      req.flash("success", `안녕하세요 ${user.nickname}님`);
      return res.redirect(redirectUrl || "/");
    });
  })(req, res);
};

export const signup = (req, res, next) => {
  res.render("signup", { csrfToken: req.csrfToken() });
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
    const existUser = await User.findOne({ email });
    if (existUser) {
      if (existUser.socialId) {
        console.log(`${existUser.socialType}(으)로 등록된 아이디입니다.`);

        req.flash("info", `${existUser.socialType}(으)로 등록된 아이디입니다.`);
      }
      req.flash("error", "이미 등록된 이메일입니다.");

      return res.redirect("/signin");
    }

    const hashedPassword = bcrypt.hashSync(bodypassword, +process.env.BCRYPT);
    const newUser = new User({
      nickname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // const userInfo = { ...newUser._doc };

    // const { password, ...otherInfo } = userInfo;
    // req.session.user = otherInfo;

    sendMail(email, newUser._id, newUser.emailVerifyString);

    req.flash("success", "회원가입성공!");
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export const emailVerify = async (req, res, next) => {
  const {
    query: { key, id, redirectUrl },
  } = req;
  try {
    const newUser = await User.findById(id);
    console.log(newUser);
    if (newUser.emailVerifyString === key) {
      newUser.emailVerify = true;
      await newUser.save();

      req.flash("success", `${newUser.nickname}님의 이메일 인증 성공`);
      return res.redirect(redirectUrl || "/");
    } else {
      console.log("인증에 실패하였습니다.");
    }
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      req.flash("error", "로그인 문제 발생 잠시후 시도해주세요.");
      return res.redirect("/signin");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "로그인 문제 발생 잠시후 시도해주세요.");
        return res.redirect("/signin");
      }
      req.flash("success", `안녕하세요 ${user.nickname}님`);
      return res.redirect(info.redirectUrl || "/");
    });
  })(req, res);
};

export const kakaoCallback = async (req, res, next) => {
  passport.authenticate("kakao", (err, user, info) => {
    if (err) {
      req.flash("error", "로그인 문제 발생 잠시후 시도해주세요.");
      return res.redirect("/signin");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "로그인 문제 발생 잠시후 시도해주세요.");
        return res.redirect("/signin");
      }
      req.flash("success", `안녕하세요 ${user.nickname}님`);
      return res.redirect(info.redirectUrl || "/");
    });
  })(req, res);
};

export const resendMail = async (req, res, next) => {
  const {
    user: { email, _id, emailVerifyString },
    query: { redirectUrl },
  } = req;
  try {
    sendMail(email, _id, emailVerifyString, redirectUrl);
    req.flash("success", `인증 이메일을 ${email}으로 전송하였습니다.`);
    return res.redirect("/no-access");
  } catch (error) {
    console.log(error);
  }
};

export const noAccess = (req, res, next) => {
  const {
    query: { redirectUrl },
  } = req;
  return res.render("noAccess", {
    redirectUrl,
    notice: "이메일 인증 재전송을 원하시면 전송버튼을 눌러주세요",
  });
};

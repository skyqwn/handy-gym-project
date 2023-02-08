import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import sendMail from "../utils/sendMail.js";
import Gym from "../models/Gym.js";
import Post from "../models/Post.js";
import Gallery from "../models/Gallery.js";

export const home = (req, res) => {
  res.render("home");
};

export const signin = (req, res) => {
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
      req.flash("error", "로그인 오류 발생");
      return res.redirect("/signup");
    }

    if (!user) {
      req.flash("error", info.message);
      if (info.message === "이메일로 가입된 유저가 없습니다") {
        return res.redirect("/signup");
      }

      return res.redirect("/signin");
    } else {
      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", "로그인 오류 발생");
          return res.redirect("/signin");
        }
        req.flash("success", `${user.nickname}님 안녕하세요`);
        return res.redirect(redirectUrl || "/");
      });
    }
  })(req, res);
};

export const signup = (req, res) => {
  const {
    query: { redirectUrl },
  } = req;
  res.render("signup", {
    csrfToken: req.csrfToken(),
    redirectUrl: redirectUrl || "",
  });
};

export const signupPost = async (req, res) => {
  const {
    body: { nickname, email, password, passwordRepeat },
    query: { redirectUrl },
  } = req;
  try {
    if (password !== passwordRepeat) {
      req.flash("error", "비밀번호가 틀립니다");
      return res.redirect("/signup");
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      if (existUser.socialId) {
        req.flash(
          "info",
          `${existUser.socialType}(으)로 로그인한 이메일입니다`
        );
      }
      req.flash("info", `이메일로 가입한 유저가 있습니다`);
      return res.redirect("/signin");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      nickname,
      email,
      password: hashedPassword,
    });

    await sendMail(email, user.email_verify_string, user._id);

    await user.save();

    req.flash("success", "회원가입 성공! 이메일 인증");
    if (redirectUrl) {
      return res.redirect(`/signin?redirectUrl=${redirectUrl}`);
    } else {
      return res.redirect(`/signin`);
    }
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
    // console.log(error);
    // if (
    //   error.message === "A user with the given username is already registered"
    // ) {
    //   console.log("유저가 있음");
    // }
  }
};

export const googleCallback = async (req, res) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      req.flash("error", "구글로그인 오류 발생");
      return res.redirect("/signin");
    }

    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "구글로그인 오류 발생");
        return res.redirect("/signin");
      }
      req.flash("success", `${user.nickname}님 안녕하세요👋`);
      return res.redirect(info.redirectUrl || "/");
    });
  })(req, res);
};

export const kakaoCallback = async (req, res) => {
  passport.authenticate("kakao", (err, user, info) => {
    if (err) {
      console.log(err);
      req.flash("error", "카카오로그인 오류 발생");
      return res.redirect("/signin");
    }

    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", "카카오로그인 오류 발생");
        return res.redirect("/signin");
      }
      req.flash("success", `${user.nickname}님 안녕하세요👋`);
      return res.redirect(info.redirectUrl);
    });
  })(req, res);
};

export const logout = (req, res) => {
  req.logout(req.user, (err) => {
    if (err) {
      req.flash("error", "로그아웃 실패");
      return res.status(500);
    }
    req.flash("success", "로그아웃 성공");
    res.redirect("/");
  });
};

export const verifyEmail = async (req, res) => {
  const {
    query: { key, id, redirectUrl },
  } = req;
  try {
    const findUser = await User.findById(id);
    if (findUser.email_verify_string === key) {
      findUser.email_verified = true;
      await findUser.save();
      req.flash("success", `${findUser.nickname}님의 이메일 인증 성공👋`);
      return res.redirect(redirectUrl || "/");
    } else {
      req.flash("error", "잘못된접근입니다");
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
  }
};

export const resendEmail = async (req, res) => {
  const {
    user: { email, _id, email_verify_string },
    query: { redirectUrl },
  } = req;
  try {
    sendMail(email, email_verify_string, _id, redirectUrl);

    req.flash("success", `인증이메일을 보냈습니다 ${email}을 확인하세요`);

    return res.redirect(
      `/no-access?redirectUrl=${redirectUrl}&disAllowedType=resendEmail`
    );
  } catch (error) {
    req.flash("error", "서버 오류 발생하였습니다 다시 시도해주세요.");
  }
};

export const noAccess = (req, res) => {
  const {
    query: { redirectUrl, disAllowedType },
  } = req;

  const createMessage = () => {
    if (disAllowedType === "email") {
      return `${req?.user?.email}을 확인해주세요.\n 인증이메일 재전송을 원하면 아래버튼을 누르세요`;
    }
    if (disAllowedType === "resendEmail") {
      return `인증이메일을 보냈습니다. ${req?.user?.email}을 확인해주세요`;
    }
  };

  const message = createMessage();

  return res.render("noAccess", {
    message,
    redirectUrl,
  });
};

export const like = async (req, res) => {
  const { user } = req;
  try {
    const gyms = await Gym.find({ like_users: { $in: String(user._id) } });
    res.render("like", { title: "관심목록", gyms });
  } catch (error) {
    req.flash("서버 오류가 발생했습니다\n 불편함을 드려 죄송합니다");
    return res.redirect("/");
  }
};

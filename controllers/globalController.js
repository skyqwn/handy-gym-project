import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";
import nodeMailer from "nodemailer";

dotenv.config();

export const home = (req, res, next) => {
  console.log("홈화면 ", req.user);
  res.render("home");
};

export const signin = (req, res, next) => {
  res.render("signin", { csrfToken: req.csrfToken() });
};

export const signinPost = (req, res) => {
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
      return res.redirect("/");
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
        console.log(`${existUser.socialType}}(으)로 등록된 아이디입니다.`);

        req.flash(
          "info",
          `${existUser.socialType}}(으)로 등록된 아이디입니다.`
        );
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

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PW },
    });

    const mailOptions = {
      to: email,
      subject: "가입 인증 메일",

      html: `<h1>링크를 클릭해야 회원가입이 완료됩니다.</h1>
      <p>링크를 클릭하세요<a href="http://localhost:5050/verify?key=${newUser.emailVerifyString}">링크</a></p>
      `,
    };
    await transporter.sendMail(mailOptions);

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

export const loginVerify = async (req, res, next) => {
  const {
    query: { key },
    user,
  } = req;
  try {
    console.log(3, user);
    const newUser = await User.findById(user._id);
    if (newUser.emailVerifyString === key) {
      newUser.emailVerify = true;
      await newUser.save();

      req.flash("success", `${newUser.nickname}님의 이메일 인증 성공`);
      return res.redirect("/");
    } else {
      console.log("인증에 실패하였습니다.");
    }
  } catch (error) {
    next(error);
  }
};

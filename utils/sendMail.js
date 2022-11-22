import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PW },
});

const sendMail = (email, userId, emailVerifyString, redirectUrl) => {
  const mailOptions = {
    to: email,
    subject: "가입 인증 메일",
    html: `<h1>링크를 클릭해야 회원가입이 완료됩니다.</h1>
              <p>링크를 클릭하세요<a href="http://localhost:5050/verify?key=${emailVerifyString}&id=${userId}&redirectUrl=${
      redirectUrl || ""
    }">인증링크</a></p>
              `,
  };
  return transporter.sendMail(mailOptions);
};

export default sendMail;

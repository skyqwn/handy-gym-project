import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let mainUrl;

if (process.env.NODE_ENV === "Production") {
  mainUrl = "https://handy-gym-project.vercel.app";
} else {
  mainUrl = "http://localhost:5050";
}

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const sendMail = async (email, verifyString, userId, redirectUrl) => {
  await transport.sendMail({
    to: email,
    subject: "핸디짐에서 보낸 인증메일입니다",
    html: `<h1>아래링크를 눌러줘야 이메일인증이 완료됩니다</h1><a href="${mainUrl}/verify?key=${verifyString}&id=${userId}&redirectUrl=${
      redirectUrl || ""
    }">인증링크</a>`,
  });
};

export default sendMail;

import csurf from "csurf";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";

import globalRouter from "./routes/globalRouter.js";
import gymRouter from "./routes/gymRouter.js";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";

import setLocals from "./utils/setLocals.js";
import localPassport from "./utils/oauthLocal.js";
import googlePassport from "./utils/oauthGoogle.js";
import kakaoPassport from "./utils/oauthKakao.js";

dotenv.config();

const mongoUrl = process.env.DEV_MONGO_URL;
const app = express();
const port = process.env.PORT || 5050;

mongoose.connect(mongoUrl);

app.set("view engine", "pug");

const errorHandler = () => {
  console.log("❌연결실패하였습니다.");
};

const successHandler = () => {
  console.log("✅연결되었습니다.");
};

const db = mongoose.connection;
db.on("error", errorHandler);
db.once("sucess", successHandler);

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl }),
    cookie: { maxAge: 3.6e6 * 24 }, // 24시간 유효
  })
);
localPassport(app);
googlePassport();
kakaoPassport();
app.use(flash());

app.use(setLocals);

app.use("/static", express.static("static"));

app.use("/", globalRouter);
app.use("/gym", gymRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`서버가 ${port}에서 실행중입니다.`);
});

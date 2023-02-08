import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import flash from "connect-flash";

import globalRouter from "./routes/globalRouter.js";
import gymRouter from "./routes/gymRouter.js";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";
import setLocals from "./utils/setLocals.js";
import passportInit from "./utils/passportInit.js";
import commentRouter from "./routes/commentRouter.js";
import galleryRouter from "./routes/galleryRouter.js";
import messageRouter from "./routes/messageRouter.js";
import conversationRouter from "./routes/conversationRouter.js";

let mongoUrl;

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "Developement") {
  mongoUrl = process.env.DEV_MONGO_URL;
}
if (process.env.NODE_ENV === "Production") {
  mongoUrl = process.env.PROD_MONGO_URL;
}

mongoose.connect(mongoUrl);

const db = mongoose.connection;

const handleDBError = () => console.log("❌DB연결 실패");
const handleDBSuccess = () => console.log(`✅DB연결 성공`);

db.on("error", handleDBError);
db.once("open", handleDBSuccess);

const cspOptions = {
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    "default-src": [
      "'self'",
      "blob:*",
      "*.kakao.com",
      "*.fontawesome.com",
      "http://localhost:5000/*",
    ],
    "img-src": [
      "'self'",
      "blob:",
      "*.daumcdn.net",
      "*.kakaocdn.net",
      "*.googleusercontent.com",
      "data:",
      "https://handygym-s3.s3.ap-northeast-2.amazonaws.com",
    ],
    "script-src": [
      "'self'",
      "*.daumcdn.net",
      "*.kakao.com",
      "*.jsdelivr.net",
      "*.fontawesome.com",
      "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js",
    ],
    "frame-src": ["'self'", "*.map.daum.net"],
  },
};

const corsOption = {
  origin: "https://handygym-s3.s3.ap-northeast-2.amazonaws.com",
  credentials: true,
};

app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors(corsOption));

if (process.env.NODE_ENV === "Developement") {
  app.use(morgan("dev"));
}
if (process.env.NODE_ENV === "Production") {
  app.set("trust proxy", 1);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({ mongoUrl }),
    cookie: {
      maxAge: 3.6e6 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production",
    }, // 24시간 유효
  })
);

passportInit(app);

app.use(flash());
app.set("view engine", "pug");

app.set("views", path.join(__dirname, "/views"));
app.use("/static", express.static(__dirname + "/static"));
// app.use("/static", express.static("static"));
// app.use("/uploads", express.static("uploads"));
app.use(setLocals);

app.use("/", globalRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
app.use("/gym", gymRouter);
app.use("/gallery", galleryRouter);
app.use("/comment", commentRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

const handleListen = () => console.log(`✅서버가 실행중입니다`);

app.listen(port, handleListen);

export default app;

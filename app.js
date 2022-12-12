import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";

import globalRouter from "./routes/globalRouter.js";
import gymRouter from "./routes/gymRouter.js";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";
import setLocals from "./utils/setLocals.js";
import passportInit from "./utils/passportInit.js";

const mongoUrl = process.env.DEV_MONGO_URL;
const app = express();
const port = process.env.PORT || 5050;

mongoose.connect(mongoUrl);

const db = mongoose.connection;

const handleDBError = () => console.log("❌DB연결 실패");
const handleDBSuccess = () => console.log(`✅DB연결 성공`);

db.on("error", handleDBError);
db.once("open", handleDBSuccess);

app.set("view engine", "pug");

// var corsOptions = {
//     origin: "//t1.daumcdn.net",
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const cspOptions = {
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    "default-src": ["'self'", "*.kakao.com", "*.fontawesome.com"],
    "script-src": [
      "'self'",
      "*.jsdelivr.net",
      "*.daumcdn.net",
      "*.kakao.com",
      "*.fontawesome.com",
    ],
    "frame-src": ["'self'", "*.map.daum.net"],
    "img-src": ["'self'", "blob:", "*.daumcdn.net"],
  },
};

app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

passportInit(app);

app.use(flash());
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));
app.use(setLocals);

app.use("/", globalRouter);
app.use("/gym", gymRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

const handleListen = () => console.log(`✅서버가 ${port}에서 실행중입니다`);

app.listen(port, handleListen);

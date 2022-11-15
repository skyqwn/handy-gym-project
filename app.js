import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`서버가 ${port}에서 실해중입니다.`);
});

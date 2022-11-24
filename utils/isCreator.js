import Gym from "../models/Gym.js";
import multer from "multer";
import dotenv from "dotenv";
import Gym from "../models/Gym.js";
dotenv.config();

export const isCreator = async (req, res, next) => {
  const {
    params: { gymId },
  } = req;
  try {
    const Gym = await Gym.findById(gymId);
  } catch (error) {}
};

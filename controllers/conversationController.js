import Message from "../models/Message.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";

export const fetch = async (req, res) => {
  const conversations = await Conversation.find({
    users: { $in: [req.user._id] },
  }).populate("users");
  console.log(conversations);
  return res.render("conversation", { conversations });
};

export const detail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    // const findUser = await User.findById(id);
    const messages = await Message.find({
      conversationId: id,
    })
      .populate("from")
      .populate("to");
    return res.render("conversationDetail", { messages });
  } catch (error) {
    console.log(error);
  }
};

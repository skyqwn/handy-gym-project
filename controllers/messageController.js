import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const create = async (req, res) => {
  const {
    user,
    body: { to, message },
  } = req;
  const from = String(user.id);
  try {
    const existsConversation = await Conversation.findOne({
      users: { $all: [to, from] },
    });
    if (existsConversation) {
      console.log(existsConversation);
      console.log("대화방있음");
      const newMessage = await Message.create({
        from,
        to,
        message,
        conversationId: String(existsConversation._id),
      });
      return res.redirect(`/conversation/${existsConversation._id}`);
    } else {
      console.log("대화방없음");
      const newConversation = await Conversation.create({
        users: [to, from],
      });
      console.log(newConversation);
      const newMessage = await Message.create({
        from,
        to,
        message,
        conversationId: String(newConversation._id),
      });
      console.log(newMessage);
      return res.redirect(`/conversation/${newConversation._id}`);
    }
  } catch (error) {
    console.log(error);
  }
};

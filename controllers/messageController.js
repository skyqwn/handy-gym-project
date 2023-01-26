import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const create = async (req, res) => {
  const {
    user,
    body: { to, message },
  } = req;
  const from = String(user._id);
  try {
    const existsConversation = await Conversation.findOne({
      users: { $all: [to, from] },
    });
    if (existsConversation) {
      await Message.create({
        from,
        to,
        message,
        conversationId: String(existsConversation._id),
      });
      return res.redirect(`/conversation/${existsConversation._id}`);
    } else {
      const newConversation = await Conversation.create({
        users: [to, from],
      });
      await Message.create({
        from,
        to,
        message,
        conversationId: String(newConversation._id),
      });
      return res.redirect(`/conversation/${newConversation._id}`);
    }
  } catch (error) {
    console.log(error);
  }
};

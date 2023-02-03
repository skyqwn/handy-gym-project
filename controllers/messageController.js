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
      req.flash("success", "쪽지보내기 성공");
      return res.redirect(req.session.create_message_url);
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
      return res.redirect(req.session.create_message_url);
    }
  } catch (error) {
    req.flash("error", "쪽지 보내는 중 서버 오류가 발생하였습니다.");
    res.redirect(req.session.create_message_url);
  }
};

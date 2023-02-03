import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const fetch = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      users: { $in: [req.user._id] },
    }).populate("users");
    return res.render("conversation", { title: "쪽지함", conversations });
  } catch (error) {
    req.flash("error", "쪽지함을 불러오는 도중 서버 오류가 발생하였습니다.");
    return res.redirect("/");
  }
};

export const detail = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    // req.user conversation.users contains
    const conversation = await Conversation.findById(id);

    const inUser = conversation.users.includes(String(user._id));

    req.session.create_message_url = req.originalUrl;

    if (!inUser) {
      req.flash("잘못된 접근입니다");
      return res.redirect("/");
    }

    const filterOtherUser = conversation.users.filter((conversationUser) => {
      return String(conversationUser._id) !== String(user._id);
    });
    const otherUserId = String(filterOtherUser[0]._id);

    const messages = await Message.find({ conversationId: id })
      .populate("from")
      .populate("to");

    res.render("conversationDetail", {
      title: "쪽지함",
      messages,
      otherUserId,
    });
  } catch (error) {
    req.flash(
      "error",
      "쪽지 메세지를 불러오는 도중 서버 오류가 발생하였습니다."
    );
    return res.redirect("/");
  }
};

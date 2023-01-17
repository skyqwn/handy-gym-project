import Message from "../models/Message.js";

export const detail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const messages = await Message.find({
      conversationId: id,
    });
    console.log(messages);
  } catch (error) {
    console.log(error);
  }
};

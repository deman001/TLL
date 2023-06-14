import mongoose from "mongoose";
// import chatModel from "../models/Chat.model";
// import messageModel from "../models/Message.model";
// import User from "../models/User";
// import Chat from "../models/Chat";
import chatModel from "../models/Chat.js";
import messageModel from "../models/Message.model.js";

class ChatController {
  static getAllChats = async (req, res, next) => {
    try {
      console.log("get all chats");
      console.log("in chat api");
      console.log(req.user);

      const userId = req.params.id;
      if (!userId) {
        return res.status(422).json({
          status: "error",
          message: "userId is required",
        });
      }
      const isValidUserId = mongoose.isValidObjectId(userId);

      if (!isValidUserId) {
        return res.status(403).json({
          status: "error",
          message: "Invalid user Id",
        });
      }

      let allChats = await chatModel
        .find({
          participants: { $in: userId },
        })
        .populate("participants", "-password")
        // .populate({
        //   path: "messages",
        //   populate: {
        //     path: "sender",
        //     select: "-password",
        //   },
        // })
        .lean();
      // console.log(allChats);

      if (allChats.length > 0) {
        let Chats = allChats.map((chat) => {
          if(chat.messages && chat.messages.length > 0) {
            chat.lastMessage = chat.messages[chat.messages.length - 1];
            delete chat.messages;

            // console.log("chat is " + chat);
            if (!chat.lastMessage.sender) {
              chat.lastMessage.sender = "user Deleted";
            }
          }

          return chat;
        });

        // console.log("chats " + Chats);
        return res.status(200).json({
          status: "success",
          data: Chats,
        });
      } else {
        return res.status(200).json({
          data:[]
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getAllMessages = async (req, res, next) => {
    try {
      console.log("get all chats");
      console.log("in chat api");
      console.log(req.params.id);
      console.log(req.user);
      const userId = req.user.id;
      console.log(userId);
      if (!userId) {
        return res.status(422).json({
          status: "error",
          message: "userId is required",
        });
      }
      const isValidUserId = mongoose.isValidObjectId(userId);

      if (!isValidUserId) {
        return res.status(403).json({
          status: "error",
          message: "Invalid user Id",
        });
      }

      let allChats = await chatModel
        .findOne({
          _id: req.params.id,
          participants: { $in: userId },
          // participant: { $elemMatch: { $eq: userId } }
          // participants:  userId ,
        })
        .populate("messages")
        .select("messages");

      if (allChats) {
        return res.status(200).json({
          status: "success",
          data: allChats,
        });
      } else {
        return res.status(404).json({
          status: "error",
          data: "no chats found",
        });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  


  static createChat = async (req, res, next) => {
    try {
      const {  sender, receiver } = req.body;
      console.log(req.body)
      if (!sender || !receiver) {
        return res.status(403).json({
          status:'error',
          message:'All feilds are required'
        })
      }
     
      const isValidChatId = mongoose.isValidObjectId(receiver);

      if (!isValidChatId) {
        return res.status(403).json({
          status: "error",
          message: "Invalid User Id",
        });
      }


      const createdChat = new chatModel({
        participants: [
          sender,
          receiver,
        ]
      });
      let result = await createdChat.save();
      console.log(result);
      let allChats = await chatModel
        .find({
          participants: { $in: sender },
        })
        .populate("participants", "-password")
        .lean();
      // console.log(allChats);

      if (allChats.length > 0) {
        let Chats = allChats.map((chat) => {
          if(chat.messages && chat.messages.length > 0) {
            chat.lastMessage = chat.messages[chat.messages.length - 1];
            delete chat.messages;

            // console.log("chat is " + chat);
            if (!chat.lastMessage.sender) {
              chat.lastMessage.sender = "user Deleted";
            }
          }

          return chat;
        });

        // console.log("chats " + Chats);
        return res.status(200).json({
          status: "success",
          chats: Chats,
        });
      } else {
        return res.status(200).json({
          data:[]
        });
      }
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };

  static sendMessage = async (req, res, next) => {
    try {
      const {  message_content, chat_id } = req.body;
console.log(req.body)
      if (!message_content || !chat_id) {
        return res.status(403).json({
          status:'error',
          message:'All feilds are required'
        })
      }
     
      const isValidChatId = mongoose.isValidObjectId(chat_id);

      if (!isValidChatId) {
        return res.status(403).json({
          status: "error",
          message: "Invalid chat Id",
        });
      }


      const createMessage = new messageModel({
        sender: req.user.id,
        receiver: req.body.receiver_id,
        message: message_content,
        chat: chat_id,
      });
      let result = await createMessage.save();
      console.log(result);
      //   const senderInfo = await messageModel.findById(result._id);
      result = 
        await result.populate("sender", "firstName lastName chat_id")
      
      
      console.log(result);
      
      const updatedChat = await chatModel.findByIdAndUpdate(
        chat_id,
        { $push: { messages: result._id } },
        { new: true }
      ).populate('messages');

     
      global.socket.in(req.body.receiver_id).emit("msg_received", result);

      res.status(200).json({ chat: updatedChat });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };


  static updateMessage = async (req, res, next) => {
    try {
      const {  message_content, chat_id } = req.body;
      console.log(req.body)
      if (!message_content || !chat_id) {
        return res.status(403).json({
          status:'error',
          message:'All feilds are required'
        })
      }
     
      const isValidChatId = mongoose.isValidObjectId(chat_id);

      if (!isValidChatId) {
        return res.status(403).json({
          status: "error",
          message: "Invalid chat Id",
        });
      }


      let result = await messageModel.findByIdAndUpdate(
        req.params.message_id,
        {
          message: message_content,
        },
        { new: true }
      );


      console.log(result);
      //   const senderInfo = await messageModel.findById(result._id);
      result = 
        await result.populate("sender", "firstName lastName chat_id")
      
      
      console.log(result);
      
      const updatedChat = await chatModel.findById(
        chat_id,
      ).populate('messages');

     
      global.socket.in(req.body.receiver_id).emit("msg_received", result);

      res.status(200).json({ chat: updatedChat });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };

  
}

export default ChatController;

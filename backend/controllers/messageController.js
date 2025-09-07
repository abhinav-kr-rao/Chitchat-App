// this controller gets messages count for users to be shown on left sidebar

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// get all users except logged in user

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const notLoggedinUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Count number of messages not seen

    // const unseenMsgCount = {};

    const unseenMsgs = {};

    const promises = notLoggedinUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      // if (messages.length > 0) {
      //   unseenMsgCount[user._id] = messages.length;
      // }

      unseenMsgs[user._id] = count;
    });

    await Promise.all(promises);

    res.json({ success: true, users: notLoggedinUsers, unseenMsgs });
  } catch (error) {
    console.log("Error", error);
    res.json({ success: false, message: error.message });
  }
};

// this function gets all messages for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log("Error", error);
    res.json({ success: false, message: error.message });
  }
};

// api to mark msg seen using msgID
export const markMsgSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.log("ERROR", error);
    res.json({ success: false, message: error.message });
  }
};

// function to send msg to selected user

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // if there is image , then we have to upload the image

    let imageURL;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    //Emit the new messages to receiver's socket

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("ERROR sending message", error);
    res.json({ success: false, message: error.message });
  }
};

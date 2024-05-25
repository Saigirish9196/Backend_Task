import _ from "lodash";
import User from "../models/user.model.js";
import { errorHandler } from "../helper/errorHandle.js";

export const test = (req, res) => {
  res.json({ message: "successfully" });
};

//update email & username
export const updateProfile = async (req, res) => {
  console.log(req.body);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      {_id:req.user._id},
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler(error)
  });
  }
};

export const userlist = async (req,res) => {
  // all users list render
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler(error)
    });
  }
}


export const deleteUser = async (req, res) => {
 try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    errorHandler(error);
  }
};
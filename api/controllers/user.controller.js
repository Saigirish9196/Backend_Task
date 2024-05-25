import _ from "lodash";
import User from "../models/user.model.js";
import { errorHandler } from "../helper/errorHandle.js";

export const test = (req, res) => {
  res.json({ message: "successfully" });
};

//update email & username
export const updateProfile = async (req, res) => {

  try {
    
    const user = await User.findById(req.user._id);

    // Update user details
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;

    // If a new password is provided, set it
    if (req.body.password) {
      user.setPassword(req.body.password, async (err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        // Save the updated user details
        await updatedUser.save();
        const { password, salt, hash, ...rest } = updatedUser._doc;
        res.status(200).json({ user: rest });
      });
    } else {
      // Save the updated user details without changing the password
      await user.save();
      const { password, salt, hash, ...rest } = user._doc;
      res.status(200).json({ user: rest });
    }
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
    res.status(200).json({message :'User has been deleted!'});
  } catch (error) {
    errorHandler(error);
  }
};
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { errorHandler } from "../helper/errorHandle.js";

export const signUp = async (req, res) => {
  const { username, email } = req.body;

  console.log(req.body.password);
  User.register({ username, email }, req.body.password, function (err, user) {
    console.log(user);

    if (err) {
      console.log(err);
      return res.status(200).json({ error: errorHandler(err) });
    } else {
      passport.authenticate("local")(req, res, function () {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({ user: user._id }, jwtSecret);
        const { _id, email, username, avatar } = user;
        return res.cookie("access_token", token, { httpOnly: true }).json({
          message: "Successfully register please login!",
          user: { _id, username, email, avatar },
        });
      });
    }
  });
};

export const signIn = async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    passport.authenticate("local", async function (err, user, info) {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (user) {
        req.login(user, async (error) => {
          if (error) {
            return res.status(422).json({ errors: error.errors });
          }

          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign({ user: user._id }, jwtSecret); // Ensure only necessary user data is included
          const { _id, username, email, avatar } = user;

          return res.cookie("access_token", token, { httpOnly: true }).json({
            message: "Successfully Login!",
            user: { _id, username, email, avatar },
          });
        });
      } else {
        return res.status(401).json({
          error: "Username and/or password is invalid",
        });
      }
    })(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An unexpected error occurred",
    });
  }
};

export const googleOAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign({ user: user._id }, jwtSecret);
      const { _id, username, email, avatar } = user;
      return res.cookie("access_token", token, { httpOnly: true }).json({
        user: { _id, username, email, avatar },
      });
    } else {
      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const { username, email, photo } = req.body;
      const newUser = new User({ username, email, avatar: photo });
      User.register(newUser, password, (err, user) => {
        if (err) {
          console.error("User registration error:", err);
          return res.status(400).json({ error: errorHandler(err) });
        } else {
          passport.authenticate("google")(req, res, () => {
            const jwtSecret = process.env.JWT_SECRET;
            const token = jwt.sign({ user: user._id }, jwtSecret);
            const { _id, email, username, avatar } = user;

            res
              .cookie("access_token", token, { httpOnly: true })
              .status(200)
              .json({
                user: { _id, username, email, avatar },
              });
          });
        }
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      error: "An unexpected error occurred",
    });
  }
};

export const signOut = (req, res) => {
  req.logout((err) => {
    if (!err) {
      res.clearCookie('access_token');
      res
      .json({
        message: "Successfully logOut!",
      });
    }
  });
};

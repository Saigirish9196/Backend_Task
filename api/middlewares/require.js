import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/user.model.js";

export function requireAuth(req, res, next) {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      console.log(decodedToken.user._id);
      if (err) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        User.findOne({ _id: decodedToken.user })
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((err) => {
            res.status(401).json({ error: "Invalid token" });
          });
      }
    });
  } else {
    res.status(401).json({ error: "Token not provided" });
  }
}

export const validatorMsgSignUp = [
  check("email").isEmail().withMessage("please required Enter valid email"),
  // check('password').isLength({ min: 8 })
  // .withMessage("password  must be valid 8 charcters"),
  check("username").not().isEmpty().withMessage("please required Enter valid username."),
  check("password")
    .isLength({ min: 8 })
    .withMessage("password  must be valid 8 charcters"),
];

// after check any errors error message display
export function runValidators(req, res, next) {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    if (errors.array()[1]) {
      return res.status(200).json({ error: errors.array()[1].msg });
    } else {
      return res.status(200).json({ error: errors.array()[0].msg });
    }
  }
  next();
  // Process the signup request
}

// forgot password and reset password

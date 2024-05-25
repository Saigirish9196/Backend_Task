import express from "express";
import {
  deleteUser,
  test,
  updateProfile,
  userlist,
} from "../controllers/user.controller.js";
import passport from 'passport';
import session from 'express-session';
import { requireAuth } from "../middlewares/require.js";
import User from "../models/user.model.js";
const router = express.Router();

router.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get("/test", test);
router.get("/users", userlist);
router.put("/update", requireAuth, updateProfile);
router.delete("/delete", requireAuth, deleteUser);

export default router;

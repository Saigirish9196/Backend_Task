import express from 'express';
import { googleOAuth, signIn, signOut, signUp} from '../controllers/auth.controller.js';
import passport from 'passport';
import session from 'express-session';
import User from '../models/user.model.js';
import { runValidators, validatorMsgSignUp } from '../middlewares/require.js';

const router = express.Router();
router.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  
  router.use(passport.initialize());
  router.use(passport.session());
  
  passport.use(User.createStrategy());
  
  
  
  // use static serialize and deserialize of model for passport session support
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


router.post('/sign-up',validatorMsgSignUp,runValidators , signUp);
router.post('/sign-in', signIn);
router.post("/google",googleOAuth)
router.delete("/signOut",signOut)
export default router;

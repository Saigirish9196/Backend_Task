import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User = mongoose.model('User', userSchema);

export default User;
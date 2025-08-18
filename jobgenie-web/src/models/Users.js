import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailTokenExpires: Date,
  preferredSkills: {
    type: String,
    default: "None",
  },
  preferredLocations:  {
    type: String,
    default: "None",
  },
});

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

export default UserModel;

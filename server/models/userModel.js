import mongoose from "mongoose";
import sha1 from "sha1";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
});

// Define the statics.signup method here, before compiling the schema into a model
userSchema.statics.signup = async function(email, password, username, gender, phone, country) {
  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error("User already exists");
  }
  const sha1Password = sha1(password);
  const user = await this.create({
    email,
    password: sha1Password,
    username,
    gender,
    phone,
    country,
  });
  return user;
};

userSchema.statics.getUser = async function(userId) {
  const user = await this.findById(userId);
  return user;
}

userSchema.statics.updateUser = async function(userId, email, gender, phone, country) {
  const user = await this.findByIdAndUpdate(userId, { email: email, gender: gender, phone: phone, country: country }, { new: true });
  return user;
}

const User = mongoose.model("User", userSchema);

export default User;

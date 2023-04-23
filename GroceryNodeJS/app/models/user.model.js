'use strict'
import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const UserScheme = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
  bio: String,
  avatar: String,
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  user_id: String,
}, {
  collection: "User",
  timestamps: true
})

export default mongoose.model("user", UserScheme, "users")
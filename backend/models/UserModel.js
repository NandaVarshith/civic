import { Schema, model } from "mongoose";

// create user schema 
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  {
    strict: "throw",
    timestamps: true,

  },
);

//create user model with that schema
export const UserModel = model("users", userSchema);

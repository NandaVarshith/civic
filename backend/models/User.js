import { Schema, model } from "mongoose";

// create user schema 
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // important for security
    },

    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
    },

    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    profileImage: {
      type: String, // store image URL
      default: "https://i.pravatar.cc/150",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    strict: "throw",
    timestamps: true, // gives createdAt & updatedAt automatically
  }
);

// create user model
export const User = model("User", userSchema);

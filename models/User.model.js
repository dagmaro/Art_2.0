const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    url: String,
    firstName: {
      type: String,
      trim: true,
      required: false,
    },
    lastName: {
      type: String,
      trim: true,
      required: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    userType: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

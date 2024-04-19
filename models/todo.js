import mongoose from "mongoose";
import userModel from "@/models/user";

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.models.Todo || mongoose.model("Todo", schema);

export default model;
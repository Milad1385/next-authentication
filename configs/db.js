import mongoose from "mongoose";
const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return false;
    }
    await mongoose.connect("mongodb://127.0.0.1:27017/next-auth");
    console.log("Connected to db successFully :)");
  } catch (err) {
    console.log("Connected to db is faild please try again !!!");
  }
};

export default connectToDB;

// DB => DataBase => mongodb

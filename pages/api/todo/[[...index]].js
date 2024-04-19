const { verifyToken } = require("@/utils/auth");
import todosModel from "@/models/todo";
import todoValidator from "@/validators/todo";
import usersModel from "@/models/user";
import connectToDB from "@/configs/db";
import { isValidObjectId } from "mongoose";

const handler = async (req, res) => {
  connectToDB();
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .redirect("/signin")
        .status(422)
        .json({ message: "user is unauthorized :(" });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res
        .redirect("/signin")
        .status(422)
        .json({ message: "user is unauthorized :(" });
    }

    const userInfo = await usersModel.findOne({
      email: decodedToken.email,
    });

    if (req.method === "GET") {
      const userTodo = await todosModel.find({
        user: userInfo._id,
      });

      if (userTodo) {
        return res.json(userTodo);
      } else {
        return res.status(404).json({ msg: "todo not founded :(" });
      }
    } else if (req.method === "POST") {
      const isValid = await todoValidator(req.body);

      if (isValid !== true) {
        return res.status(422).json(isValid);
      }

      const { title, isCompleted } = req.body;
      console.log(title, isCompleted);

      const todo = await todosModel.create({
        title,
        isCompleted: isCompleted ? "true" : "false",
        user: userInfo._id,
      });

      return res
        .status(201)
        .json({ message: "todo created successfully :)", todo });
    } else if (req.method === "DELETE") {
      const id = req.query.index[0];
      if (isValidObjectId(id)) {
        await todosModel.findOneAndDelete({ _id: id });
        return res.json({ message: "Todo deleted successfully :)" });
      } else {
        await res.status(422).json({ message: "id is not valid" });
      }
    } else if (req.method === "PUT") {
      const { isCompleted } = req.body;
      const id = req.query.index[0];
      if (isValidObjectId(id)) {
        await todosModel.findOneAndUpdate(
          { _id: id },
          {
            isCompleted,
          }
        );
        return res.json({ message: "Todo deleted successfully :)" });
      } else {
        await res.status(422).json({ message: "id is not valid" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "unknown err :)" });
  }
};

export default handler;

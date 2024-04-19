import userValidator from "@/validators/user";
import userModel from "@/models/user";
import { genSalt, hash } from "bcryptjs";
import connectToDB from "@/configs/db";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
const handler = async (req, res) => {
  connectToDB();
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "please use post method in this route" });
  }

  try {
    const isValid = await userValidator(req.body);
    console.log(isValid);
    if (isValid !== true) {
      res.status(422).json(isValid);
    }

    const { firstName, lastName, username, email, password } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return res.status(400).json({ message: "user exists successfully :)" });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const users = await userModel.find({});
    console.log(users.length);

    const user = await userModel.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: users.length ? "USER" : "ADMIN",
    });

    const token = sign({ email }, process.env.privateKey, {
      expiresIn: "1h",
    });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60,
        })
      )
      .status(201)
      .json({ message: "user created successfully :)", user });
  } catch (err) {
    return res.status(500).json({ message: "unkhnown err happen in server" });
  }
};

export default handler;

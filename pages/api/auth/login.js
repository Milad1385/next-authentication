import connectToDB from "@/configs/db";
import loginValidator from "@/validators/login";
import userModel from "@/models/user";
import { verifyPassword } from "@/utils/auth";
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
    const isValid = await loginValidator(req.body);
    if (isValid !== true) {
      return res.status(422).json(isValid);
    }

    const { identifier, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "user not founded !!!" });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword)
      return res
        .status(404)
        .json({ message: "username or password is not correct!!!" });

    const token = sign({ email: user.email }, process.env.privateKey, {
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
      .status(200)
      .json({ message: "user logged in successfully :)" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "unkhnown err happen in server" });
  }
};

export default handler;

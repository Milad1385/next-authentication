import connectToDB from "@/configs/db";
import userModel from "@/models/user";
import { verifyToken } from "@/utils/auth";
const handler = async (req, res) => {
  connectToDB();
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "please use post method in this route" });
  }

  try {
    const { token } = req.cookies;
    if (!token) {
      return res.redirect("/signin");
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.redirect("/signin");
    }

    const userInfo = await userModel.findOne({ email: decodedToken.email });

    return res.status(200).json(userInfo);
  } catch (err) {
    return res.status(500).json({ message: "there is some problem in server" });
  }
};

export default handler;

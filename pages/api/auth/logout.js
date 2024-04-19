import { serialize } from "cookie";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "please use post method in this route" });
  }

  const { token } = req.cookies;
  if (!token) {
    return res.redirect("/signin");
  }

  return res
    .setHeader(
      "Set-Cookie",
      serialize("token", "", {
        path: "/",
        maxAge: 0,
      })
    )
    .status(200)
    .json({ message: "user logout successFully:)" });
};

export default handler;

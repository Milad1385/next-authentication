import { verify } from "jsonwebtoken";
import { compare } from "bcryptjs";

const verifyToken = (token) => {
  try {
    const decodedToken = verify(token, process.env.privateKey);
    return decodedToken;
  } catch (err) {
    console.log(err);
  }
};

const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export { verifyToken , verifyPassword };

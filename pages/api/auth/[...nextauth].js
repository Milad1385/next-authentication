import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import loginValidator from "@/validators/login";
import connectToDB from "@/configs/db";
import usersModel from "@/models/user";
import { verifyPassword } from "@/utils/auth";
export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "auth-todo",
      async authorize(credentials, req) {
        connectToDB();
        const { identifier, password } = credentials;
        console.log("credentials -> ", credentials);
        const isValid = await loginValidator({ identifier, password });
        if (isValid !== true) {
          throw new Error("please enter value correct!!!");
        }

        const userInfo = await usersModel.findOne({
          $or: [{ username: identifier }, { email: identifier }],
        });

        if (!userInfo) {
          throw new Error("user not founded :(");
        }

        const isValidPassword = await verifyPassword(
          password,
          userInfo.password
        );

        if (!isValidPassword) {
          throw new Error("username or password in incorrect !!!");
        }

        return {
          email: userInfo,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log(
        "user => ",
        user,
        "account => ",
        account,
        "profile => ",
        profile
      );

      return true;
    },
  },
  secret: process.env.privateKey,
});

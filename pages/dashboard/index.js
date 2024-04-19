import { verifyToken } from "@/utils/auth";
import userModel from "@/models/user";
import React from "react";
import Head from "next/head";

function Dashboard({ user }) {
  console.log(user);
  return (
    <>
      <Head>
        <title> داشبورد - {user.firstName} 🗿</title>
      </Head>
      <h1>
        {user.firstName} - {user.lastName} - Welcome To Dashboard
      </h1>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const tokenInfo = verifyToken(token);
  if (!tokenInfo) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const userInfo = await userModel.findOne(
    {
      email: tokenInfo.email,
    },
    "-password -__v"
  );

  return {
    props: {
      user: JSON.parse(JSON.stringify(userInfo)),
    },
  };
}

export default Dashboard;

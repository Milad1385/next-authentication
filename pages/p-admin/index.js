import connectToDB from "@/configs/db";
import React from "react";
import userModel from "@/models/user";
import { verifyToken } from "@/utils/auth";
import Head from "next/head";

function PAdmin({ userInfo }) {
  return (
    <>
      <Head>
        <title>پنل ادمین - {userInfo.firstName} 🗿</title>
      </Head>
      <h1>
        Welcome To Admin Panel {userInfo.firstName} - {userInfo.lastName} ❤️
      </h1>
    </>
  );
}

export async function getServerSideProps({ req }) {
  connectToDB();
  const { token } = req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const tokenInfo = verifyToken(token);
  if (!tokenInfo) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const userInfo = await userModel.findOne({
    email: tokenInfo.email,
  });

  if (userInfo.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(userInfo)),
    },
  };
}

export default PAdmin;

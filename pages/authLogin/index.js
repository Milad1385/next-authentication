import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useState } from "react";
import swal from "sweetalert";
import { getSession, signIn } from "next-auth/react";

function Index({ user }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      swal({
        title: "Please enter information",
        icon: "error",
        buttons: "Ok",
      });
      return false;
    }

    const signin = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    console.log(signin);
  };

  const loginWithGitHub = async () => {
    const signin = await signIn("github");

    console.log(signin);
  };
  return (
    <>
      <Head>
        <title>صفحه ورود</title>
      </Head>
      <img
        className="w-[125px] mx-auto mt-3 rounded-full"
        src={user?.image ? user?.image : "/images/user.png"}
        alt="user.png"
      />
      <div>
        <h1 className="text-center mt-10 text-3xl text-red-600 font-bold">{user?.name ? `welcome to dashboard ${user.name}` : "Please login"}</h1>
      </div>
      <div className="box mt-28">
        <h1 align="center" className="text-3xl">
          Login Form
        </h1>
        <form role="form" method="post">
          <div className="inputBox">
            <input
              type="text"
              autoComplete="off"
              required={true}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <label>Username | Email</label>
          </div>
          <div className="inputBox">
            <input
              type="password"
              autoComplete="off"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <input
            type="submit"
            className="register-btn"
            value="Sign In"
            onClick={loginHandler}
          />

          <input
            type="submit"
            className="register-btn mt-5"
            value="GitHub"
            onClick={loginWithGitHub}
          />
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  console.log(session);

  return {
    props: {
      user: session?.user ?? [],
    },
  };
}

export default Index;

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import swal from "sweetalert";

function Index() {
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

    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (res.status === 200) {
      swal({
        title: "user logged in successFully",
        icon: "success",
        buttons: "Go to dashboard",
      }).then(() => {
        router.replace("/dashboard");
      });
    } else {
      swal({
        title: "username or password is incorrect",
        icon: "error",
        buttons: "try again !!!",
      });
    }
  };
  return (
    <>
      <Head>
        <title>صفحه ورود</title>
      </Head>
      <div className="box">
        <h1 align="center">Login Form</h1>
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
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;
  if (token) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}

export default Index;

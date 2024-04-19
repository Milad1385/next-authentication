import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import swal from "sweetalert";
function Index() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email || !password) {
      return false;
    }

    const res = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    });

    if (res.status === 201) {
      swal({
        title: "User resgistered successfully :)",
        icon: "success",
        buttons: "Go to dashboard",
      }).then(() => {
        router.replace("/dashboard");
      });
    } else if (res.status === 400) {
      swal({
        title: "User Existed already :(",
        icon: "error",
        buttons: "Try again",
      });
    }
  };
  return (
    <>
      <Head>
        <title>صفحه ثبت نام</title>
      </Head>
      <div className="box">
        <h1 align="center">SignUp Form</h1>
        <form role="form" method="post">
          <div className="inputBox">
            <input
              type="text"
              autoComplete="off"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label>Firstname</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              autoComplete="off"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label>Lastname</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              autoComplete="off"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>
          <div className="inputBox">
            <input
              type="email"
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className="inputBox">
            <input
              type="password"
              autoComplete="off"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <input
            type="submit"
            className="register-btn"
            value="Sign Up"
            onClick={registerHandler}
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

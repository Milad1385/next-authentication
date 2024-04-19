import React from "react";
import Link from "next/link";
import userModel from "@/models/user";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignIn,
  faSignOut,
  faSolarPanel,
  faBars,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { verifyToken } from "@/utils/auth";
import connectToDB from "@/configs/db";
import swal from "sweetalert";
import { useRouter } from "next/router";
import Head from "next/head";

function Index({ user }) {
  const router = useRouter();
  const logoutHandler = () => {
    swal({
      title: "Are you sure ?",
      icon: "warning",
      buttons: ["no", "yes"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`http://localhost:3000/api/auth/logout`);
        if (res.status === 200) {
          swal({
            title: "user logout successfully :)",
            icon: "success",
            buttons: "Ok",
          }).then(() => {
            router.reload();
          });
        }
      }
    });
  };
  return (
    <>
      <Head>
        <title>صفحه اصلی</title>
      </Head>
      <div className="container">
        <aside className="sidebar">
          <h3 className="sidebar-title">Sidebar</h3>

          <ul className="sidebar-links">
            <>
              {/* User is login */}

              {/* User is login */}
            </>
            <>
              {/* User not login */}
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard">
                      <span>
                        <FontAwesomeIcon icon={faBars} />
                      </span>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/todos">
                      <span>
                        <FontAwesomeIcon icon={faPencil} />
                      </span>
                      Todos
                    </Link>
                  </li>
                  <li onClick={logoutHandler}>
                    <Link href="#">
                      <span>
                        <FontAwesomeIcon icon={faSignOut} />
                      </span>
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/signin">
                      <span>
                        <FontAwesomeIcon icon={faSignIn} />
                      </span>
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup">
                      <span>
                        <FontAwesomeIcon icon={faSignIn} />
                      </span>
                      Sign up
                    </Link>
                  </li>
                </>
              )}
              {/* User not login */}
            </>
            {/* User is login & admin */}
            {user?.role === "ADMIN" && (
              <li>
                <Link href="/p-admin">
                  <span>
                    <FontAwesomeIcon icon={faSolarPanel} />
                  </span>
                  Admin panel
                </Link>
              </li>
            )}
          </ul>
          <img className="wave" src="/Images/wave.svg" alt="wave" />
        </aside>
        <main className="main"></main>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  connectToDB();
  const { token } = req.cookies;

  const tokenInfo = verifyToken(token);

  const userInfo = await userModel.findOne(
    {
      email: tokenInfo?.email || "",
    },
    "-password -__v"
  );

  return {
    props: {
      user: JSON.parse(JSON.stringify(userInfo)),
    },
  };
}

export default Index;

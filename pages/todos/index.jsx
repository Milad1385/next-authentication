import React, { useState, useEffect } from "react";
import todosModel from "@/models/todo";
import usersModel from "@/models/user";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPlusCircle,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert";
import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";
import { useRouter } from "next/router";

function Todolist({ todos, userInfo }) {
  const router = useRouter();
  const [allTodos, setAllTodos] = useState([...todos]);
  const [isShowInput, setIsShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (!title) {
      swal({
        title: "Please enter the title",
        icon: "error",
        buttons: "Ok",
      });
      return false;
    }

    const res = await fetch(`/api/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, isCompleted }),
    });

    if (res.status === 201) {
      swal({
        title: "Todo created successfully :)",
        icon: "success",
        buttons: "Great",
      }).then(() => {
        getAllTodos();
        setTitle("");
        setIsCompleted(false);
      });
    }
  };

  const getAllTodos = async () => {
    const res = await fetch(`/api/todo`);
    const allTodos = await res.json();

    setAllTodos(allTodos);
  };

  const deleteHandler = async (id) => {
    swal({
      title: "Are you sure ?",
      icon: "warning",
      buttons: ["No", "Yes"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/todo/${id}`, {
          method: "DELETE",
        });

        if (res.status === 200) {
          swal({
            title: "Todo deleted successfully :)",
            icon: "success",
            buttons: "Great",
          }).then(() => {
            getAllTodos();
          });
        }
      }
    });
  };

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
            router.replace("/signin");
          });
        }
      }
    });
  };

  const handleCompleteOrDecline = async (id, status) => {
    const res = await fetch(`/api/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isCompleted: status }),
    });

    if (res.status === 200) {
      getAllTodos();
    }
  };
  return (
    <>
      <h1 className="text-[42px] font-bold text-red-600 pt-5 px-4 text-center">
        Next-Todos
      </h1>
      <div className="w-[450px] h-full mx-auto mt-10">
        <div
          className={`my-7 w-full border-[3px] border-red-600 bg-white ${
            isShowInput ? "flex" : "hidden"
          } items-center justify-between rounded-md`}
        >
          <input
            type="text"
            placeholder="enter todo title ..."
            className="w-full outline-none px-2 h-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="bg-red-600 text-white w-[50px] h-[44px]"
            onClick={createNewTodo}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="todos bg-white rounded-md shadow-sm w-[450px] h-[500px] overflow-hidden">
          <div className="grid grid-cols-3 place-items-center  px-6 py-4 bg-red-600 text-white">
            <div className="text-lg">{userInfo.firstName}</div>
            <button
              className="text-3xl"
              onClick={() => setIsShowInput((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
            <div className="text-lg" onClick={logoutHandler}>
              logout
            </div>
          </div>
          <ul className="divide-y-2 overflow-y-auto h-[433px]">
            {allTodos.length ? (
              allTodos.map((todo) => (
                <li
                  className={`flex items-center justify-between p-4 ${
                    todo.isCompleted === "true" ? "isCompleted" : ""
                  }`}
                >
                  <p>{todo.title}</p>
                  <div className="flex items-center gap-x-4 cursor-pointer ">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteHandler(todo._id)}
                    />
                    {todo.isCompleted === "true" ? (
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="w-[14px]"
                        onClick={() => handleCompleteOrDecline(todo._id, false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCheck}
                        onClick={() => handleCompleteOrDecline(todo._id, true)}
                      />
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="bg-gray-600 text-white text-2xl text-center py-4">
                There is no todo for {userInfo.firstName}
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }) {
  connectToDB();

  const { token } = req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const userInfo = await usersModel.findOne({
    email: decodedToken.email,
  });

  const todos = await todosModel.find({
    user: userInfo._id,
  });

  console.log(todos);
  return {
    props: {
      todos: JSON.parse(JSON.stringify(todos)),
      userInfo: JSON.parse(JSON.stringify(userInfo)),
    },
  };
}

export default Todolist;

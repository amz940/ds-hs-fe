import React, { useContext, useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider";

export function MemberLogin(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const { fetchLogin, login, isAuthenticated, authCheck } =
    useContext(LoginContext);

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          description: "로그인 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "아이디와 암호를 다시 확인해주세요.",
          status: "warning",
        });
      })
      .finally(() => fetchLogin());
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3">
          <div className="rounded-xl">
            <div className="h-full w-full object-cover bg-opacity-40"></div>

            {/*TODO : 백그라운드 이미지 넣고 좌우 크기 수정해야함..*/}
            <img
              src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
              alt="image 2"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="font-dongle text-7xl font-bold text-center text-gray-700 dark:text-white">
                아프지마
              </h2>
              <p className="font-dongle text-4xl mt-3 text-gray-500 dark:text-gray-300">
                아이디와 패스워드를 입력해주세요.
              </p>
            </div>

            <div className="mt-8">
              <div>
                <label
                  form="id"
                  className="block mb-2 font-dongle text-4xl text-gray-600 dark:text-gray-200"
                >
                  아이디
                </label>
                <input
                  type="text"
                  placeholder="Your id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div className="mt-6">
                <label
                  form="password"
                  className="font-dongle text-4xl text-gray-600 dark:text-gray-200"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleLogin}
                  className="font-dongle text-5xl w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  접속 하기
                </button>
              </div>

              <button
                onClick={() => navigate("/home/member/findId")}
                className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline ml-2"
              >
                아이디 찾기
              </button>

              <button
                onClick={() => navigate("/home/member/findPassword")}
                className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline ml-2"
              >
                비밀번호 찾기
              </button>

              <p className="mt-6 text-sm text-center text-gray-400">
                아직 가입을 안하셨나요?{" "}
                <button
                  onClick={() => navigate("/home/member/signup")}
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  가입하기
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberLogin;

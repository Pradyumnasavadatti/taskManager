import { useEffect, useRef } from "react";
import Input from "../Input";
import Button from "../Button";
import Todo from "../../assets/Todo.png";
import axios, { AxiosResponse } from "axios";
import {
  backend_url,
  local_storage_token_key,
  local_storage_token_time,
} from "../../config/creds";
import { useSetRecoilState } from "recoil";
import { errorAtom } from "../../store/Error";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodLogin } from "../../zod/Zod";
import { useCheckForToken } from "./common";
import { loadAtom } from "../../store/Load";

function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const setError = useSetRecoilState(errorAtom);
  const navigator = useNavigate();
  const setLoadHandler = useSetRecoilState(loadAtom);

  const thisPath = useLocation().pathname;
  let path = useCheckForToken(thisPath);

  async function onClickHandler(): Promise<any> {
    try {
      setLoadHandler(true);
      const userData = {
        username: usernameRef.current?.value,
        password: passwordRef.current?.value,
      };
      const { success } = zodLogin.safeParse(userData);
      if (!success) {
        setError("Please provide valid inputs");
        return;
      }
      const response: AxiosResponse = await axios.post(
        backend_url + "user/loginUser",
        {
          ...userData,
        }
      );
      localStorage.setItem(local_storage_token_key, response.data.message);
      localStorage.setItem(local_storage_token_time, new Date().toString());
      navigator("/home");
    } catch (e: any) {
      if (e.response.status < 500) {
        setError(e.response.data.message);
      } else {
        setError("Something went wrong please try after some time");
      }
    } finally {
      setLoadHandler(false);
    }
  }

  useEffect(() => {
    //Getting thisPath from custome hook which decides wheather to route which component
    if (thisPath != path) {
      navigator(path);
    }
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex justify-between items-center">
      <div className="w-[50%] h-full flex justify-center items-center bg-app-theme-100">
        <div className="w-[75%] h-[60%] text-app-theme-400 flex flex-col justify-evenly items-center rounded-xl">
          <h1 className="font-mono text-4xl">Login to continue!</h1>
          <Input ref={usernameRef} fieldName="Email" />
          <Input ref={passwordRef} fieldName="Password" />
          <Button title="Login" onClickHandler={onClickHandler} />
          <p className="text-lg">
            Don't have an account?
            <Link to="/signup" className="underline">
              <b>Sign up!</b>
            </Link>
          </p>
        </div>
      </div>
      <div className="w-[50%] h-full flex justify-center items-center relative">
        <img
          src={Todo}
          alt="Loading..."
          className="w-full h-full"
          draggable={false}
        />
        <div className="z-10 absolute text-3xl bg-[rgba(0,0,0,0.2)] w-[70%] p-10 text-white font-mono flex flex-col backdrop-blur-sm">
          <span>
            "The key is not to prioritize what's on your schedule, but to
            schedule your priorities."
          </span>
          <div className="w-full flex justify-end">
            <span className="text-2xl">- Stephen Covey</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

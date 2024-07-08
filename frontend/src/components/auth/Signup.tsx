import { Link, useLocation, useNavigate } from "react-router-dom";
import Pic from "../../assets/Todo2.png";
import Button from "../Button";
import Input from "../Input";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  backend_url,
  local_storage_token_key,
  local_storage_token_time,
} from "../../config/creds";
import { zodUser } from "../../zod/Zod";
import { useSetRecoilState } from "recoil";
import { errorAtom } from "../../store/Error";
import { useCheckForToken } from "./common";
import { loadAtom } from "../../store/Load";

function Signup() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const fullnameRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);
  const setLoadHandler = useSetRecoilState(loadAtom);

  const thisPath = useLocation().pathname;
  let path = useCheckForToken(thisPath);

  const setError = useSetRecoilState(errorAtom);

  const navigator = useNavigate();

  useEffect(() => {
    let timer = setTimeout(async () => {
      const response = await axios.post(backend_url + "user/getUser", {
        username: email,
      });
      if (!response.data.message) {
        setEmailWarning(false);
        return;
      } else {
        setEmailWarning(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [email]);

  function handleEmailChange(e: any) {
    setEmail(e.target?.value);
  }

  async function onClickHandler() {
    try {
      setLoadHandler(true);
      const userInput = {
        username: email,
        password: passwordRef.current?.value,
        fullname: fullnameRef.current?.value,
      };
      const { success } = zodUser.safeParse(userInput);
      if (success) {
        const response: AxiosResponse = await axios.post(
          backend_url + "user/signupUser",
          {
            ...userInput,
          }
        );
        localStorage.setItem(local_storage_token_key, response.data.message);
        localStorage.setItem(local_storage_token_time, new Date().toString());
        navigator("/home");
      } else {
        setError("Invalid inputs!");
      }
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
    if (thisPath != path) {
      navigator(path);
    }
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-white flex justify-center overflow-hidden">
      <div className="w-[50%] h-full flex justify-center items-center">
        <img src={Pic} alt="Loading..." className="w-[70%] h-[70%]" />
      </div>
      <div className="relative w-[50%] h-full flex justify-center items-center text-app-theme-400">
        <div className="w-[70%] h-[80%] flex justify-evenly items-center flex-col  z-10">
          <h1 className="text-5xl">Lets get started...</h1>
          <div className="w-[90%] h-fit p-2 flex flex-col justify-evenly items-start">
            <label className="text-xl">Email</label>
            <input
              type="text"
              className="p-2 outline-none text-xl w-full"
              placeholder={"Enter your email"}
              value={email}
              onChange={handleEmailChange}
            ></input>
            <div className="w-[90%] px-2 justify-start">
              {emailWarning && (
                <span className="text-gray-500 text-sm">
                  This email already exists
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center items-center flex-col">
            <Input fieldName="Full Name" ref={fullnameRef} />
            <div className="w-[90%] justify-start text-sm">
              <span className="text-gray-500 text-sm">
                Minimum of 3 and maximum of 30 chars
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center items-center flex-col">
            <Input fieldName="Password" ref={passwordRef} />
            <div className="w-[90%] justify-start text-sm">
              <span className="text-gray-500 text-sm">
                Minimum of 5 and maximum of 15 chars
              </span>
            </div>
          </div>
          <Button
            title="Sign Up!"
            onClickHandler={onClickHandler}
            disabled={emailWarning}
          />
          <p className="text-lg">
            Already have an account?
            <Link to="/login" className="underline">
              <b>Login</b>
            </Link>
          </p>
        </div>
        <div className="absolute w-[80%] h-[120%] bg-app-theme-400 rounded-3xl z-0 -rotate-12 "></div>
        <div className="absolute w-[80%] h-[120%] bg-app-theme-100 rounded-3xl z-0 rotate-12"></div>
      </div>
    </div>
  );
}

export default Signup;

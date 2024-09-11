import { useEffect, useRef } from "react";
import Logo from "../../assets/logo3.png";
// import Input from "../Input";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="w-[100vw] h-[100vh] flex justify-center md:justify-between items-center">
      <div className="w-full md:w-[50%] h-full flex justify-center items-center bg-app-theme-100">
        <Card className="w-[80%] h-[70%] md:w-[60%] md:h-[50%] relative">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Login to continue!</CardDescription>
          </CardHeader>
          <CardContent className="h-[65%] flex flex-col justify-evenly">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                ref={usernameRef}
                type="email"
                placeholder="Email"
                id="email"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                id="password"
              />
            </div>

            <Button
              variant={"default"}
              size={"customSize"}
              onClick={onClickHandler}
            >
              Login
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <p className="text-sm font-medium">
              Don't have an account?
              <Link to="/signup" className="underline">
                <b>Sign up!</b>
              </Link>
            </p>
          </CardFooter>
          <img
            src={Logo}
            className="absolute right-2 top-2 w-[10vmax] h-[10vmax] md:w-[5vmax] md:h-[5vmax]"
          />
        </Card>
      </div>
      <div className="w-[50%] h-full md:flex justify-center items-center relative hidden">
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

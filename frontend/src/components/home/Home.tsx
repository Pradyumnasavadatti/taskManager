import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./navbar/Nav";
import Addtask from "../addtask/Addtask";
import Container from "./container/Container";
import { backend_url, local_storage_token_key } from "../../config/creds";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tasksAtom } from "../../store/Tasks";
import axios from "axios";
import { unfilteredTasks } from "../../store/UnfilteredTasks";
import { useDoFilter } from "./container/Filter";
import Kanban from "../kanban/Kanban";
import { errorAtom } from "../../store/Error";
import { useCheckForToken } from "../auth/common";

function Home() {
  const url = useLocation();
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const [unfilteredTask, setUnfilteredTasks] = useRecoilState(unfilteredTasks);
  const setError = useSetRecoilState(errorAtom);
  const filter = useDoFilter();
  const navigator = useNavigate();
  const thisPath = useLocation().pathname;
  let path = useCheckForToken(thisPath);

  useEffect(() => {
    try {
      //Getting thisPath from custome hook which decides wheather to route which component
      if (thisPath != path) {
        navigator("/login");
      } else {
        const fetch = async () => {
          const headers = {
            auth: localStorage.getItem(local_storage_token_key),
          };
          const response = await axios.get(backend_url + "task/getTasks", {
            headers,
          });
          setUnfilteredTasks(response.data.message.tasks);
        };
        if (tasks.length == 0) {
          fetch();
        }
      }
    } catch (e: any) {
      if (e.response.status < 500) {
        setError(e.response.data.message);
      } else {
        setError("Something went wrong please try after some time");
      }
    }
  }, []);
  useEffect(() => {
    let filteredTasks = filter();
    setTasks(filteredTasks);
  }, [unfilteredTask]);

  if (url.pathname == "/addTask") {
    return (
      <div className="w-[100vw] h-[100vh] md:grid md:grid-cols-5 md:bg-app-theme-100">
        <Nav />
        <Addtask />
      </div>
    );
  }

  if (url.pathname == "/kanban") {
    return (
      <div className="w-[100vw] h-[100vh] md:grid md:grid-cols-5 bg-app-theme-100 overflow-y-visible">
        <Nav />
        <Kanban />
      </div>
    );
  }

  return (
    <div className="w-[100vw] h-[100vh] md:grid md:grid-cols-5 bg-app-theme-100 ">
      <Nav />
      <Container />
    </div>
  );
}

export default Home;

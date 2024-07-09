import { useLocation } from "react-router-dom";
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

function Home() {
  const url = useLocation();
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const [unfilteredTask, setUnfilteredTasks] = useRecoilState(unfilteredTasks);
  const filter = useDoFilter();
  useEffect(() => {
    const fetch = async () => {
      const headers = { auth: localStorage.getItem(local_storage_token_key) };
      const response = await axios.get(backend_url + "task/getTasks", {
        headers,
      });
      setUnfilteredTasks(response.data.message.tasks);
    };
    if (tasks.length == 0) {
      fetch();
    }
  }, []);
  useEffect(() => {
    let filteredTasks = filter();
    setTasks(filteredTasks);
  }, [unfilteredTask]);

  if (url.pathname == "/addTask") {
    return (
      <div className="w-[100vw] h-[100vh] grid grid-cols-5 bg-app-theme-100">
        <Nav />
        <Addtask />
      </div>
    );
  }

  return (
    <div className="w-[100vw] h-[100vh] grid grid-cols-5 bg-app-theme-100 ">
      <Nav />
      <Container />
    </div>
  );
}

export default Home;
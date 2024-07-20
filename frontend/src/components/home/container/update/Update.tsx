import { useRecoilState, useSetRecoilState } from "recoil";
import CloseIcon from "../../../../assets/close.png";
import { updateAtom } from "../../../../store/Update";
import { useEffect, useState } from "react";
import { tasksAtom } from "../../../../store/Tasks";
import Button from "../../../Button";
import { backend_url, local_storage_token_key } from "../../../../config/creds";
import axios from "axios";
import { loadAtom } from "../../../../store/Load";
import { errorAtom } from "../../../../store/Error";
import { taskModelWithDateString } from "../../../../zod/Zod";
import { useDoFilter } from "../Filter";
import { unfilteredTasks } from "../../../../store/UnfilteredTasks";
function Update() {
  const [update, setUpdate] = useRecoilState(updateAtom);
  const [tasks, setFilteredTaskAtom] = useRecoilState(tasksAtom);
  const [isUpdate, setIsUpdate] = useState(false);
  const setLoader = useSetRecoilState(loadAtom);
  const setError = useSetRecoilState(errorAtom);
  const [task, setTasks] = useRecoilState(unfilteredTasks);
  const doFilterFn = useDoFilter();
  const closeHandler = () => {
    setUpdate(-1);
  };
  const [details, setDetails] = useState({
    title: "",
    description: "",
    type: "",
    dueDate: "",
    createdAt: "",
    id: -1,
  });
  useEffect(() => {
    if (update != -1) {
      setDetails(tasks[update]);
    }
  }, [update]);
  function changeHandler(e: any) {
    if (e.target.name == "title") {
      setDetails({ ...details, title: e.target.value });
    } else if (e.target.name == "description") {
      setDetails({ ...details, description: e.target.value });
    } else if (e.target.name == "type") {
      setDetails({ ...details, type: e.target.value });
    } else if (e.target.name == "dueDate") {
      setDetails({ ...details, dueDate: e.target.value });
    }
  }
  function updateHandler() {
    setIsUpdate(true);
  }
  useEffect(() => {
    async function updateFn() {
      try {
        const taskBody = {
          title: details.title,
          description: details.description,
          type: details.type,
          dueDate: details.dueDate,
        };
        const { success, error } = taskModelWithDateString.safeParse(taskBody);
        if (!success) {
          console.log(error.issues);
          throw new Error(
            error.issues[0].message + " " + error.issues[0].path[0]
          );
        }
        const today = new Date()
          .toLocaleString()
          .split(",")[0]
          .split("/")
          .reverse();
        const actualDate = details.dueDate.split("T")[0].split("-");
        if (Number(actualDate[2]) < Number(today[2])) {
          throw new Error(
            "Invalid Due Date. Please do not provide past dates for due date"
          );
        } else if (
          Number(actualDate[1]) < Number(today[1]) &&
          Number(actualDate[2]) == Number(today[2])
        ) {
          throw new Error(
            "Invalid Due Date. Please do not provide past dates for due date"
          );
        } else if (
          Number(actualDate[0]) < Number(today[0]) &&
          Number(actualDate[1]) == Number(today[1]) &&
          Number(actualDate[2]) == Number(today[2])
        ) {
          throw new Error(
            "Invalid Due Date. Please do not provide past dates for due date"
          );
        }
        const headers = {
          "Content-type": "application/json",
          auth: localStorage.getItem(local_storage_token_key),
        };
        setLoader(true);
        await axios.post(
          backend_url + "task/updateTask",
          {
            task: {
              ...details,
            },
          },
          {
            headers,
          }
        );
        const newTask = details;
        let newTaskArr: any = [];
        newTaskArr.push(...task);
        newTaskArr = newTaskArr.filter((t: any) => t.id != newTask.id);
        newTaskArr.push(newTask);
        setTasks(newTaskArr);
        const filteredArr = doFilterFn();
        setFilteredTaskAtom(filteredArr);
        setUpdate(-1);
      } catch (e: any) {
        if (e.response && e.response.status < 500) {
          setError(e.response.data.message);
        } else {
          setError(e.message);
        }
      } finally {
        setLoader(false);
      }
    }
    if (isUpdate) {
      updateFn();
      setIsUpdate(false);
    }
  }, [isUpdate]);
  if (update == -1) return null;
  return (
    <div className="absolute w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.1)] backdrop-blur-sm left-0 top-0 flex justify-center items-center transition-all ">
      <div
        className="w-[50%] h-fit rounded-xl bg-app-theme-400 relative flex justify-start items-start p-4 flex-col"
        style={{ boxShadow: "0 5vh 10vmax 5px rgba(0,0,0,1)" }}
      >
        <div className="absolute top-4 right-4">
          <img
            src={CloseIcon}
            alt="Close"
            className="w-[2vmax] h-[2vmax] cursor-pointer"
            onClick={closeHandler}
          />
        </div>
        <div className="text-4xl text-app-theme-100 h-fit w-[80%] break-words flex justify-start items-start flex-col">
          <p className="text-lg">Title</p>
          <input
            type="text"
            name="title"
            value={details.title}
            className="p-2 text-app-theme-400 w-full outline-none rounded-xl bg-app-theme-100"
            onChange={changeHandler}
          />
          <span className="text-sm text-app-theme-100 mb-2">
            Title should be minimum of 2 and maximum of 50 chars
          </span>
        </div>
        <div className="h-[0.2vh] w-[70%] bg-app-theme-100"></div>
        <div className="text-2xl text-app-theme-100 py-4 max-h-[40%] w-full break-words flex flex-col justify-center items-start">
          <p className="text-lg">Description</p>
          <textarea
            name="description"
            value={details.description}
            rows={5}
            minLength={10}
            maxLength={250}
            className="p-2 text-app-theme-400 w-full outline-none rounded-xl resize-none bg-app-theme-100"
            onChange={changeHandler}
          />
          <span className="text-sm text-app-theme-100 mb-2">
            Description should be minimum of 10 and maximum of 250 chars
          </span>
        </div>
        <div className="text-xl text-app-theme-100 py-4 w-full flex flex-col justify-start items-start">
          <p className="text-lg">Type</p>
          <select
            value={details.type}
            name="type"
            onChange={changeHandler}
            className="w-[50%] p-2 text-xl bg-app-theme-100 text-app-theme-400 outline-none border-none rounded-xl"
          >
            <option value="" disabled>
              Select
            </option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div className="text-xl text-app-theme-100 py-4">
          <p className="text-lg">Due date</p>
          <span className="p-2  rounded-xl">
            <input
              type="date"
              name="dueDate"
              className="text-xl p-2 bg-app-theme-100 text-app-theme-400 rounded-xl"
              min={new Date().toISOString().split("T")[0]}
              value={details.dueDate.split("T")[0]}
              onChange={changeHandler}
            />
          </span>
        </div>
        <Button
          title="Update"
          onClickHandler={updateHandler}
          myStyle={{
            backgroundColor: "#EEF5FF",
            color: "#176B87",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default Update;

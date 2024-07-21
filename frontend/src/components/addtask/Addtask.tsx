import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { useRecoilState, useSetRecoilState } from "recoil";
import { taskModel } from "../../zod/Zod";
import { errorAtom } from "../../store/Error";
import axios from "axios";
import { backend_url, local_storage_token_key } from "../../config/creds";
import { tasksAtom } from "../../store/Tasks";
import { loadAtom } from "../../store/Load";
import { toastAtom } from "../../store/Toast";
import { unfilteredTasks } from "../../store/UnfilteredTasks";
import { useDoFilter } from "../home/container/Filter";

function Addtask() {
  type TaskModel = {
    title: string;
    description: string;
    type: string;
    dueDate: Date | null;
  };
  type TaskModel2 = {
    id: Number;
    title: string;
    description: string;
    type: string;
    dueDate: string;
    createdAt: string;
  };
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const [task, setTask] = useState<TaskModel>({
    title: "",
    description: "",
    type: "",
    dueDate: null,
  });
  const setError = useSetRecoilState(errorAtom);
  const setLoader = useSetRecoilState(loadAtom);
  const [taskAtom, setTaskAtom] = useRecoilState(unfilteredTasks);
  const setFilteredTaskAtom = useSetRecoilState(tasksAtom);
  const setToast = useSetRecoilState(toastAtom);
  const doFilterFn = useDoFilter();

  async function handleSubmit() {
    const taskData: TaskModel = {
      title: titleRef.current ? titleRef.current?.value : "",
      description: descRef.current ? descRef.current?.value : "",
      type: typeRef.current ? typeRef.current?.value : "",
      dueDate: dueDateRef.current ? new Date(dueDateRef.current.value) : null,
    };
    const { success, error } = taskModel.safeParse(taskData);
    if (!success) {
      setError(error.errors[0].message);
      return;
    }
    setTask(taskData);
  }
  useEffect(() => {
    try {
      if (task.title != "") {
        const headers = {
          "Content-type": "application/json",
          auth: localStorage.getItem(local_storage_token_key),
        };
        //Just adding some deplay to avoid repated requests withing 1sec
        let timer = setTimeout(async () => {
          setLoader(true);
          const response = await axios.post(
            backend_url + "task/addTask",

            {
              task,
            },
            { headers }
          );
          let dues: string = "";
          if (task.dueDate != null) {
            dues = new Date(task.dueDate).toISOString();
          }
          const newTask: TaskModel2 = {
            ...task,
            id: response.data.message.id,
            dueDate: dues,
            createdAt: new Date().toISOString(),
          };
          const newTaskArr: any = [];
          newTaskArr.push(...taskAtom);
          newTaskArr.push(newTask);
          setTaskAtom(newTaskArr);

          const filteredArr = doFilterFn();
          setFilteredTaskAtom(filteredArr);
          if (
            titleRef.current &&
            descRef.current &&
            typeRef.current &&
            dueDateRef.current
          ) {
            titleRef.current.value = "";
            descRef.current.value = "";
            typeRef.current.value = "";
            dueDateRef.current.value = "";
          }
          setToast("Task added!");
          setLoader(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch (e: any) {
      if (e.response && e.response.status < 500) {
        setError(e.response.data.message);
      } else {
        setError(e.message);
      }
    }
  }, [task]);
  return (
    <div className="col-span-4 h-[100vh] flex justify-center items-center flex-col bg-app-theme-100">
      <div className="w-[70%] h-[80%] text-app-theme-400 flex flex-col justify-evenly items-start">
        <div className="flex flex-col justify-start items-start w-full p-2">
          <Input fieldName="Title" max={100} ref={titleRef} />
          <span className="text-sm text-gray-500">
            Title should be minimum of 2 and maximum of 50 chars
          </span>
        </div>

        <div className="w-[90%] h-fit p-2 flex flex-col justify-evenly items-start">
          <label className="text-xl">Description</label>
          <textarea
            rows={5}
            maxLength={250}
            defaultValue=""
            className="p-2 outline-none text-xl w-full resize-none"
            ref={descRef}
            placeholder={"Enter Description"}
          ></textarea>
          <span className="text-sm text-gray-500">
            Description should be minimum of 10 and maximum of 250 chars
          </span>
        </div>
        <div className="w-[90%] h-fit p-2 flex flex-col justify-evenly items-start">
          <label className="text-xl">Type</label>
          <select className="w-[60%] p-2 text-xl" ref={typeRef}>
            <option value="" disabled>
              Select
            </option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
          </select>
        </div>
        <div className="w-[90%] h-fit p-2 flex flex-col justify-evenly items-start">
          <label className="text-xl">Due date</label>
          <input
            type="date"
            className="text-xl p-2"
            min={new Date().toISOString().split("T")[0]}
            ref={dueDateRef}
          />
        </div>
        <Button title="Add task" onClickHandler={handleSubmit} />
      </div>
    </div>
  );
}

export default Addtask;

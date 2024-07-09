import EditIcon from "../../../assets/edit.png";
import DeleteIcon from "../../../assets/delete.png";
import ResizeIcon from "../../../assets/resize.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url, local_storage_token_key } from "../../../config/creds";
import { useSetRecoilState } from "recoil";
import { loadAtom } from "../../../store/Load";
import { tasksAtom } from "../../../store/Tasks";
import { SimpleTaskModal } from "../../../zod/Zod";
import { errorAtom } from "../../../store/Error";
import { toastAtom } from "../../../store/Toast";
import { detailsAtom } from "../../../store/Details";
import { updateAtom } from "../../../store/Update";
function Card({
  type,
  title,
  description,
  dueDate,
  id,
  createdAt,
}: {
  type: string;
  title: string;
  description: string;
  dueDate: string;
  id: Number;
  createdAt: string;
}) {
  let typeColor;
  const [deleteClicked, setDeleteClicked] = useState(false);
  const setLoading = useSetRecoilState(loadAtom);
  const setTasks = useSetRecoilState(tasksAtom);
  const setError = useSetRecoilState(errorAtom);
  const setToast = useSetRecoilState(toastAtom);
  const setDetails = useSetRecoilState(detailsAtom);
  const setUpdate = useSetRecoilState(updateAtom);

  useEffect(() => {
    async function deleteCall() {
      const headers = {
        "Content-type": "application/json",
        auth: localStorage.getItem(local_storage_token_key),
      };
      setLoading(true);
      try {
        await axios.post(
          backend_url + "task/deleteTask",
          {
            task: {
              id: id,
            },
          },
          {
            headers,
          }
        );
        setToast("Task deleted!");
        setTasks((tasks) =>
          tasks.filter((task: SimpleTaskModal) => task.id != id)
        );
      } catch (e: any) {
        if (e.response) setError(e.response.data.message);
        else
          setError(
            "Unable to complete the action at this time, please try again later"
          );
      } finally {
        setLoading(false);
      }
    }
    if (deleteClicked) {
      deleteCall();
      setDeleteClicked(false);
    }
  }, [deleteClicked]);

  if (type == "TODO") typeColor = "bg-type-todo";
  else if (type == "IN_PROGRESS") typeColor = "bg-type-progress";
  else typeColor = "bg-type-done";

  function handleDelete() {
    setDeleteClicked(true);
  }
  function openDetailsHandler() {
    setDetails({
      title: title,
      description: description,
      type: type,
      createdAt: createdAt,
      dueDate: dueDate,
    });
  }
  function editHandler() {
    setUpdate(true);
  }

  return (
    <div
      className="w-[25vmax] h-fit bg-app-theme-400 rounded-xl flex flex-col justify-evely items-center text-white m-2 p-2 cursor-pointer overflow-hidden"
      style={{ boxShadow: "0 0 7px 2px rgba(0,0,0,0.5)" }}
    >
      <div className="w-full p-1 text-lg flex justify-between items-center ">
        <div className="w-fit text-lg flex justify-start items-center ">
          <div
            className={"w-[0.7vmax] h-[0.7vmax] rounded-full mr-2 " + typeColor}
          ></div>
          {type}
        </div>
        <div className="flex items-center">
          <img
            src={ResizeIcon}
            className="w-[2vmax] h-[2vmax]  hover:scale-110  transition-all"
            title="Enlarge"
            onClick={openDetailsHandler}
          />
          <img
            src={EditIcon}
            className="w-[2vmax] h-[2vmax]  ml-2 hover:scale-110 transition-all"
            title="Edit"
            onClick={editHandler}
          />
          <img
            src={DeleteIcon}
            className="w-[2vmax] h-[2vmax] ml-2  hover:scale-110  transition-all"
            title="Delete"
            onClick={handleDelete}
          />
        </div>
      </div>
      <div className="w-full p-1 text-2xl">
        {title.length > 20 ? title.slice(0, 20) + "..." : title}
      </div>
      <div className="w-full p-1 text-xl ">
        {description.length > 25
          ? description.slice(0, 25) + "..."
          : description}
      </div>
      <div className="w-full p-1 text-sm">Due by:{" " + dueDate}</div>
    </div>
  );
}

export default Card;

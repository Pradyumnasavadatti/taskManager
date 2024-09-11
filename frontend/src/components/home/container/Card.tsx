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
import { unfilteredTasks } from "../../../store/UnfilteredTasks";
import { useToast } from "@/components/ui/use-toast";
function Card({
  type,
  title,
  description,
  dueDate,
  id,
  createdAt,
  index,
}: {
  type: string;
  title: string;
  description: string;
  dueDate: string;
  id: Number;
  createdAt: string;
  index: number;
}) {
  let typeColor;
  const [deleteClicked, setDeleteClicked] = useState(false);
  const setLoading = useSetRecoilState(loadAtom);
  const setTasks = useSetRecoilState(tasksAtom);
  const setUnfilteredTask = useSetRecoilState(unfilteredTasks);
  const setError = useSetRecoilState(errorAtom);
  const setToast = useSetRecoilState(toastAtom);
  const setDetails = useSetRecoilState(detailsAtom);
  const setUpdate = useSetRecoilState(updateAtom);
  const { toast } = useToast();

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
        toast({
          description: "Task successfully deleted!",
          className: "bg-app-theme-400 text-app-theme-100 border-app-theme-100",
        });
        setTasks((tasks) =>
          tasks.filter((task: SimpleTaskModal) => task.id != id)
        );
        setUnfilteredTask((tasks) =>
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
    setUpdate(index);
  }

  return (
    <div
      className="w-[28vw] md:w-[25vmax] h-fit bg-app-theme-400 rounded-xl flex flex-col justify-evely items-center text-white m-2 p-2 cursor-pointer overflow-hidden"
      style={{ boxShadow: "0 0 7px 2px rgba(0,0,0,0.5)" }}
    >
      <div className="w-full p-1 text-lg flex justify-between items-center">
        <div className="w-fit flex justify-start items-center text-xs md:text-lg">
          <div
            className={
              "w-[0.5vmax] h-[0.5vmax] md:w-[0.7vmax] md:h-[0.7vmax] rounded-full mr-1 md:mr-2 " +
              typeColor
            }
          ></div>
          {type}
        </div>
        <div className="md:flex hidden md:flex-row justify-center items-center p-2">
          <img
            src={ResizeIcon}
            className="w-[2vmax] h-[2vmax] md:hover:scale-110  transition-all"
            title="Enlarge"
            onClick={openDetailsHandler}
          />
          {type != "DONE" && (
            <img
              src={EditIcon}
              className="w-[2vmax] h-[2vmax] ml-2 md:hover:scale-110 transition-all"
              title="Edit"
              onClick={editHandler}
            />
          )}
          <img
            src={DeleteIcon}
            className="w-[2vmax] h-[2vmax] ml-2 md:hover:scale-110  transition-all"
            title="Delete"
            onClick={handleDelete}
          />
        </div>
      </div>
      <div className="w-full p-1 text-2xl hidden md:block">
        {title.length > 20 ? title.slice(0, 20) + "..." : title}
      </div>
      <div className="w-full p-1 text-lg block md:hidden">
        {title.length > 7 ? title.slice(0, 7) + "..." : title}
      </div>
      <div className="w-full p-1 text-xl hidden md:block">
        {description.length > 25
          ? description.slice(0, 25) + "..."
          : description}
      </div>
      {type == "DONE" && (
        <div className="w-full p-1 text-sm line-through">
          Due by:{" " + dueDate}
        </div>
      )}
      {type != "DONE" && (
        <div className="w-full p-1 text-sm">Due by:{" " + dueDate}</div>
      )}
      <div className="md:hidden flex justify-center items-center p-2">
        <img
          src={ResizeIcon}
          className="w-[3vmax] h-[3vmax] md:hover:scale-110  transition-all"
          title="Enlarge"
          onClick={openDetailsHandler}
        />
        {type != "DONE" && (
          <img
            src={EditIcon}
            className="w-[3vmax] h-[3vmax] ml-2 md:hover:scale-110 transition-all"
            title="Edit"
            onClick={editHandler}
          />
        )}
        <img
          src={DeleteIcon}
          className="w-[3vmax] h-[3vmax] ml-2 md:hover:scale-110  transition-all"
          title="Delete"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}

export default Card;

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import { unfilteredTasks } from "../../store/UnfilteredTasks";
import { SimpleTaskModal } from "../../zod/Zod";
import Card from "../home/container/Card";
import { useEffect, useState } from "react";
import { errorAtom } from "../../store/Error";
import { loadAtom } from "../../store/Load";
import axios from "axios";
import { backend_url, local_storage_token_key } from "../../config/creds";
import { useDoFilter } from "../home/container/Filter";
import { tasksAtom } from "../../store/Tasks";
import { toastAtom } from "../../store/Toast";
import NoTasks from "../../assets/NoTasksCat.png";
import { useToast } from "../ui/use-toast";

function Kanban() {
  const [unfilteredTask, setUnfilteredTask] = useRecoilState(unfilteredTasks);
  const setFilterTasks = useSetRecoilState(tasksAtom);
  const setError = useSetRecoilState(errorAtom);
  const setLoader = useSetRecoilState(loadAtom);
  const [todo, setTodo] = useState<SimpleTaskModal[]>([]);
  const [inProgress, setInProgress] = useState<SimpleTaskModal[]>([]);
  const [done, setDone] = useState<SimpleTaskModal[]>([]);
  const doFilter = useDoFilter();
  const setToast = useSetRecoilState(toastAtom);
  const [isEmptyTask, setIsEmptyTask] = useState(false);
  const { toast } = useToast();
  const dragHandler: OnDragEndResponder = async (res: DropResult) => {
    console.log(res);
    if (res.destination?.droppableId == res.source.droppableId) return;
    try {
      setLoader(true);
      //get the full task
      const taskId = Number(res.draggableId.split(" ")[1]);
      let task: SimpleTaskModal;
      if (res.source.droppableId == "TODO") {
        task = todo.filter((t) => t.id == taskId)[0];
      } else if (res.source.droppableId == "IN_PROGRESS") {
        task = inProgress.filter((t) => t.id == taskId)[0];
      } else {
        task = done.filter((t) => t.id == taskId)[0];
      }
      if (task.type && res.destination)
        task = { ...task, type: res.destination.droppableId };
      //Call Backend API
      const headers = {
        "Content-type": "application/json",
        auth: localStorage.getItem(local_storage_token_key),
      };
      await axios.post(
        backend_url + "task/updateTask",
        {
          task: {
            ...task,
          },
        },
        { headers }
      );

      //Change unfiltered atom
      let unfilterArr: any = unfilteredTask;
      unfilterArr = unfilterArr.filter(
        (todo: SimpleTaskModal) => todo.id != task.id
      );
      unfilterArr.push(task);
      setUnfilteredTask(unfilterArr);

      //Call filter function and change taskatom
      const filterArr = doFilter();
      setFilterTasks(filterArr);

      //Change the local arrays
      if (
        res.source.droppableId == "TODO" &&
        res.destination?.droppableId == "IN_PROGRESS"
      ) {
        setTodo((todo) => todo.filter((t) => t.id != task.id));
        let progressArr = inProgress;
        progressArr.push(task);
        setInProgress(progressArr);
      }
      if (
        res.source.droppableId == "TODO" &&
        res.destination?.droppableId == "DONE"
      ) {
        setTodo((todo) => todo.filter((t) => t.id != task.id));
        let doneArr = done;
        doneArr.push(task);
        setDone(doneArr);
      }
      if (
        res.source.droppableId == "IN_PROGRESS" &&
        res.destination?.droppableId == "TODO"
      ) {
        setInProgress((todo) => todo.filter((t) => t.id != task.id));
        let todoArr = todo;
        todoArr.push(task);
        setTodo(todoArr);
      }
      if (
        res.source.droppableId == "IN_PROGRESS" &&
        res.destination?.droppableId == "DONE"
      ) {
        setInProgress((todo) => todo.filter((t) => t.id != task.id));
        let doneArr = done;
        doneArr.push(task);
        setDone(doneArr);
      }
      if (
        res.source.droppableId == "DONE" &&
        res.destination?.droppableId == "IN_PROGRESS"
      ) {
        setDone((todo) => todo.filter((t) => t.id != task.id));
        let progressArr = inProgress;
        progressArr.push(task);
        setInProgress(progressArr);
      }
      if (
        res.source.droppableId == "DONE" &&
        res.destination?.droppableId == "TODO"
      ) {
        setDone((todo) => todo.filter((t) => t.id != task.id));
        let todoArr = todo;
        todoArr.push(task);
        setTodo(todoArr);
      }

      //Show success message
      toast({
        description: `Moved to ${res.destination?.droppableId}`,
        className: "bg-app-theme-400 text-app-theme-100 border-app-theme-200",
      });
    } catch (e: any) {
      //show failure message
      if (e.response && e.response.status < 500) {
        setError(e.response.data.message);
      } else {
        setError(e.message);
      }
    } finally {
      setLoader(false);
    }
  };
  const columns = [
    {
      title: "Todo",
      field: "TODO",
      tasks: todo,
    },
    {
      title: "In Progress",
      field: "IN_PROGRESS",
      tasks: inProgress,
    },
    {
      title: "Done",
      field: "DONE",
      tasks: done,
    },
  ];

  useEffect(() => {
    if (unfilteredTask.length != 0) {
      let todoArr: SimpleTaskModal[] = [];
      let progressArr: SimpleTaskModal[] = [];
      let doneArr: SimpleTaskModal[] = [];
      unfilteredTask.map((task: SimpleTaskModal) => {
        if (task.type == "TODO") {
          todoArr.push(task);
        } else if (task.type == "IN_PROGRESS") {
          progressArr.push(task);
        } else if (task.type == "DONE") {
          doneArr.push(task);
        }
      });
      setTodo(todoArr);
      setInProgress(progressArr);
      setDone(doneArr);
      setIsEmptyTask(false);
    } else {
      setIsEmptyTask(true);
    }
  }, [unfilteredTask]);

  return (
    <div className="flex flex-col justify-start items-start p-2 col-span-4 overflow-y-visible">
      <h1 className="text-2xl md:text-4xl text-app-theme-400">Kanban Board</h1>
      <div className="w-[80%] h-[0.3vh]  bg-gradient-to-r from-app-theme-400 to-app-theme-100 mt-1"></div>
      <div className="w-full h-[95%]">
        {!isEmptyTask && (
          <div className="w-full h-full grid gap-2 grid-cols-3">
            <DragDropContext onDragEnd={dragHandler}>
              {columns.map((column) => {
                return (
                  <Droppable droppableId={column.field} key={column.title}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`h-full w-full py-2 rounded-xl transition-all ${
                          snapshot.isDraggingOver ? "bg-[rgba(0,0,0,0.05)]" : ""
                        }`}
                      >
                        <div className="w-full p-4 rounded-xl text-app-theme-400 text-lg md:text-xl text-center">
                          {column.title}
                        </div>
                        {column.tasks.map((task: SimpleTaskModal, index) => {
                          if (task.type != column.field) return null;
                          return (
                            <Draggable
                              draggableId={
                                column.field + " " + task.id + " " + index
                              }
                              index={index}
                              key={task.title + " " + index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="w-full h-fit"
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                >
                                  <Card
                                    key={task.id.toString() + task.title}
                                    type={task.type}
                                    title={task.title}
                                    description={task.description}
                                    id={task.id}
                                    dueDate={
                                      new Date(task.dueDate)
                                        .toLocaleString()
                                        .split(",")[0]
                                    }
                                    createdAt={
                                      new Date(task.createdAt)
                                        .toLocaleString()
                                        .split(",")[0]
                                    }
                                    index={index}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </DragDropContext>
          </div>
        )}
        {isEmptyTask && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <img src={NoTasks} className="w-[15vmax] h-[15vmax]" />
            <h2 className="text-3xl text-gray-600">No tasks to display..!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kanban;

import Filter from "./Filter";
import Card from "./Card";
import { useRecoilValue } from "recoil";
import { tasksAtom } from "../../../store/Tasks";
import { SimpleTaskModal } from "../../../zod/Zod";
import NoTodo from "../../../assets/noTodo.png";
function Container() {
  const tasks: SimpleTaskModal[] = useRecoilValue(tasksAtom);
  return (
    <div className="flex flex-col justify-evenly items-start overflow-hidden col-span-4 h-full p-2">
      <h1 className="text-4xl text-app-theme-400">Task List</h1>
      <div className="w-full h-[0.3vh] bg-app-theme-400"></div>
      <Filter />
      <div className="w-full h-[75%] overflow-hidden">
        <div className="w-full h-full overflow-scroll ">
          {tasks.length != 0 && (
            <div
              key="tasksContainer"
              className="w-full min-h-fit flex flex-wrap justify-start items-center"
            >
              {tasks.map((task, index) => {
                return (
                  <>
                    <Card
                      key={task.id.toString() + task.title}
                      type={task.type}
                      title={task.title}
                      description={task.description}
                      id={task.id}
                      dueDate={
                        new Date(task.dueDate).toLocaleString().split(",")[0]
                      }
                      createdAt={
                        new Date(task.createdAt).toLocaleString().split(",")[0]
                      }
                      index={index}
                    />
                  </>
                );
              })}
            </div>
          )}
          {tasks.length == 0 && (
            <div
              key="noTasksContainer"
              className="w-full h-full flex flex-col justify-start items-center"
            >
              <img
                src={NoTodo}
                alt="Loading..."
                className="w-[25vmax] h-[25vmax]"
              />
              <h1 className="text-gray-500 text-2xl">No tasks added yet!</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Container;

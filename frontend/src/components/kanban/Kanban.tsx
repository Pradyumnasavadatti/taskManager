import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { unfilteredTasks } from "../../store/UnfilteredTasks";
import { SimpleTaskModal } from "../../zod/Zod";
import Card from "../home/container/Card";
import { tasksAtom } from "../../store/Tasks";
import Filter from "../home/container/Filter";

function Kanban() {
  const unfilteredTask = useRecoilValue(tasksAtom);
  const dragHandler: OnDragEndResponder = (res: DropResult) => {
    console.log(res);
  };
  const columns = [
    {
      title: "Todo",
      field: "TODO",
      tasks: [],
    },
    { title: "In Progress", field: "IN_PROGRESS", tasks: [] },
    { title: "Done", field: "DONE", tasks: [] },
  ];

  return (
    <div className="flex flex-col justify-start items-start p-2 col-span-4">
      <h1 className="text-4xl text-app-theme-400">Kanban Board</h1>
      <Filter />
      <div className="w-full h-[95%]">
        <div className="w-full h-full grid gap-2 grid-cols-3">
          <DragDropContext onDragEnd={dragHandler}>
            {columns.map((column) => {
              return (
                <Droppable droppableId={column.field}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="h-full w-full py-2 rounded-xl"
                    >
                      <div className="w-full p-4 rounded-xl text-app-theme-400 text-xl text-center">
                        {column.title}
                      </div>
                      {unfilteredTask.map((task: SimpleTaskModal, index) => {
                        if (task.type != column.field) return null;
                        return (
                          <Draggable
                            draggableId={
                              column.field + " " + task.id + " " + index
                            }
                            index={index}
                          >
                            {(provided) => (
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
      </div>
    </div>
  );
}

export default Kanban;

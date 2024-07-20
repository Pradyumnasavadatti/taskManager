import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { byDate, byType, searchKey } from "../../../store/Filters";
import { unfilteredTasks } from "../../../store/UnfilteredTasks";
import { tasksAtom } from "../../../store/Tasks";

function Filter() {
  const byDateFilter = useRef<HTMLSelectElement>(null);
  const byTypeFilter = useRef<HTMLSelectElement>(null);
  const [dateFilter, setDateFilter] = useRecoilState(byDate);
  const [typeFilter, setTypeFilter] = useRecoilState(byType);
  const [search, setSearchKey] = useRecoilState(searchKey);
  const setFilteredTasks = useSetRecoilState(tasksAtom);
  const tasks = useRecoilValue(unfilteredTasks);
  const [searchState, setSearch] = useState(search);
  const doFilterFn = useDoFilter();
  function onChangeByDateHandler() {
    if (byDateFilter.current) setDateFilter(Number(byDateFilter.current.value));
  }
  function onChangeByTypeHandler() {
    if (byTypeFilter.current) setTypeFilter(byTypeFilter.current.value);
  }
  function searchKeyHandle(e: any) {
    setSearch(e.target.value);
  }
  useEffect(() => {
    let timer: any;
    if (tasks.length != 0) {
      timer = setTimeout(() => {
        const filteredArr = doFilterFn();
        setFilteredTasks(filteredArr);
      }, 500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [dateFilter, typeFilter, search]);

  useEffect(() => {
    setSearchKey(searchState);
  }, [searchState]);
  return (
    <div className="w-full p-4 flex justify-start items-center">
      <div className="flex flex-col justify-start items-start mr-10">
        <label className="text-sm text-app-theme-400">Filter by date</label>
        <select
          ref={byDateFilter}
          className="text-app-theme-400 outline-none text-xl p-1 bg-transparent border-b-2 border-app-theme-400"
          onChange={onChangeByDateHandler}
          value={dateFilter}
        >
          <option value="1">Latest First</option>
          <option value="0">Oldest First</option>
          <option value="2">Due date</option>
          <option value="3">Expired due date</option>
          <option value="4">Task expiring today</option>
        </select>
      </div>
      <div className="flex flex-col justify-start items-start mr-10">
        <label className="text-sm text-app-theme-400">Filter by type</label>
        <select
          ref={byTypeFilter}
          onChange={onChangeByTypeHandler}
          className="text-app-theme-400 outline-none text-xl p-1  bg-transparent border-b-2 border-app-theme-400"
          value={typeFilter}
        >
          <option value="ALL">All</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <div className="w-[40%] h-full">
        <input
          type="text"
          className="text-app-theme-400 text-xl h-full w-full outline-none border-b-app-theme-400 border-b-2 bg-app-theme-100"
          placeholder="Enter search key"
          value={searchState}
          onChange={searchKeyHandle}
        />
      </div>
    </div>
  );
}

export default Filter;

export const useDoFilter = () => {
  const byDateFilter = useRecoilValue(byDate);
  const byTypeFilter = useRecoilValue(byType);
  const searchKeyAtom = useRecoilValue(searchKey);
  let tasks = useRecoilValue(unfilteredTasks);
  return () => {
    let date = new Date();
    let today = [date.getDate(), date.getMonth(), date.getFullYear()];
    if (searchKeyAtom != "") {
      tasks = tasks.filter((task: { title: string; description: string }) => {
        let matchArr1: RegExpMatchArray | null =
          task.title.match(searchKeyAtom);
        let matchArr2: RegExpMatchArray | null =
          task.description.match(searchKeyAtom);
        if (matchArr1 == null && matchArr2 == null) return false;
        return true;
      });
    }
    if (byDateFilter == 0) {
      tasks = [...tasks].sort(
        (taskA: { createdAt: Date }, taskB: { createdAt: Date }) =>
          new Date(taskA.createdAt).getTime() -
          new Date(taskB.createdAt).getTime()
      );
    } else if (byDateFilter == 1) {
      tasks = [...tasks].sort(
        (taskA: { createdAt: Date }, taskB: { createdAt: Date }) =>
          new Date(taskB.createdAt).getTime() -
          new Date(taskA.createdAt).getTime()
      );
    } else if (byDateFilter == 2) {
      tasks = [...tasks].sort(
        (taskA: { dueDate: Date }, taskB: { dueDate: Date }) =>
          new Date(taskA.dueDate).getTime() - new Date(taskB.dueDate).getTime()
      );
    } else if (byDateFilter == 3) {
      tasks = tasks.filter((task: { dueDate: Date }) => {
        let taskDate = new Date(task.dueDate);
        let taskDateArr = [
          taskDate.getDate(),
          taskDate.getMonth(),
          taskDate.getFullYear(),
        ];
        if (taskDateArr[2] < today[2]) {
          return true;
        } else if (taskDateArr[1] < today[1] && taskDateArr[2] == today[2]) {
          return true;
        } else if (
          taskDateArr[0] < today[0] &&
          taskDateArr[1] == today[1] &&
          taskDateArr[2] == today[2]
        ) {
          return true;
        }
        return false;
      });
    } else if (byDateFilter == 4) {
      tasks = tasks.filter((task: { dueDate: Date }) => {
        let taskDate = new Date(task.dueDate);
        let taskDateArr = [
          taskDate.getDate(),
          taskDate.getMonth(),
          taskDate.getFullYear(),
        ];
        let isToday = 0;
        for (let i = 0; i < today.length; i++) {
          if (today[i] == taskDateArr[i]) {
            isToday++;
          }
        }
        return isToday == today.length;
      });
    }
    if (byTypeFilter != "ALL") {
      tasks = tasks.filter((task: { type: String }) => {
        return task.type == byTypeFilter;
      });
    }
    return tasks;
  };
};

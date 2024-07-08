import { atom } from "recoil";

export const tasksAtom = atom({
  key: "tasks",
  default: [],
});

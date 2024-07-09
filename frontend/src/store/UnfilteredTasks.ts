import { atom } from "recoil";

export const unfilteredTasks = atom({
  key: "unfilteredTasks",
  default: [],
});

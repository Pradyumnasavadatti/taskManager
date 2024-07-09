import { atom } from "recoil";

export const detailsAtom = atom({
  key: "detailsAtom",
  default: {
    title: "",
    description: "",
    type: "",
    createdAt: "",
    dueDate: "",
  },
});

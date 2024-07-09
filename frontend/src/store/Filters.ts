import { atom } from "recoil";

export const byDate = atom({
  key: "byDateFilter",
  default: 1,
});

export const byType = atom({
  key: "byTypeFilter",
  default: "ALL",
});

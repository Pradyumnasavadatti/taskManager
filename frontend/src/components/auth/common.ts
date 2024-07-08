import {
  local_storage_token_key,
  local_storage_token_time,
} from "../../config/creds";

//If token is older than 30 days redirect the user to login/signup page
export function useCheckForToken(path: string) {
  let decidePath = "";
  try {
    const token = localStorage.getItem(local_storage_token_key);
    const time = localStorage.getItem(local_storage_token_time);
    if (token && time) {
      const storedDate = new Date(time).getTime();
      const today = new Date().getTime();
      const numberOfDays = Math.abs(today - storedDate) / (24 * 60 * 60 * 1000);
      if (numberOfDays < 30) {
        decidePath = "/home";
      } else {
        throw new Error("");
      }
    }
  } catch (e) {
    if (path == "/login" || path == "/home") decidePath = "/login";
    else decidePath = "/signup";
  }

  return decidePath;
}

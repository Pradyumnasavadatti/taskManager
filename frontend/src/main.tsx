import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login.tsx";
import { RecoilRoot } from "recoil";
import Error from "./components/modal/Error.tsx";
import Signup from "./components/auth/Signup.tsx";
import Home from "./components/home/Home.tsx";
import Load from "./components/loader/Load.tsx";
import Toast from "./components/modal/Toast.tsx";
import Details from "./components/home/container/details/Details.tsx";
import Update from "./components/home/container/update/Update.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h2>Hello</h2>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addtask" element={<Home />} />
        <Route path="/kanban" element={<Home />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
    <Error />
    <Details />
    <Update />
    <Toast />
    <Load />
  </RecoilRoot>
);

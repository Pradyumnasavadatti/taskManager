import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login.tsx";
import { RecoilRoot } from "recoil";
import Error from "./components/modal/Error.tsx";
import Signup from "./components/auth/Signup.tsx";
import Home from "./components/home/Home.tsx";
import Load from "./components/loader/Load.tsx";
import Addtask from "./components/addtask/Addtask.tsx";
import Toast from "./components/modal/Toast.tsx";

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
    <Toast>No</Toast>
    <Load />
  </RecoilRoot>
);

import { NavLink } from "react-router-dom";
import Logo from "../../../assets/logo2.png";
import NavTab from "./NavTab";
function Nav() {
  return (
    <div className="py-2 w-full h-full bg-app-theme-400 flex flex-col justify-start items-start">
      <div className="w-full h-fit p-10 border-b-2">
        <img src={Logo} alt="Loading..." draggable={false} />
      </div>
      <NavTab to="/home">Home</NavTab>
      <NavTab to="/kanban">Kanban</NavTab>
      <NavTab to="/addTask">Add task</NavTab>
    </div>
  );
}

export default Nav;

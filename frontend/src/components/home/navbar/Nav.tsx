import Logo from "../../../assets/logo4.png";
import NavTab from "./NavTab";
import { TokensIcon } from "@radix-ui/react-icons";
import { TableIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";
function Nav() {
  return (
    <>
      <div className="py-2 w-full h-full hidden  md:flex flex-col justify-start items-start">
        <div className="w-full h-fit flex justify-center items-center p-2">
          <img
            src={Logo}
            alt="Loading..."
            draggable={false}
            className="w-[60%]"
          />
        </div>
        <NavTab to="/home">
          <TokensIcon className="mr-2" />
          Home
        </NavTab>
        <NavTab to="/kanban">
          <TableIcon className="mr-2" />
          Kanban
        </NavTab>
        <NavTab to="/addTask">
          <PlusIcon className="mr-2" />
          Add task
        </NavTab>
      </div>
      <div className="md:hidden flex fixed w-full bottom-0 justify-evenly items-center">
        <div className="fixed w-[25%] h-fit flex justify-center items-center p-1 top-2 right-2">
          <img
            src={Logo}
            alt="Loading..."
            draggable={false}
            className="w-[100%]"
          />
        </div>
        <div className="w-full flex justify-evenly items-center  bg-[rgba(255,255,255,0.4)]">
          <NavTab to="/home">
            <TokensIcon className="mr-[0.2vmax]" />
            <p className="text-sm">Home</p>
          </NavTab>
          <NavTab to="/kanban">
            <TableIcon className="mr-[0.2vmax]" />
            <p className="text-sm">Kanban</p>
          </NavTab>
          <NavTab to="/addTask">
            <PlusIcon className="mr-[0.2vmax]" />
            <p className="text-sm">Add task</p>
          </NavTab>
        </div>
      </div>
    </>
  );
}

export default Nav;

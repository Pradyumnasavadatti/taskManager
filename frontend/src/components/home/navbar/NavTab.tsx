import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

function NavTab({ children, to }: { children: ReactNode; to: string }) {
  return (
    <div className="text-app-theme-100 text-xl w-full py-1">
      <NavLink
        to={to}
        className={(state) => {
          return state.isActive
            ? "w-full flex justify-center items-center text-app-theme-400 activeNav"
            : "w-full flex justify-center items-center bg-transparent text-app-theme-400 nonActiveNav";
        }}
      >
        <div className="w-[80%] px-2 py-1 bg-inherit flex justify-start items-center rounded-lg">
          {children}
        </div>
      </NavLink>
    </div>
  );
}

export default NavTab;

import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

function NavTab({ children, to }: { children: ReactNode; to: string }) {
  return (
    <div className="text-app-theme-100 text-xl w-full">
      <NavLink
        to={to}
        className={(state) => {
          return state.isActive
            ? "bg-app-theme-100 text-app-theme-400"
            : "bg-transparent text-app-theme-100";
        }}
      >
        <div className="w-full p-2 bg-inherit">{children}</div>
      </NavLink>
    </div>
  );
}

export default NavTab;

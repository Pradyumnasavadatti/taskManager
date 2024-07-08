import React, { MouseEventHandler } from "react";

function Button({
  onClickHandler,
  title,
  disabled = false,
}: {
  onClickHandler: MouseEventHandler<HTMLButtonElement>;
  title: String;
  disabled?: boolean;
}) {
  return (
    <button
      className="w-[90%] p-2 py-3 bg-app-theme-400 text-white rounded-lg flex justify-center items-center text-xl cursor-pointer disabled:bg-app-theme-100 transition-all"
      onClick={onClickHandler}
      disabled={disabled}
    >
      {title}
    </button>
  );
}

export default Button;

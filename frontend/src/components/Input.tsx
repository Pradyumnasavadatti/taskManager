import React, { HTMLInputTypeAttribute, LegacyRef, forwardRef } from "react";

function Input(
  {
    fieldName,
    max = 30,
    type = "text",
  }: {
    fieldName: String;
    max?: number;
    type?: HTMLInputTypeAttribute | undefined;
  },
  ref: LegacyRef<HTMLInputElement>
) {
  return (
    <div className="w-[90%] h-fit flex flex-col justify-evenly items-start">
      <label className="text-xl">{fieldName}</label>
      <input
        type={type}
        defaultValue=""
        className="p-2 outline-none text-xl w-full"
        ref={ref}
        placeholder={"Enter " + fieldName}
        maxLength={max}
      ></input>
    </div>
  );
}

export default forwardRef(Input);

import React, { LegacyRef, forwardRef } from "react";

function Input(
  { fieldName, max = 30 }: { fieldName: String; max?: number },
  ref: LegacyRef<HTMLInputElement>
) {
  return (
    <div className="w-[90%] h-fit flex flex-col justify-evenly items-start">
      <label className="text-xl">{fieldName}</label>
      <input
        type="text"
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

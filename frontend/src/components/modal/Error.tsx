import { useRecoilState, useRecoilValue } from "recoil";
import { errorAtom } from "../../store/Error";
import ErrorIcon from "../../assets/warning.png";
import CloseIcon from "../../assets/close.png";

function Error() {
  const [error, setError] = useRecoilState(errorAtom);
  if (error == "") return null;
  return (
    <div className="absolute w-full h-full z-50 top-0 left-0 flex justify-center items-center backdrop-blur-lg">
      <div className="relative w-[40vw] h-[30vh] rounded-2xl flex justify-center items-center flex-col">
        <div className="w-full h-[20%] bg-app-theme-200 p-2 flex justify-between items-center z-10 rounded-t-2xl">
          <div className="flex w-fit justify-between">
            <img src={ErrorIcon} className="w-[2vmax] h-[2vmax]" />
            <span className="text-xl ml-2">Error</span>
          </div>
          <span
            onClick={() => {
              setError("");
            }}
            className="cursor-pointer"
          >
            <img
              src={CloseIcon}
              className="w-[2vmax] h-[2vmax] cursor-pointer"
            />
          </span>
        </div>
        <div className="w-full h-[80%] p-4 flex justify-center items-center text-2xl bg-app-theme-100 z-10 rounded-b-2xl">
          {error}
        </div>
        <div
          className="w-[50%] h-full absolute bg-transparent left-0 z-0 rounded-2xl"
          style={{ boxShadow: "0 5vh 10vmax 5px hotpink" }}
        ></div>
        <div
          className="w-[50%] h-full absolute  bg-transparent right-0 shadow-white z-0  rounded-2xl"
          style={{ boxShadow: "0 5vh 10vmax 5px purple" }}
        ></div>
      </div>
    </div>
  );
}

export default Error;

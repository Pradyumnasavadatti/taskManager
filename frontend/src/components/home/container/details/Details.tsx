import { useRecoilState } from "recoil";
import CloseIcon from "../../../../assets/close.png";
import { detailsAtom } from "../../../../store/Details";
function Details() {
  const [details, setDetails] = useRecoilState(detailsAtom);
  const closeHandler = () => {
    let obj = { ...details, title: "" };
    setDetails(obj);
  };
  if (details.title == "") return null;
  return (
    <div className="fixed w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.1)] backdrop-blur-sm left-0 top-0 flex justify-center items-center transition-all ">
      <div
        className="w-[90vw] h-[75vh] md:w-[50%] md:h-[65%] rounded-xl bg-app-theme-400 relative flex justify-start items-start p-4 flex-col"
        style={{ boxShadow: "0 5vh 10vmax 5px rgba(0,0,0,1)" }}
      >
        <div className="absolute top-4 right-4">
          <img
            src={CloseIcon}
            alt="Close"
            className="w-[2vmax] h-[2vmax] cursor-pointer"
            onClick={closeHandler}
          />
        </div>
        <h1 className="text-2xl md:text-4xl text-app-theme-100 py-2 h-fit w-[80%] break-words">
          {details.title}
        </h1>
        <div className="h-[0.2vh] w-[70%] bg-app-theme-100"></div>
        <div className="text-lg md:text-2xl text-app-theme-100 py-4 max-h-[40%] w-full break-words">
          {details.description}
        </div>
        <div className="text-sm md:text-xl text-app-theme-100 py-4">
          Type{" "}
          <span className="p-2 bg-[rgba(255,255,255,0.2)] rounded-xl">
            {details.type}
          </span>
        </div>
        <div className="text-sm md:text-xl text-app-theme-100 py-4">
          Created At{" "}
          <span className="p-2 bg-[rgba(255,255,255,0.2)] rounded-xl">
            {details.createdAt}
          </span>
        </div>
        <div className="text-sm md:text-xl text-app-theme-100 py-4">
          Due date{" "}
          <span className="p-2 bg-[rgba(255,255,255,0.2)] rounded-xl">
            {details.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Details;

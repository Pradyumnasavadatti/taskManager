import { useRecoilState, useRecoilValue } from "recoil";
import { loadAtom } from "../../store/Load";

function Load() {
  const loadShow = useRecoilValue(loadAtom);
  if (!loadShow) return null;
  return (
    <div className="w-[100vw] h-[100vh] absolute flex justify-center items-center top-0 left-0 z-10 backdrop-blur-[2px] bg-[rgba(0,0,0,0.2)]">
      <div className="w-[15vw] p-1 bg-app-theme-400 shadow-lg flex justify-evenly items-center relative overflow-hidden rounded-full">
        <div className="w-[1vmax] h-[1vmax] rounded-full bg-white loaderPoint"></div>
      </div>
    </div>
  );
}

export default Load;

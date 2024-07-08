import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { toastAtom } from "../../store/Toast";

function Toast() {
  const toastRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useRecoilState(toastAtom);
  useEffect(() => {
    if (toast != "") {
      if (toastRef.current) {
        toastRef.current.style.animation = "toastAnimation 3s linear forwards";
        setTimeout(() => {
          if (toastRef.current) toastRef.current.style.animation = "";
          setToast("");
        }, 3500);
      }
    }
  }, [toast]);
  if (!toast) return null;
  return (
    <div
      className="absolute z-30 top-5 -right-[100%] w-[20vw] p-4 bg-app-theme-400 text-xl text-white rounded-lg transition-all border-4 border-app-theme-300"
      ref={toastRef}
    >
      {toast}
    </div>
  );
}

export default Toast;

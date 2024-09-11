import { useRecoilState, useRecoilValue } from "recoil";
import { errorAtom } from "../../store/Error";
import ErrorIcon from "../../assets/warning.png";
import CloseIcon from "../../assets/close.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect } from "react";

function Error() {
  const [error, setError] = useRecoilState(errorAtom);
  return (
    <AlertDialog
      open={error.length != 0}
      onOpenChange={() => {
        setError("");
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>{error}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Back</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Error;

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
import { Button } from "@/components/ui/button";

interface AlertDialogDemoProps {
  btn: React.ReactNode;
  title1: string | null;
  title2: string | null;
  onSave?: () => void;
}

const AlertDialogDemo: React.FC<AlertDialogDemoProps> = ({
  btn,
  title1,
  title2,
  onSave,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {btn}
        {/* <Button variant="outline">Show Dialog</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title1}</AlertDialogTitle>
          <AlertDialogDescription>{title2}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Thoát</AlertDialogCancel>
          <AlertDialogAction onClick={onSave}>Đồng ý</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AlertDialogDemo;

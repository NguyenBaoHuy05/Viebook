import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CiViewList } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import iUser from "@/interface/userType";

interface EditDialogProps {
  open: boolean;
  data: iUser;
  onSave: (formData: iUser) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, data, onSave }) => {
  const [userForm, setUserForm] = useState(data);

  useEffect(() => {
    setUserForm(data); // cập nhật form nếu props data thay đổi
  }, [data]);

  const handleSubmit = () => {
    onSave(userForm);
  };

  if (!open) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="absolute right-1/50 -top-4 border-2 border-dashed 
                 bg-white rounded-full p-2 shadow-md
                 hover:cursor-pointer hover:rotate-12 hover:border-solid hover:border-blue-300"
        >
          <CiViewList size={20} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={userForm.name ?? ""}
              className="col-span-3"
              onChange={(e) => {
                setUserForm({ ...userForm, name: e.target.value });
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={userForm.username}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={userForm.location ?? ""}
              className="col-span-3"
              onChange={(e) => {
                setUserForm({ ...userForm, location: e.target.value });
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <textarea
              id="bio"
              value={userForm.bio ?? ""}
              className="col-span-3"
              maxLength={255}
              rows={4}
              cols={50}
              onChange={(e) => {
                setUserForm({ ...userForm, bio: e.target.value });
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EditDialog;

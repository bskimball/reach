import UserList from "@components/UserList.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/ui/dialog.tsx";
import { Plus } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import { cn } from "@lib/utils.ts";
import UserForm from "@components/UserForm.tsx";
import { useState } from "react";

function ViewAdminUsers() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div id="view-settings-users">
      <h1 className="text-3xl leading-loose">Users</h1>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button className={cn("space-x-2")} asChild>
            <DialogTrigger>
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </DialogTrigger>
          </Button>
          <DialogContent>
            <UserForm onSubmit={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <UserList />
      </div>
    </div>
  );
}

export default ViewAdminUsers;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn, socketClient } from "@lib/utils.ts";
import { User } from "backend";
import DataTable from "@components/ui/data-table.tsx";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@components/ui/dialog.tsx";
import { Button } from "@components/ui/button.tsx";
import { Pencil, Trash } from "lucide-react";
import UserForm from "@components/UserForm.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover.tsx";

function DeleteCell({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={user.email === "brian.kimball@bdkinc.com"}
        asChild
      >
        <PopoverTrigger>
          <Trash className="h-4 w-4" />
        </PopoverTrigger>
      </Button>
      <PopoverContent>
        <div>
          <div>
            <p>Delete user {user.email}?</p>
          </div>
          <div className={"w-full flex justify-center space-x-2"}>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={async () => {
                await socketClient.service("users").remove(user.id);
                setOpen(false);
              }}
              disabled={user.email === "brian.kimball@bdkinc.com"}
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EditCell({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className={cn("space-x-2")} asChild>
        <DialogTrigger>
          <Pencil className="w-4 h-4" />
          <span>Edit</span>
        </DialogTrigger>
      </Button>
      <DialogContent>
        <UserForm user={user} onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function UserList() {
  const queryClient = useQueryClient();
  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const { data } = await socketClient.service("users").find();

      return data.filter((user) => user.email !== "brian.kimball@bdkinc.com");
    },
  });

  useEffect(() => {
    socketClient.service("users").on("created", (user: User): void => {
      queryClient.setQueryData<User[]>(["users"], (old) => {
        if (old) {
          return !old.find((u: User) => u.id === user.id)
            ? [...old, user]
            : old;
        } else {
          return [user];
        }
      });
    });
    socketClient.service("users").on("patched", (user: User) => {
      queryClient.setQueryData<User[]>(
        ["users"],
        (old) => old && old.map((u: User) => (u.id === user.id ? user : u))
      );
    });
    socketClient.service("users").on("removed", (user: User) => {
      queryClient.setQueryData<User[]>(
        ["users"],
        (old) => old && old.filter((u: User) => u.id !== user.id)
      );
    });
  }, [queryClient]);

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={[
        { header: "Email", accessorKey: "email" },
        {
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex space-x-4">
              <DeleteCell user={row.original} />
              <EditCell user={row.original} />
            </div>
          ),
        },
      ]}
      data={data}
    />
  );
}

export default UserList;

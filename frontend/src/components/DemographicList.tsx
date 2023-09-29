import DataTable from "@components/ui/data-table.tsx";
import { useEffect, useState } from "react";
import type { Demographic } from "backend";
import { cn, socketClient } from "@lib/utils.ts";
import { format, parseISO } from "date-fns";
import { Button } from "@components/ui/button.tsx";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/ui/dialog.tsx";
import DemographicForm from "@components/DemographicForm.tsx";

function TrashButton({ original }: { original: Demographic }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Button size="icon" variant="destructive" asChild>
        <PopoverTrigger>
          <Trash className="w-4 h-4" />
        </PopoverTrigger>
      </Button>
      <PopoverContent>
        <div className="mb-2">
          <p>Are you sure you want to delete this demographic?</p>
        </div>
        <div className="flex space-x-2 justify-end">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              socketClient.service("demographic").remove(original.id);
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EditButton({ original }: { original: Demographic }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="icon" asChild>
        <DialogTrigger>
          <Pencil className="w-4 h-4" />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DemographicForm
          customerId={original.customerId}
          demographic={original}
          onSubmit={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ActionCell({ original }: { original: Demographic }) {
  return (
    <div className="flex space-x-4">
      <TrashButton original={original} />
      <EditButton original={original} />
    </div>
  );
}

function TypeCell({ demographicTypeId }: { demographicTypeId: number }) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["demographic-type", demographicTypeId],
    queryFn: async () => {
      return await socketClient
        .service("demographic-type")
        .get(demographicTypeId);
    },
  });

  if (isError) return <div>Error: {JSON.stringify(error, null, 4)}</div>;
  if (isLoading) return <div>Loading...</div>;

  return <span>{data.text || null}</span>;
}

function DemographicList({ customerId }: { customerId: number }) {
  const queryClient = useQueryClient();
  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["demographics", customerId],
    queryFn: async () => {
      const { data } = await socketClient
        .service("demographic")
        .find({ query: { customerId } });
      return data;
    },
  });

  useEffect(() => {
    socketClient
      .service("demographic")
      .on("created", (demographic: Demographic) => {
        if (demographic.customerId === customerId) {
          queryClient.setQueryData<Demographic[]>(
            ["demographics", customerId],
            (old) => {
              if (old) {
                return !old.find((o: Demographic) => o.id === demographic.id)
                  ? [...old, demographic]
                  : old;
              } else {
                return [demographic];
              }
            }
          );
        }
      });
    socketClient
      .service("demographic")
      .on("patched", (demographic: Demographic) => {
        queryClient.setQueryData<Demographic[]>(
          ["demographics", customerId],
          (old) =>
            old &&
            old.map((d: Demographic) =>
              d.id === demographic.id ? demographic : d
            )
        );
      });
    socketClient
      .service("demographic")
      .on("removed", (demographic: Demographic) => {
        queryClient.setQueryData<Demographic[]>(
          ["demographics", customerId],
          (old) =>
            old && old.filter((d: Demographic) => d.id !== demographic.id)
        );
      });
  }, [customerId, queryClient]);

  if (isError) return <div>Error: {JSON.stringify(error, null, 4)}</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={[
        {
          header: "Type",
          cell: ({ row }: any) => (
            <TypeCell demographicTypeId={row.original.demographicTypeId} />
          ),
        },
        { accessorKey: "text", header: "Description" },
        {
          accessorKey: "significantDate",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                className={cn(
                  "pl-0 pr-8 rounded-none w-full hover:bg-transparent"
                )}
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Date <ArrowUpDown className="ml-auto h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }: any) => {
            return format(parseISO(row.getValue("significantDate")), "PPP");
          },
        },
        {
          cell: ({ row }: any) => <ActionCell original={row.original} />,
          header: "Actions",
        },
      ]}
      data={data}
    />
  );
}

export default DemographicList;

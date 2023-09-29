import DataTable from "@components/ui/data-table.tsx";
import { useEffect, useState } from "react";
import { socketClient } from "@lib/utils.ts";
import type { Customer } from "backend";
import { format, parseISO } from "date-fns";
import { Button } from "@components/ui/button.tsx";
import { Trash, Eye, ArrowUpDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@components/ui/popover.tsx";

function ActionCell({ original }: { original: Customer }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex space-x-3">
      <Popover open={open} onOpenChange={setOpen}>
        <Button size="icon" variant="destructive" asChild>
          <PopoverTrigger>
            <Trash className="w-4 h-4" />
          </PopoverTrigger>
        </Button>
        <PopoverContent>
          <div className="mb-3">
            <p>Are you sure you want to delete customer: {original.name}?</p>
          </div>
          <div className="flex space-x-2 justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                socketClient.service("customer").remove(original.id);
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="outline" asChild>
        <Link to={`/customers/${original.id}`}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Link>
      </Button>
    </div>
  );
}

function CustomerList() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const queryObject = qs.parse(searchParams.toString());

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["customers", searchParams.toString()],
    queryFn: async () => {
      const response = await socketClient.service("customer").find({
        query: { ...queryObject },
        paginate: { default: 100, max: 200 },
      });
      return response.data;
    },
  });

  useEffect(() => {
    socketClient.service("customer").on("created", (customer: Customer) =>
      queryClient.setQueryData<Customer[]>(
        ["customers", searchParams.toString()],
        (old) => {
          if (old) {
            return !old.find((c: Customer) => c.id === customer.id)
              ? [customer, ...old]
              : old;
          } else {
            return [customer];
          }
        }
      )
    );
    socketClient
      .service("customer")
      .on("updated", (customer: Customer) =>
        queryClient.setQueryData<Customer[]>(
          ["customers", searchParams.toString()],
          (old) =>
            old &&
            old.map((c: Customer) => (c.id === customer.id ? customer : c))
        )
      );
    socketClient
      .service("customer")
      .on("removed", (customer: Customer) =>
        queryClient.setQueryData<Customer[]>(
          ["customers", searchParams.toString()],
          (old) => old && old.filter((c: Customer) => c.id !== customer.id)
        )
      );
  }, [queryClient, searchParams]);

  if (isError) return <div>{JSON.stringify(error, null, 4)}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={[
        {
          accessorKey: "number",
          header: ({ column }: any) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Customer # <ArrowUpDown className="ml-4 h-4 w-4" />
            </Button>
          ),
        },
        {
          accessorKey: "name",
          header: ({ column }: any) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name <ArrowUpDown className="ml-4 h-4 w-4" />
            </Button>
          ),
        },
        {
          accessorKey: "type",
          header: ({ column }: any) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Type <ArrowUpDown className="ml-4 h-4 w-4" />
            </Button>
          ),
        },
        {
          accessorKey: "since",
          cell: ({ row }: any) => {
            return format(parseISO(row.getValue("since")), "PPP");
          },
          header: ({ column }: any) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Customer Since <ArrowUpDown className="ml-4 h-4 w-4" />
            </Button>
          ),
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

export default CustomerList;

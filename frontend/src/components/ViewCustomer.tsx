import { useParams } from "react-router-dom";
import { socketClient } from "@lib/utils.ts";
import { format, parseISO } from "date-fns";
import DemographicWidget from "@components/DemographicWidget.tsx";
import { useQuery } from "@tanstack/react-query";
import AddressWidget from "@components/AddressWidget.tsx";

const initialState = {
  id: 0,
  number: 0,
  name: "",
  type: "",
  since: "1900-01-01T00:00:00.000",
};

function ViewCustomer() {
  const { id } = useParams();
  const {
    isError,
    isLoading,
    data: customer,
    error,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () =>
      id
        ? await socketClient.service("customer").get(parseInt(id))
        : initialState,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{JSON.stringify(error, null, 4)}</div>;

  return (
    <div id="view-customer" className="grid grid-cols-2 gap-16">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl">{customer.name}</h1>
          <small>{customer.type}</small>
          <div className="py-2">
            <div>Customer # {customer.number}</div>
            <div>Member since {format(parseISO(customer.since), "PPP")}</div>
          </div>
        </div>
        <div>
          <AddressWidget customerId={id ? parseInt(id) : 0} />
        </div>
      </div>
      <div>
        <DemographicWidget customerId={id ? parseInt(id) : 0} />
      </div>
    </div>
  );
}

export default ViewCustomer;

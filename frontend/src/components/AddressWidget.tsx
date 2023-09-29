import { useQuery } from "@tanstack/react-query";
import { socketClient } from "@lib/utils.ts";

function AddressWidget({ customerId }: { customerId: number }) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["address", customerId],
    queryFn: async () => {
      const { data } = await socketClient
        .service("address")
        .find({ query: { customerId } });
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>;

  return (
    <>
      <h3 className="text-2xl leading-loose">
        {data.length > 1 ? "Addresses" : "Address"}
      </h3>
      <div className="flex flex-col space-y-8">
        {data.map((address, index) => (
          <div key={index}>
            <address className="v-card">
              <span className="fn capitalize font-semibold">
                {address.type}
              </span>
              <br />
              <span className="adr">
                <span className="street-address">{address.street}</span>
                <br />
                <span className="locality">{address.city}</span>,{" "}
                <abbr className="region">{address.state}</abbr>{" "}
                <span className="postal-code">{address.zip}</span>{" "}
                <span className="country-name">{address.country}</span>
              </span>
            </address>
          </div>
        ))}
      </div>
    </>
  );
}

export default AddressWidget;

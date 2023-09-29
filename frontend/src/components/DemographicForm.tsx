import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form.tsx";
import { useState } from "react";
import { socketClient, cn } from "@lib/utils.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover.tsx";
import { Button } from "@components/ui/button.tsx";
import { CalendarIcon, Check, ChevronsUpDown, Send } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command.tsx";
import { Input } from "@components/ui/input.tsx";
import { format, formatISO } from "date-fns";
import { Calendar } from "@components/ui/calendar.tsx";
import { useQuery } from "@tanstack/react-query";
import { Demographic } from "backend";
import { diff } from "deep-object-diff";

interface Props {
  customerId: number;
  onSubmit?: () => void;
  demographic?: Demographic;
}

const formSchema = z.object({
  text: z.string(),
  demographicTypeId: z.number(),
  customerId: z.number(),
  significantDate: z.date(),
});

function DemographicForm(props: Props) {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: props.demographic ? props.demographic.text : "",
      demographicTypeId: props.demographic
        ? props.demographic.demographicTypeId
        : 0,
      customerId: props.customerId,
      significantDate: props.demographic
        ? new Date(props.demographic.significantDate)
        : new Date(),
    },
  });
  const {
    isLoading,
    isError,
    data: demographicTypes,
  } = useQuery({
    queryKey: ["demographic-types"],
    queryFn: async () => {
      const { data } = await socketClient
        .service("demographic-type")
        .find({ query: { $sort: { text: 1 } } });
      return data;
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.customerId = props.customerId;

    if (props.demographic) {
      const { id, ...rest } = props.demographic;
      const difference: any = diff(rest, values);

      if (Object.prototype.hasOwnProperty.call(difference, "significantDate")) {
        difference.significantDate = formatISO(difference.significantDate);
      }

      await socketClient.service("demographic").patch(id, difference);
    } else {
      await socketClient.service("demographic").create({
        ...values,
        significantDate: formatISO(values.significantDate),
      });
      form.reset();
    }

    if (props.onSubmit) {
      props.onSubmit();
    }
  }

  const filteredDemographicTypes = () => {
    return demographicTypes
      ? demographicTypes.filter(
          (demType) => !!demType.text.toLowerCase().includes(search)
        )
      : [];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="demographicTypeId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Type</FormLabel>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value && !isError && !isLoading
                        ? demographicTypes.find(
                            (demographicType) =>
                              demographicType.id === field.value
                          )?.text
                        : "Select Type"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search types..."
                      value={search}
                      onValueChange={setSearch}
                    />
                    <CommandEmpty>No type found</CommandEmpty>
                    <CommandGroup>
                      {!isLoading &&
                        !isError &&
                        filteredDemographicTypes().map((demographicType) => (
                          <CommandItem
                            value={demographicType.id.toString()}
                            key={demographicType.id}
                            onSelect={(value) => {
                              form.setValue(
                                "demographicTypeId",
                                parseInt(value)
                              );
                              setPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                demographicType.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {demographicType.text}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input placeholder="describe this..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="significantDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Significant Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      role="calendar"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) =>
                      value ? field.onChange(value) : new Date()
                    }
                    disabled={(date) =>
                      date > new Date() || date < new Date("")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">
            <Send className="h-4 w-4 mr-1" /> Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default DemographicForm;

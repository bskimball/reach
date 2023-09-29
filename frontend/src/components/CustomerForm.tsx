import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { socketClient } from "@lib/utils.ts";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@components/ui/form.tsx";
import { Input } from "@components/ui/input.tsx";
import { Button } from "@components/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover.tsx";
import { cn } from "@lib/utils.ts";
import { CalendarIcon, Send } from "lucide-react";
import { format, formatISO } from "date-fns";
import { Calendar } from "@components/ui/calendar.tsx";

interface Props {
  onSubmit?: () => void;
}

const formSchema = z
  .object({
    number: z.number(),
    name: z.string(),
    type: z.string(),
    since: z.date(),
  })
  .required();

function CustomerForm(props: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 0,
      name: "",
      type: "residential",
      since: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await socketClient
      .service("customer")
      .create({ ...values, since: formatISO(values.since) });

    form.reset();

    if (props.onSubmit) {
      props.onSubmit();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="12345"
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Sam Sook" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="residential" id="residential" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="residential">
                      Residential
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="commercial" id="commercial" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="commercial">
                      Commercial
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="since"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Since</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] ml-3 pl-3 text-left font-normal",
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">
            <Send className="w-4 h-4 mr-1" /> Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CustomerForm;

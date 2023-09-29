import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as z from "zod";
import { diff } from "deep-object-diff";
import qs from "qs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select.tsx";
import { Input } from "@components/ui/input.tsx";
import { cn } from "@lib/utils.ts";
import { Button } from "@components/ui/button.tsx";
import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  onSubmit?: () => void;
}

const formSchema = z
  .object({
    field: z.string(),
    number: z.number(),
    name: z.string(),
    type: z.string(),
    sinceStart: z.date(),
    sinceEnd: z.date(),
  })
  .partial();

const formOptions = {
  resolver: zodResolver(formSchema),
  defaultValues: {
    field: "",
    number: 0,
    name: "",
    type: "",
    sinceStart: new Date("1900-01-01"),
    sinceEnd: new Date("1900-01-01"),
  },
};

function FilterForm(props: Props) {
  const form = useForm(formOptions);
  const [, setSearchParams] = useSearchParams();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const difference: any = diff(formOptions.defaultValues, values);

    let queryProperty = { [difference.field]: difference[difference.field] };
    if (difference.field === "name") {
      queryProperty = {
        [difference.field]: { $like: `%${difference[difference.field]}%` },
      };
    }

    setSearchParams((prev) =>
      qs.stringify({
        ...qs.parse(prev.toString()),
        ...queryProperty,
      })
    );

    form.resetField("field");

    if (props.onSubmit) {
      props.onSubmit();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center space-x-4"
      >
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={cn("min-w-[180px]")}>
                    <SelectValue placeholder="Select a field to filter..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  {/*<SelectItem value="type">Type</SelectItem>*/}
                  {/*<SelectItem value="since">Since</SelectItem>*/}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {form.watch("field") === "number" && (
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="12345"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                    className={cn("min-w-[240px]")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("field") === "name" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="filter by name..."
                    {...field}
                    className={cn("min-w-[240px]")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div>
          <Button type="submit">
            <Send className="w-4 h-4 mr-1" /> Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FilterForm;

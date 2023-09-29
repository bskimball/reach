import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@components/ui/input.tsx";
import { cn, socketClient } from "@lib/utils.ts";
import { useState } from "react";
import { Eye, EyeOff, Send } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import { User } from "backend";
import { diff } from "deep-object-diff";

interface Props {
  user?: User;
  onSubmit?: () => void;
}

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

function UserForm(props: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: props?.user?.email || "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (props.user) {
      const { id, ...rest } = props.user;
      const difference: any = diff(rest, values);

      await socketClient.service("users").patch(id, difference);
    } else {
      await socketClient.service("users").create(values);
      form.reset();
    }

    if (props.onSubmit) {
      props.onSubmit();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  {...field}
                  autoComplete="email"
                  disabled={field.value === "brian.kimball@bdkinc.com"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-24")}
                    autoComplete="current-password"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
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

export default UserForm;

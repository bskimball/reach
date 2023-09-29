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
import { cn } from "@lib/utils.ts";
import { useState } from "react";
import { Eye, EyeOff, Send } from "lucide-react";
import { Button } from "@components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth.ts";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values);
      navigate("/customers?%24sort%5Bid%5D=-1", { replace: true });
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="rounded p-6 border mb-6">{error}</div>}
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
          <div>
            <Button type="submit">
              <Send className="w-4 h-4 mr-1" /> Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default LoginForm;

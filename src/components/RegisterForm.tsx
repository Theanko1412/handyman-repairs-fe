import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useAuth } from "./AuthContext";
import { z } from "zod";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function RegisterForm() {
  const { register } = useAuth();

  const LoginFormSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(3, {
        message: "First Name must be at least 3 characters long",
      })
      .max(15, {
        message: "First Name must be at most 15 characters long",
      }),
    lastName: z
      .string()
      .trim()
      .min(3, {
        message: "Last Name must be at least 3 characters long",
      })
      .max(20, {
        message: "Last Name must be at most 20 characters long",
      }),
    username: z
      .string()
      .trim()
      .min(3, {
        message: "Email must be at least 3 characters long",
      })
      .max(50, {
        message: "Email must be at most 50 characters long",
      }),
    password: z
      .string()
      .trim()
      .min(3, {
        message: "Password must be at least 3 characters long",
      })
      .max(50, {
        message: "Password must be at most 50 characters long",
      }),
    isHandyman: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  });

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    console.log(data);
    try {
      await register(
        data.firstName,
        data.lastName,
        data.username,
        data.password,
        data.isHandyman ? "handyman" : "customer"
      );
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Register</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
            <DialogDescription>
              Enter your details to create a new account.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <FormField
                control={form.control}
                name="isHandyman"
                render={({ field }) => (
                  <div className="flex justify-center gap-2 items-center">
                <Label>Customer</Label>
                <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                />
                <Label>Handyman</Label>
              </div>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
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
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

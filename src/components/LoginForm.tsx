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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormItem, FormControl, FormDescription, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useAuth } from "./AuthContext";


export default function LoginForm() {
   const { login } = useAuth();

   const LoginFormSchema = z.object({
      username: z.string().trim().min(3, {
         message: "Email must be at least 3 characters long",
      }).max(50, {
         message: "Email must be at most 50 characters long",
      }),
      password: z.string().trim().min(3, {
         message: "Password must be at least 3 characters long",
      }).max(50, {
         message: "Password must be at most 50 characters long",
      })
   });

   const form = useForm<z.infer<typeof LoginFormSchema>>({
      resolver: zodResolver(LoginFormSchema),
   })
   
   async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
      console.log(data);
      try {
         await login(data.username, data.password);
         console.log("Login successful");
      } catch (error) {
         console.error("Login failed:", error);
      }
   }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to login to your existing account.
            </DialogDescription>
          </DialogHeader>
              <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                 <Input placeholder="Password" type="password" {...field} />
                               </FormControl>
                               <FormMessage />
                           </FormItem>
                       )}
                     />
                    <Button type="submit">Login</Button>
                 </form>
               </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

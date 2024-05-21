import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Login() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Login</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col items-center">
          <DropdownMenuItem asChild>
            <LoginForm />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <RegisterForm />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

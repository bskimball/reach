import MainNav from "@components/MainNav.tsx";
import DarkModeToggle from "@components/DarkModeToggle.tsx";
import { useAuth } from "@hooks/useAuth.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu.tsx";
import { LogOut, User, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@lib/utils.ts";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <div className="container py-6 mb-6">
        <div className="flex">
          <div className="mr-8">
            <div className="text-3xl font-bold">Proof of Concept</div>
            <div className="text-xs">built by BDKinc</div>
          </div>
          <div>{user && <MainNav />}</div>
          <div className="ml-auto flex items-center space-x-8">
            <DarkModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserCircle className="w-8 h-8" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user && (
                  <>
                    <DropdownMenuItem className={cn("cursor-pointer")} asChild>
                      <Link to="/account">
                        <User className="h-4 w-4 mr-1" /> Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => await logout()}>
                      <LogOut className="w-4 h-4 mr-1" /> Logout
                    </DropdownMenuItem>
                  </>
                )}
                {!user && (
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

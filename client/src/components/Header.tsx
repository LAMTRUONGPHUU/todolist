
import { useMe } from "@/hooks/useMe";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function Header() {
  const { data, isLoading } = useMe();
  const { logout, isLoggingOut } = useAuth();

  if (isLoading || !data) return null;

  const { email, avatar } = data;

  return (
    <header className="h-14 px-20 flex items-center justify-between border-b bg-white">
      {/* Left */}
      <div className="font-semibold text-lg">TistDoLo</div>

      {/* Right */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={avatar || "https://api.dicebear.com/7.x/identicon/svg"}
                alt="avatar"
              />
              <AvatarFallback>
                {email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="text-sm text-gray-700">{email}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="text-red-500 cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

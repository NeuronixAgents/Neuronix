import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Users } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-16 border-r border-white/10 bg-black/80 backdrop-blur flex flex-col items-center py-4">
      <Link href="/">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md text-white transition-colors hover:bg-white/10",
          location === "/" && "bg-white/20"
        )}>
          <Home className="h-6 w-6" />
        </a>
      </Link>

      <Link href="/premade">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md text-white mt-2 transition-colors hover:bg-white/10",
          location === "/premade" && "bg-white/20"
        )}>
          <Users className="h-6 w-6" />
        </a>
      </Link>

      <Link href="/builder">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md text-white mt-2 transition-colors hover:bg-white/10",
          location.startsWith("/builder") && "bg-white/20"
        )}>
          <PlusCircle className="h-6 w-6" />
        </a>
      </Link>
    </div>
  );
}
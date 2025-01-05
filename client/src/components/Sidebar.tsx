import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Users } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-16 border-r bg-card/95 flex flex-col items-center py-4">
      <Link href="/">
        <a className={cn(
          "sidebar-icon",
          location === "/" && "active"
        )}>
          <Home className="h-6 w-6" />
        </a>
      </Link>

      <Link href="/premade">
        <a className={cn(
          "sidebar-icon",
          location === "/premade" && "active"
        )}>
          <Users className="h-6 w-6" />
        </a>
      </Link>

      <Link href="/builder">
        <a className={cn(
          "sidebar-icon",
          location.startsWith("/builder") && "active"
        )}>
          <PlusCircle className="h-6 w-6" />
        </a>
      </Link>
    </div>
  );
}
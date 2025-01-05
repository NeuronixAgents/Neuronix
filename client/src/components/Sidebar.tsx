import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Users } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-16 border-r bg-card/95 flex flex-col items-center py-4">
      <Link href="/">
        <a className={cn(
          "p-3 rounded-lg mb-2 text-white hover:bg-primary/20 transition-colors",
          location === "/" && "bg-primary/30"
        )}>
          <Home className="h-6 w-6" />
        </a>
      </Link>

      <Link href="/premade">
        <a className={cn(
          "p-3 rounded-lg mb-2 text-white hover:bg-primary/20 transition-colors",
          location === "/premade" && "bg-primary/30"
        )}>
          <Users className="h-6 w-6" />
        </a>
      </Link>

      <Link href="/builder">
        <a className={cn(
          "p-3 rounded-lg mb-2 text-white hover:bg-primary/20 transition-colors",
          location.startsWith("/builder") && "bg-primary/30"
        )}>
          <PlusCircle className="h-6 w-6" />
        </a>
      </Link>
    </div>
  );
}
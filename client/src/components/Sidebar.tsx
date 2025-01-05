import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Users, Map } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-16 border-r border-white/10 bg-black/80 backdrop-blur flex flex-col items-center py-4 z-50">
      <Link href="/">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md transition-colors hover:bg-white/10",
          location === "/" ? "bg-white/20" : "bg-white/5"
        )}>
          <Home className="h-6 w-6 text-white" aria-label="Home" />
        </a>
      </Link>

      <Link href="/premade">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md mt-2 transition-colors hover:bg-white/10",
          location === "/premade" ? "bg-white/20" : "bg-white/5"
        )}>
          <Users className="h-6 w-6 text-white" aria-label="Premade Agents" />
        </a>
      </Link>

      <Link href="/builder">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md mt-2 transition-colors hover:bg-white/10",
          location.startsWith("/builder") ? "bg-white/20" : "bg-white/5"
        )}>
          <PlusCircle className="h-6 w-6 text-white" aria-label="Create New Agent" />
        </a>
      </Link>

      <Link href="/roadmap">
        <a className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md mt-2 transition-colors hover:bg-white/10",
          location === "/roadmap" ? "bg-white/20" : "bg-white/5"
        )}>
          <Map className="h-6 w-6 text-white" aria-label="Development Roadmap" />
        </a>
      </Link>

      {/* Funding text at the bottom */}
      <div className="mt-auto mb-4 text-white/70 text-xs font-medium rotate-[-90deg] whitespace-nowrap">
        Funded by a16z DAO
      </div>
    </div>
  );
}
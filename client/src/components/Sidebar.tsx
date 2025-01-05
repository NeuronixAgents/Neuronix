import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Settings } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-16 border-r bg-card flex flex-col items-center py-4">
      <Link href="/">
        <a className={cn(
          "p-3 rounded-lg mb-2 hover:bg-primary/10",
          location === "/" && "bg-primary/20"
        )}>
          <Home className="h-6 w-6" />
        </a>
      </Link>
      
      <Link href="/builder">
        <a className={cn(
          "p-3 rounded-lg mb-2 hover:bg-primary/10",
          location.startsWith("/builder") && "bg-primary/20"
        )}>
          <PlusCircle className="h-6 w-6" />
        </a>
      </Link>

      <div className="mt-auto">
        <button className="p-3 rounded-lg hover:bg-primary/10">
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

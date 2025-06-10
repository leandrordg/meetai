"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "@/modules/dashboard/ui/components/dashboard-command";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((value) => !value);
      }
    };

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-2 items-center py-3 border-b bg-background">
        <Button onClick={toggleSidebar} variant="outline" size="icon">
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon />
          ) : (
            <PanelLeftCloseIcon />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 w-60 justify-start font-normal text-muted-foreground hover:text-muted-foreground"
          onClick={() => setCommandOpen((value) => !value)}
        >
          <SearchIcon />
          Buscar...
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-muted-foreground">
            <span className="text-[10px]">&#8984;</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
}

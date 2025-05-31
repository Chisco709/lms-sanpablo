import { Menu } from 'lucide-react';
import { Sidebar } from "./sidebar";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden p-2 rounded-lg bg-green-400/10 hover:bg-green-400/20 transition-all duration-300 text-green-400 shadow-lg border border-green-400/30 hover:scale-105">
                <Menu className="h-5 w-5" />
            </SheetTrigger>     
            <SheetContent 
                side="left" 
                className="p-0 bg-black/95 backdrop-blur-xl border-r-2 border-green-400/30 shadow-[4px_0_32px_0_rgba(34,197,94,0.15)] w-[280px]"
            >
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}
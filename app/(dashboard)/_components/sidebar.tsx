import { Logo } from './logo'
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
    return (
        <div className="h-full flex flex-col bg-slate-900 border-r border-slate-700">
            {/* Logo section */}
            <div className="p-6 border-b border-slate-700">
                <Logo />
            </div>
            
            {/* Navigation section */}
            <div className="flex flex-col w-full p-4 flex-1">
                <SidebarRoutes />
            </div>
        </div>
    )
}
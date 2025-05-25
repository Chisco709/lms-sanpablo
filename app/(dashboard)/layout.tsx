import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({children} : { children: React.ReactNode }) => {
    return (
        <div className="h-full bg-slate-950 min-h-screen">
            {/* Navbar fijo */}
            <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            
            {/* Sidebar */}
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            
            {/* Contenido principal */}
            <main className="md:pl-56 pt-[80px] h-full min-h-screen bg-slate-950">
                <div className="h-full p-6 bg-slate-950">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
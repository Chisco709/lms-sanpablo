"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import BackgroundMusic from "@/components/background-music";
import { TeacherAuthGuard } from "@/components/teacher-auth-guard";

const DashboardLayout = ({children} : { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="h-full">
      <Navbar />
      <div className="container">
        <div className="flex gap-x-7">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <BackgroundMusic />
    </div>
  );
};

export default DashboardLayout;
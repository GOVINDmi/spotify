import React, { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Player from "./Player";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen">
      <div className="h-[90%] flex">
        {/* Sidebar with mobile overlay */}
        <div className={`fixed md:relative z-50 h-full transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
        </div>
        
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto">
          <Navbar setIsSidebarOpen={setIsSidebarOpen} />
          {children}
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Layout;

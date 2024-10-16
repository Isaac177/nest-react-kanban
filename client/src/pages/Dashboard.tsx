import React, { useState } from 'react';
import Sidebar from "../components/notes/Sidebar";
import TopBar from "../components/notes/TopBar";
import Breadcrumbs from "../components/notes/Breadcrumbs";
import KanbanBoard from "../components/notes/KanbanBoard.tsx";

const Dashboard: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');


  return (
    <div className="flex h-screen bg-background lg:max-w-7xl mx-auto border rounded-xl m-20">
      <Sidebar />
      <div className="flex flex-col flex-grow overflow-hidden">
        <TopBar />
        <Breadcrumbs currentPath={currentPath} />
        <main className="flex-grow overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <KanbanBoard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

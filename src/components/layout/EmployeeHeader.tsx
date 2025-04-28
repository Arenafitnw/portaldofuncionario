
import React from 'react';
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  employeeName: string;
  storeName: string;
  onLogout: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ 
  employeeName, storeName, onLogout 
}) => {
  return (
    <header className="w-full px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.ibb.co/k6QPjdV0/logo-1.png" 
            alt="Arena Fit" 
            className="h-12"
          />
          <div>
            <h1 className="text-xl font-bold">Portal do Funcionário</h1>
            <div className="flex flex-col md:flex-row md:gap-2 text-xs text-white/80">
              <span>{employeeName}</span>
              {storeName && (
                <>
                  <span className="hidden md:inline">-</span>
                  <span>{storeName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="bg-white text-primary-600 hover:bg-gray-100"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </header>
  );
};

export default EmployeeHeader;


import React from 'react';
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
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
            <p className="text-xs text-white/80">Painel do Administrador</p>
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

export default AdminHeader;


import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, Users, FileText } from "lucide-react";
import { loadData, saveData, Store, Employee, Payslip } from "@/services/api";
import LoginForm from "@/components/auth/LoginForm";
import StoreManagement from "@/components/admin/StoreManagement";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import PayslipManagement from "@/components/admin/PayslipManagement";
import AdminHeader from "@/components/layout/AdminHeader";
import EmployeeHeader from "@/components/layout/EmployeeHeader";
import EmployeePanel from "@/components/employee/EmployeePanel";

const Index = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [adminTab, setAdminTab] = useState('stores');
  
  // Data state
  const [stores, setStores] = useState<Store[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  
  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);
  
  // Load data from API
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const data = await loadData();
      setStores(data.stores);
      setEmployees(data.employees);
      setPayslips(data.payslips);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save data wrapper
  const handleSaveData = async (storesData = stores, employeesData = employees, payslipsData = payslips) => {
    const success = await saveData(storesData, employeesData, payslipsData);
    if (success) {
      // Update local state with the saved data
      setStores(storesData.map(store => ({
        ...store,
        employeeCount: employeesData.filter(e => e.storeId === store.id && !e.isAdmin).length
      })));
      setEmployees(employeesData);
      setPayslips(payslipsData);
    }
    return success;
  };
  
  // Handle login
  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    const user = employees.find(e => e.id === username && e.password === password);
    
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.isAdmin ? 'admin' : 'employee');
      toast.success(`Bem-vindo, ${user.name}!`);
    } else {
      toast.error("Usuário ou senha incorretos");
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setAdminTab('stores');
    toast.info("Sessão encerrada");
  };
  
  // Get store name by ID
  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Desconhecida';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  // Login view
  if (currentView === 'login') {
    return (
      <LoginForm onLogin={handleLogin} isLoading={isLoading} />
    );
  }
  
  // Admin view
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader onLogout={handleLogout} />
        
        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 py-8">
          <Tabs 
            defaultValue="stores"
            value={adminTab} 
            onValueChange={setAdminTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="stores" className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" /> Gerenciar Lojas
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> Gerenciar Funcionários
              </TabsTrigger>
              <TabsTrigger value="payslips" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Gerenciar Holerites
              </TabsTrigger>
            </TabsList>
            
            {/* Store Management Tab */}
            <TabsContent value="stores" className="animate-fadeIn">
              <StoreManagement 
                stores={stores} 
                employees={employees}
                payslips={payslips}
                saveData={handleSaveData}
              />
            </TabsContent>
            
            {/* Employee Management Tab */}
            <TabsContent value="employees" className="animate-fadeIn">
              <EmployeeManagement
                stores={stores}
                employees={employees}
                payslips={payslips}
                saveData={handleSaveData}
              />
            </TabsContent>
            
            {/* Payslip Management Tab */}
            <TabsContent value="payslips" className="animate-fadeIn">
              <PayslipManagement
                stores={stores}
                employees={employees}
                payslips={payslips}
                saveData={handleSaveData}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }
  
  // Employee view
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {currentUser && (
        <EmployeeHeader 
          employeeName={currentUser.name}
          storeName={getStoreName(currentUser.storeId)}
          onLogout={handleLogout}
        />
      )}
      
      {currentUser && (
        <EmployeePanel
          currentUser={currentUser}
          stores={stores}
          employees={employees}
          payslips={payslips}
          saveData={handleSaveData}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Index;

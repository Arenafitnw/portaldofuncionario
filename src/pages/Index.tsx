
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  LogOut,
  ChevronRight,
  Building2,
  Users,
  FileText,
  User,
  Key,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// JSONBIN Config
const JSONBIN_CONFIG = {
  BIN_ID: "680a69b98a456b7966908994",
  X_MASTER_KEY: "$2a$10$RA4z0AoPU7RfLuxk.yeTMum0CpKOT86yytGVhxx/Et5MTHUiaV7SW"
};

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.BIN_ID}`;
const JSONBIN_HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": JSONBIN_CONFIG.X_MASTER_KEY
};

const Index = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [adminTab, setAdminTab] = useState('stores');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Store Management
  const [stores, setStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCode, setNewStoreCode] = useState('');
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [showDeleteStoreAlert, setShowDeleteStoreAlert] = useState(false);
  
  // Employee Management
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [employeeStoreFilter, setEmployeeStoreFilter] = useState('all');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newEmployeeStore, setNewEmployeeStore] = useState('');
  const [newEmployeePassword, setNewEmployeePassword] = useState('');
  
  // Edit Employee Modal
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editEmployeeName, setEditEmployeeName] = useState('');
  const [editEmployeeStore, setEditEmployeeStore] = useState('');
  const [editEmployeePassword, setEditEmployeePassword] = useState('');
  
  // Delete Employee Alert
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showDeleteEmployeeAlert, setShowDeleteEmployeeAlert] = useState(false);
  
  // Payslip Management
  const [payslipStore, setPayslipStore] = useState('');
  const [payslipEmployee, setPayslipEmployee] = useState('');
  const [payslipMonth, setPayslipMonth] = useState('');
  const [payslipLink, setPayslipLink] = useState('');
  const [payslipStoreFilter, setPayslipStoreFilter] = useState('all');
  
  // Delete Payslip Alert
  const [payslipToDelete, setPayslipToDelete] = useState(null);
  const [showDeletePayslipAlert, setShowDeletePayslipAlert] = useState(false);
  
  // Employee panel
  const [employeeMonthFilter, setEmployeeMonthFilter] = useState('all');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPasswordChange, setNewPasswordChange] = useState('');
  const [confirmPasswordChange, setConfirmPasswordChange] = useState('');
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Update filtered employees when store filter changes
  useEffect(() => {
    if (payslipStore) {
      updatePayslipEmployeeOptions();
    }
  }, [payslipStore, employees]);
  
  // Load data from JSONBIN
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(JSONBIN_URL, {
        headers: JSONBIN_HEADERS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const jsonData = await response.json();
      
      if (jsonData.record) {
        // Check if data has valid structure
        if (jsonData.record.stores && jsonData.record.employees) {
          setStores(jsonData.record.stores);
          setEmployees(jsonData.record.employees);
          setPayslips(jsonData.record.payslips || []);
        } else {
          // Use default data and save it
          const defaultData = getDefaultData();
          setStores(defaultData.stores);
          setEmployees(defaultData.employees);
          setPayslips(defaultData.payslips);
          await saveData(defaultData.stores, defaultData.employees, defaultData.payslips);
        }
      } else {
        // Use default data and save it
        const defaultData = getDefaultData();
        setStores(defaultData.stores);
        setEmployees(defaultData.employees);
        setPayslips(defaultData.payslips);
        await saveData(defaultData.stores, defaultData.employees, defaultData.payslips);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
      
      // Use default data
      const defaultData = getDefaultData();
      setStores(defaultData.stores);
      setEmployees(defaultData.employees);
      setPayslips(defaultData.payslips);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Default data structure
  const getDefaultData = () => {
    return {
      stores: [
        { id: "tacaruna", name: "Tacaruna", employeeCount: 0 },
        { id: "riomar", name: "Riomar", employeeCount: 0 },
        { id: "patteo", name: "Patteo", employeeCount: 0 },
        { id: "northway", name: "North Way", employeeCount: 0 },
        { id: "difusora", name: "Difusora", employeeCount: 0 },
        { id: "caruaru", name: "Caruaru", employeeCount: 0 }
      ],
      employees: [
        { id: "admin", name: "Administrador", password: "admin123", isAdmin: true, storeId: "" }
      ],
      payslips: []
    };
  };
  
  // Save data to JSONBIN
  const saveData = async (storesData = stores, employeesData = employees, payslipsData = payslips) => {
    try {
      // Update employee counts
      const updatedStores = storesData.map(store => ({
        ...store,
        employeeCount: employeesData.filter(e => e.storeId === store.id && !e.isAdmin).length
      }));
      
      const dataToSave = {
        stores: updatedStores,
        employees: employeesData,
        payslips: payslipsData
      };
      
      const response = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: JSONBIN_HEADERS,
        body: JSON.stringify(dataToSave)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      // Update local state with updated store counts
      setStores(updatedStores);
      
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Erro ao salvar dados");
      return false;
    }
  };
  
  // Handle login
  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    const user = employees.find(e => e.id === username && e.password === password);
    
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.isAdmin ? 'admin' : 'employee');
      toast.success(`Bem-vindo, ${user.name}!`);
      
      // Reset login form
      setUsername('');
      setPassword('');
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
  
  // Add new store
  const handleAddStore = async () => {
    if (!newStoreName || !newStoreCode) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    const code = newStoreCode.toLowerCase().replace(/\s+/g, '');
    
    if (stores.some(s => s.id.toLowerCase() === code)) {
      toast.error("Código de loja já existe");
      return;
    }
    
    const newStore = {
      id: code,
      name: newStoreName,
      employeeCount: 0
    };
    
    const updatedStores = [...stores, newStore];
    const saved = await saveData(updatedStores, employees, payslips);
    
    if (saved) {
      setStores(updatedStores);
      setNewStoreName('');
      setNewStoreCode('');
      toast.success("Loja adicionada com sucesso");
    }
  };
  
  // Delete store
  const confirmDeleteStore = async () => {
    if (!storeToDelete) return;
    
    // Check if store has employees
    if (employees.some(e => e.storeId === storeToDelete.id)) {
      toast.error("Remova os funcionários da loja antes de excluí-la");
      setShowDeleteStoreAlert(false);
      return;
    }
    
    const updatedStores = stores.filter(s => s.id !== storeToDelete.id);
    const updatedPayslips = payslips.filter(p => p.storeId !== storeToDelete.id);
    
    const saved = await saveData(updatedStores, employees, updatedPayslips);
    
    if (saved) {
      setStores(updatedStores);
      setPayslips(updatedPayslips);
      toast.success("Loja excluída com sucesso");
    }
    
    setShowDeleteStoreAlert(false);
  };
  
  // Add new employee
  const handleAddEmployee = async () => {
    if (!newEmployeeName || !newEmployeeId || !newEmployeeStore || !newEmployeePassword) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    if (employees.some(e => e.id === newEmployeeId)) {
      toast.error("ID/Matrícula já existe");
      return;
    }
    
    const newEmployee = {
      id: newEmployeeId,
      name: newEmployeeName,
      password: newEmployeePassword,
      isAdmin: false,
      storeId: newEmployeeStore
    };
    
    const updatedEmployees = [...employees, newEmployee];
    const saved = await saveData(stores, updatedEmployees, payslips);
    
    if (saved) {
      setEmployees(updatedEmployees);
      setNewEmployeeName('');
      setNewEmployeeId('');
      setNewEmployeeStore('');
      setNewEmployeePassword('');
      toast.success("Funcionário adicionado com sucesso");
    }
  };
  
  // Open edit employee modal
  const openEditEmployeeModal = (employee) => {
    setEditingEmployee(employee);
    setEditEmployeeName(employee.name);
    setEditEmployeeStore(employee.storeId);
    setEditEmployeePassword('');
    setIsEditEmployeeModalOpen(true);
  };
  
  // Save employee edits
  const handleSaveEmployeeChanges = async () => {
    if (!editingEmployee) return;
    
    if (!editEmployeeName || !editEmployeeStore) {
      toast.error("Nome e loja são obrigatórios");
      return;
    }
    
    const updatedEmployees = employees.map(e => {
      if (e.id === editingEmployee.id) {
        return {
          ...e,
          name: editEmployeeName,
          storeId: editEmployeeStore,
          password: editEmployeePassword ? editEmployeePassword : e.password
        };
      }
      return e;
    });
    
    const saved = await saveData(stores, updatedEmployees, payslips);
    
    if (saved) {
      setEmployees(updatedEmployees);
      setIsEditEmployeeModalOpen(false);
      setEditingEmployee(null);
      toast.success("Funcionário atualizado com sucesso");
    }
  };
  
  // Delete employee
  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    const updatedEmployees = employees.filter(e => e.id !== employeeToDelete.id);
    const updatedPayslips = payslips.filter(p => p.employeeId !== employeeToDelete.id);
    
    const saved = await saveData(stores, updatedEmployees, updatedPayslips);
    
    if (saved) {
      setEmployees(updatedEmployees);
      setPayslips(updatedPayslips);
      toast.success("Funcionário excluído com sucesso");
    }
    
    setShowDeleteEmployeeAlert(false);
  };
  
  // Update payslip employee dropdown based on selected store
  const updatePayslipEmployeeOptions = () => {
    if (!payslipStore) return;
    
    // This function doesn't directly update state but is used in the select render
  };
  
  // Add new payslip
  const handleAddPayslip = async () => {
    if (!payslipStore || !payslipEmployee || !payslipMonth || !payslipLink) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    if (!payslipLink.includes('drive.google.com')) {
      toast.error("Use um link válido do Google Drive");
      return;
    }
    
    // Format month/year (e.g., "2023-05" to "Maio/2023")
    const [year, month] = payslipMonth.split('-');
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const formattedMonth = `${monthNames[parseInt(month) - 1]}/${year}`;
    
    const newPayslip = {
      id: Date.now().toString(),
      employeeId: payslipEmployee,
      month: formattedMonth,
      pdfLink: payslipLink,
      storeId: payslipStore
    };
    
    const updatedPayslips = [...payslips, newPayslip];
    const saved = await saveData(stores, employees, updatedPayslips);
    
    if (saved) {
      setPayslips(updatedPayslips);
      setPayslipStore('');
      setPayslipEmployee('');
      setPayslipMonth('');
      setPayslipLink('');
      toast.success("Holerite adicionado com sucesso");
    }
  };
  
  // Delete payslip
  const confirmDeletePayslip = async () => {
    if (!payslipToDelete) return;
    
    const updatedPayslips = payslips.filter(p => p.id !== payslipToDelete.id);
    const saved = await saveData(stores, employees, updatedPayslips);
    
    if (saved) {
      setPayslips(updatedPayslips);
      toast.success("Holerite excluído com sucesso");
    }
    
    setShowDeletePayslipAlert(false);
  };
  
  // Change password (employee)
  const handleChangePassword = async () => {
    if (!currentPassword || !newPasswordChange || !confirmPasswordChange) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    if (currentUser.password !== currentPassword) {
      toast.error("Senha atual incorreta");
      return;
    }
    
    if (newPasswordChange !== confirmPasswordChange) {
      toast.error("As novas senhas não coincidem");
      return;
    }
    
    const updatedEmployees = employees.map(e => {
      if (e.id === currentUser.id) {
        return {
          ...e,
          password: newPasswordChange
        };
      }
      return e;
    });
    
    const saved = await saveData(stores, updatedEmployees, payslips);
    
    if (saved) {
      setEmployees(updatedEmployees);
      setCurrentUser({...currentUser, password: newPasswordChange});
      setCurrentPassword('');
      setNewPasswordChange('');
      setConfirmPasswordChange('');
      toast.success("Senha alterada com sucesso");
    }
  };
  
  // Get filtered employees
  const getFilteredEmployees = () => {
    return employeeStoreFilter === 'all'
      ? employees.filter(e => !e.isAdmin)
      : employees.filter(e => e.storeId === employeeStoreFilter && !e.isAdmin);
  };
  
  // Get filtered payslips
  const getFilteredPayslips = () => {
    return payslipStoreFilter === 'all'
      ? payslips
      : payslips.filter(p => p.storeId === payslipStoreFilter);
  };
  
  // Get employee payslips
  const getEmployeePayslips = () => {
    if (!currentUser) return [];
    
    let filteredPayslips = payslips.filter(p => p.employeeId === currentUser.id);
    
    if (employeeMonthFilter !== 'all') {
      filteredPayslips = filteredPayslips.filter(p => p.month === employeeMonthFilter);
    }
    
    return filteredPayslips;
  };
  
  // Get unique months for employee payslips
  const getUniqueMonths = () => {
    if (!currentUser) return [];
    
    const employeePayslips = payslips.filter(p => p.employeeId === currentUser.id);
    return [...new Set(employeePayslips.map(p => p.month))];
  };
  
  // Get store name by ID
  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Desconhecida';
  };
  
  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Desconhecido';
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
      <div className="min-h-screen flex flex-col gradient-background">
        {/* Header */}
        <header className="w-full py-4 px-6 flex justify-center">
          <div className="flex flex-col items-center">
            <img 
              src="https://i.ibb.co/k6QPjdV0/logo-1.png" 
              alt="Arena Fit" 
              className="h-16 mb-2"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Portal do Funcionário</h1>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md glassmorphism animate-fadeIn">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-primary-700">Login</CardTitle>
              <CardDescription className="text-center">
                Acesse o portal com suas credenciais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input 
                    id="username" 
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleLogin}
              >
                Entrar
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Footer */}
        <footer className="w-full py-3 text-center text-white/80 text-sm">
          &copy; {new Date().getFullYear()} Arena Fit - Todos os direitos reservados
        </footer>
      </div>
    );
  }
  
  // Admin view
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-primary-600 text-white px-6 py-4 shadow-md">
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
              onClick={handleLogout}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </header>
        
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="mr-2 h-5 w-5 text-primary-500" /> 
                      Adicionar Nova Loja
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newStoreName">Nome da Loja</Label>
                      <Input 
                        id="newStoreName" 
                        placeholder="Nome da loja"
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newStoreCode">Código da Loja</Label>
                      <Input 
                        id="newStoreCode" 
                        placeholder="Código único para a loja"
                        value={newStoreCode}
                        onChange={(e) => setNewStoreCode(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Use um código curto sem espaços (ex: tacaruna, riomar)
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleAddStore}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Loja
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Lista de Lojas</CardTitle>
                    <CardDescription>
                      Gerenciamento das unidades da Academia Arena Fit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Loja</TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Funcionários</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stores.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              Nenhuma loja cadastrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          stores.map((store) => (
                            <TableRow key={store.id}>
                              <TableCell className="font-medium">{store.name}</TableCell>
                              <TableCell>{store.id}</TableCell>
                              <TableCell>
                                <Badge variant={store.employeeCount > 0 ? "default" : "outline"}>
                                  {store.employeeCount}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setStoreToDelete(store);
                                    setShowDeleteStoreAlert(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Employee Management Tab */}
            <TabsContent value="employees" className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="mr-2 h-5 w-5 text-primary-500" /> 
                      Adicionar Funcionário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newEmployeeName">Nome</Label>
                      <Input 
                        id="newEmployeeName" 
                        placeholder="Nome do funcionário"
                        value={newEmployeeName}
                        onChange={(e) => setNewEmployeeName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newEmployeeId">ID/Matrícula</Label>
                      <Input 
                        id="newEmployeeId" 
                        placeholder="ID ou matrícula"
                        value={newEmployeeId}
                        onChange={(e) => setNewEmployeeId(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Use um ID único para cada funcionário
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newEmployeeStore">Loja</Label>
                      <Select
                        value={newEmployeeStore}
                        onValueChange={setNewEmployeeStore}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma loja" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newEmployeePassword">Senha Inicial</Label>
                      <Input 
                        id="newEmployeePassword" 
                        placeholder="Senha inicial"
                        value={newEmployeePassword}
                        onChange={(e) => setNewEmployeePassword(e.target.value)}
                        type="text"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleAddEmployee}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Funcionário
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Lista de Funcionários</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="employeeStoreFilter" className="text-sm">Filtrar por Loja:</Label>
                      <Select
                        value={employeeStoreFilter}
                        onValueChange={setEmployeeStoreFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Todas as Lojas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as Lojas</SelectItem>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>ID/Matrícula</TableHead>
                          <TableHead>Loja</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredEmployees().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              Nenhum funcionário encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          getFilteredEmployees().map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell className="font-medium">{employee.name}</TableCell>
                              <TableCell>{employee.id}</TableCell>
                              <TableCell>{getStoreName(employee.storeId)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditEmployeeModal(employee)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      setEmployeeToDelete(employee);
                                      setShowDeleteEmployeeAlert(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Payslip Management Tab */}
            <TabsContent value="payslips" className="animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="mr-2 h-5 w-5 text-primary-500" /> 
                      Adicionar Holerite
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payslipStore">Loja</Label>
                      <Select
                        value={payslipStore}
                        onValueChange={setPayslipStore}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma loja" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payslipEmployee">Funcionário</Label>
                      <Select
                        value={payslipEmployee}
                        onValueChange={setPayslipEmployee}
                        disabled={!payslipStore}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um funcionário" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(e => e.storeId === payslipStore && !e.isAdmin)
                            .map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name} ({employee.id})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payslipMonth">Mês/Ano</Label>
                      <Input 
                        id="payslipMonth" 
                        type="month"
                        value={payslipMonth}
                        onChange={(e) => setPayslipMonth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payslipLink">Link do PDF (Google Drive)</Label>
                      <Input 
                        id="payslipLink" 
                        placeholder="Cole o link compartilhado"
                        value={payslipLink}
                        onChange={(e) => setPayslipLink(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        No Drive, clique em "Compartilhar" → "Qualquer pessoa com o link"
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleAddPayslip}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Holerite
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Holerites Cadastrados</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="payslipListStoreFilter" className="text-sm">Filtrar por Loja:</Label>
                      <Select
                        value={payslipStoreFilter}
                        onValueChange={setPayslipStoreFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Todas as Lojas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as Lojas</SelectItem>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Loja</TableHead>
                            <TableHead>Funcionário</TableHead>
                            <TableHead>Mês/Ano</TableHead>
                            <TableHead>Arquivo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredPayslips().length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                Nenhum holerite encontrado
                              </TableCell>
                            </TableRow>
                          ) : (
                            getFilteredPayslips().map((payslip) => (
                              <TableRow key={payslip.id}>
                                <TableCell>{getStoreName(payslip.storeId)}</TableCell>
                                <TableCell>{getEmployeeName(payslip.employeeId)}</TableCell>
                                <TableCell>{payslip.month}</TableCell>
                                <TableCell>
                                  <a 
                                    href={payslip.pdfLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:underline flex items-center"
                                  >
                                    Ver PDF <ChevronRight className="h-4 w-4" />
                                  </a>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      setPayslipToDelete(payslip);
                                      setShowDeletePayslipAlert(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Footer */}
        <footer className="w-full py-4 text-center text-sm text-gray-600 border-t">
          &copy; {new Date().getFullYear()} Arena Fit - Todos os direitos reservados
        </footer>
        
        {/* Edit Employee Modal */}
        <Dialog open={isEditEmployeeModalOpen} onOpenChange={setIsEditEmployeeModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Funcionário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editEmployeeName">Nome</Label>
                <Input 
                  id="editEmployeeName" 
                  placeholder="Nome do funcionário"
                  value={editEmployeeName}
                  onChange={(e) => setEditEmployeeName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmployeeStore">Loja</Label>
                <Select
                  value={editEmployeeStore}
                  onValueChange={setEditEmployeeStore}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma loja" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmployeePassword">
                  Nova Senha <span className="text-sm text-muted-foreground">(deixe em branco para manter a atual)</span>
                </Label>
                <Input 
                  id="editEmployeePassword" 
                  placeholder="Nova senha"
                  value={editEmployeePassword}
                  onChange={(e) => setEditEmployeePassword(e.target.value)}
                  type="text"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsEditEmployeeModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEmployeeChanges}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Alerts */}
        <AlertDialog open={showDeleteStoreAlert} onOpenChange={setShowDeleteStoreAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a loja "{storeToDelete?.name}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground"
                onClick={confirmDeleteStore}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog open={showDeleteEmployeeAlert} onOpenChange={setShowDeleteEmployeeAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o funcionário "{employeeToDelete?.name}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground"
                onClick={confirmDeleteEmployee}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog open={showDeletePayslipAlert} onOpenChange={setShowDeletePayslipAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este holerite?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground"
                onClick={confirmDeletePayslip}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  
  // Employee view
  if (currentView === 'employee') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-primary-600 text-white px-6 py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.ibb.co/k6QPjdV0/logo-1.png" 
                alt="Arena Fit" 
                className="h-12"
              />
              <div>
                <h1 className="text-xl font-bold">Portal do Funcionário</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary-700 text-white border-primary-400">
                    {getStoreName(currentUser.storeId)}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <User className="mr-2 h-6 w-6 text-primary-500" />
              Bem-vindo, {currentUser.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payslips Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary-500" />
                  Seus Holerites
                </CardTitle>
                <div className="flex items-center">
                  <Label htmlFor="employeeMonthFilter" className="text-sm mr-2">
                    Filtrar:
                  </Label>
                  <Select 
                    value={employeeMonthFilter} 
                    onValueChange={setEmployeeMonthFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todos os meses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os meses</SelectItem>
                      {getUniqueMonths().map(month => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês/Ano</TableHead>
                      <TableHead>Link</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getEmployeePayslips().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                          Nenhum holerite disponível
                        </TableCell>
                      </TableRow>
                    ) : (
                      getEmployeePayslips().map((payslip) => (
                        <TableRow key={payslip.id}>
                          <TableCell className="font-medium">
                            {payslip.month}
                          </TableCell>
                          <TableCell>
                            <a 
                              href={payslip.pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:underline flex items-center"
                            >
                              Abrir PDF <ChevronRight className="h-4 w-4" />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Password Change Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5 text-primary-500" />
                  Alterar Senha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input 
                    id="currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPasswordChange">Nova Senha</Label>
                  <Input 
                    id="newPasswordChange"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={newPasswordChange}
                    onChange={(e) => setNewPasswordChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPasswordChange">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmPasswordChange"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmPasswordChange}
                    onChange={(e) => setConfirmPasswordChange(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword}>
                  Alterar Senha
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="w-full py-4 text-center text-sm text-gray-600 border-t mt-auto">
          &copy; {new Date().getFullYear()} Arena Fit - Todos os direitos reservados
        </footer>
      </div>
    );
  }
  
  return null;
};

export default Index;

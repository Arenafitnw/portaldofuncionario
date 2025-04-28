
import React, { useState } from 'react';
import { toast } from "sonner";
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Key, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Employee {
  id: string;
  name: string;
  password: string;
  isAdmin: boolean;
  storeId: string;
}

interface Store {
  id: string;
  name: string;
  employeeCount: number;
}

interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  pdfLink: string;
  storeId: string;
}

interface EmployeePanelProps {
  currentUser: Employee;
  stores: Store[];
  payslips: Payslip[];
  employees: Employee[];
  saveData: (stores: Store[], employees: Employee[], payslips: Payslip[]) => Promise<boolean>;
  onLogout: () => void;
}

const EmployeePanel: React.FC<EmployeePanelProps> = ({ 
  currentUser, stores, payslips, employees, saveData, onLogout 
}) => {
  const [employeeMonthFilter, setEmployeeMonthFilter] = useState('all');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPasswordChange, setNewPasswordChange] = useState('');
  const [confirmPasswordChange, setConfirmPasswordChange] = useState('');

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
  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Desconhecida';
  };

  // Change password
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
      setCurrentPassword('');
      setNewPasswordChange('');
      setConfirmPasswordChange('');
      toast.success("Senha alterada com sucesso");
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <Tabs defaultValue="payslips" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="payslips" className="flex items-center">
            <ExternalLink className="mr-2 h-4 w-4" /> Meus Holerites
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" /> Meu Perfil
          </TabsTrigger>
        </TabsList>
        
        {/* Payslips Tab */}
        <TabsContent value="payslips" className="animate-fadeIn">
          <Card>
            <CardHeader>
              <CardTitle>Meus Holerites</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="employeeMonthFilter" className="text-sm">Filtrar por mês:</Label>
                <Select
                  value={employeeMonthFilter}
                  onValueChange={setEmployeeMonthFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos os meses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os meses</SelectItem>
                    {getUniqueMonths().map((month) => (
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
                    <TableHead>Mês</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEmployeePayslips().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                        Nenhum holerite encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    getEmployeePayslips().map((payslip) => (
                      <TableRow key={payslip.id}>
                        <TableCell className="font-medium">{payslip.month}</TableCell>
                        <TableCell>
                          <a 
                            href={payslip.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            Ver Holerite <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Funcionário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Nome:</span>
                  <span className="font-medium">{currentUser?.name}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">ID/Matrícula:</span>
                  <span className="font-medium">{currentUser?.id}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Loja:</span>
                  <Badge variant="outline" className="w-fit">
                    {getStoreName(currentUser?.storeId)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
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
                    placeholder="Digite a nova senha"
                    value={newPasswordChange}
                    onChange={(e) => setNewPasswordChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPasswordChange">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmPasswordChange" 
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirmPasswordChange}
                    onChange={(e) => setConfirmPasswordChange(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleChangePassword}
                  className="w-full mt-2"
                >
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeePanel;


import React, { useState } from 'react';
import { toast } from "sonner";
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Trash2 } from "lucide-react";

interface Store {
  id: string;
  name: string;
  employeeCount: number;
}

interface Employee {
  id: string;
  name: string;
  password: string;
  isAdmin: boolean;
  storeId: string;
}

interface EmployeeManagementProps {
  stores: Store[];
  employees: Employee[];
  payslips: any[];
  saveData: (stores: Store[], employees: Employee[], payslips: any[]) => Promise<boolean>;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ 
  stores, employees, payslips, saveData 
}) => {
  const [employeeStoreFilter, setEmployeeStoreFilter] = useState('all');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newEmployeeStore, setNewEmployeeStore] = useState('');
  const [newEmployeePassword, setNewEmployeePassword] = useState('');
  
  // Edit Employee Modal
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editEmployeeName, setEditEmployeeName] = useState('');
  const [editEmployeeStore, setEditEmployeeStore] = useState('');
  const [editEmployeePassword, setEditEmployeePassword] = useState('');
  
  // Delete Employee Alert
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [showDeleteEmployeeAlert, setShowDeleteEmployeeAlert] = useState(false);

  // Get filtered employees
  const getFilteredEmployees = () => {
    return employeeStoreFilter === 'all'
      ? employees.filter(e => !e.isAdmin)
      : employees.filter(e => e.storeId === employeeStoreFilter && !e.isAdmin);
  };

  // Get store name by ID
  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Desconhecida';
  };

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
      setNewEmployeeName('');
      setNewEmployeeId('');
      setNewEmployeeStore('');
      setNewEmployeePassword('');
      toast.success("Funcionário adicionado com sucesso");
    }
  };
  
  // Open edit employee modal
  const openEditEmployeeModal = (employee: Employee) => {
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
      toast.success("Funcionário excluído com sucesso");
    }
    
    setShowDeleteEmployeeAlert(false);
  };

  return (
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

      {/* Edit Employee Modal */}
      <Dialog open={isEditEmployeeModalOpen} onOpenChange={setIsEditEmployeeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
              <Label htmlFor="editEmployeePassword">Nova Senha (opcional)</Label>
              <Input 
                id="editEmployeePassword" 
                placeholder="Deixe em branco para manter a senha atual"
                value={editEmployeePassword}
                onChange={(e) => setEditEmployeePassword(e.target.value)}
                type="text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEmployeeModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEmployeeChanges}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Employee Alert Dialog */}
      <AlertDialog open={showDeleteEmployeeAlert} onOpenChange={setShowDeleteEmployeeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Funcionário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o funcionário {employeeToDelete?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEmployee}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeeManagement;

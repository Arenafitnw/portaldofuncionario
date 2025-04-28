
import React, { useState, useEffect } from 'react';
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ExternalLink } from "lucide-react";

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

interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  pdfLink: string;
  storeId: string;
}

interface PayslipManagementProps {
  stores: Store[];
  employees: Employee[];
  payslips: Payslip[];
  saveData: (stores: Store[], employees: Employee[], payslips: Payslip[]) => Promise<boolean>;
}

const PayslipManagement: React.FC<PayslipManagementProps> = ({ 
  stores, employees, payslips, saveData 
}) => {
  const [payslipStoreFilter, setPayslipStoreFilter] = useState('all');
  const [payslipStore, setPayslipStore] = useState('');
  const [payslipEmployee, setPayslipEmployee] = useState('');
  const [payslipMonth, setPayslipMonth] = useState('');
  const [payslipLink, setPayslipLink] = useState('');
  
  // Delete Payslip Alert
  const [payslipToDelete, setPayslipToDelete] = useState<Payslip | null>(null);
  const [showDeletePayslipAlert, setShowDeletePayslipAlert] = useState(false);

  // Get filtered payslips
  const getFilteredPayslips = () => {
    return payslipStoreFilter === 'all'
      ? payslips
      : payslips.filter(p => p.storeId === payslipStoreFilter);
  };

  // Get store name by ID
  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Desconhecida';
  };
  
  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Desconhecido';
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
      toast.success("Holerite excluído com sucesso");
    }
    
    setShowDeletePayslipAlert(false);
  };

  return (
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
                  .filter(e => !e.isAdmin && (!payslipStore || e.storeId === payslipStore))
                  .map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
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
            <Label htmlFor="payslipLink">Link do Google Drive</Label>
            <Input 
              id="payslipLink" 
              placeholder="Link do PDF do holerite"
              value={payslipLink}
              onChange={(e) => setPayslipLink(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Cole o link de compartilhamento do Google Drive
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleAddPayslip}
            className="w-full"
            disabled={!payslipStore || !payslipEmployee || !payslipMonth || !payslipLink}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Holerite
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Lista de Holerites</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="payslipStoreFilter" className="text-sm">Filtrar por Loja:</Label>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Link</TableHead>
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
                    <TableCell className="font-medium">{getEmployeeName(payslip.employeeId)}</TableCell>
                    <TableCell>{getStoreName(payslip.storeId)}</TableCell>
                    <TableCell>{payslip.month}</TableCell>
                    <TableCell>
                      <a 
                        href={payslip.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        Ver <ExternalLink className="ml-1 h-3 w-3" />
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
        </CardContent>
      </Card>

      {/* Delete Payslip Alert Dialog */}
      <AlertDialog open={showDeletePayslipAlert} onOpenChange={setShowDeletePayslipAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Holerite</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este holerite? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePayslip}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayslipManagement;

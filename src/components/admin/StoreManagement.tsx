
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
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

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

interface StoreManagementProps {
  stores: Store[];
  employees: Employee[];
  payslips: any[];
  saveData: (stores: Store[], employees: Employee[], payslips: any[]) => Promise<boolean>;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ 
  stores, employees, payslips, saveData 
}) => {
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCode, setNewStoreCode] = useState('');
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [showDeleteStoreAlert, setShowDeleteStoreAlert] = useState(false);

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
      setNewStoreName('');
      setNewStoreCode('');
      toast.success("Loja adicionada com sucesso");
    }
  };
  
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
      toast.success("Loja excluída com sucesso");
    }
    
    setShowDeleteStoreAlert(false);
  };

  return (
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

      {/* Delete Store Alert Dialog */}
      <AlertDialog open={showDeleteStoreAlert} onOpenChange={setShowDeleteStoreAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Loja</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a loja {storeToDelete?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStore}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoreManagement;

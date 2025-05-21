
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Mail, Phone, Briefcase, Edit, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditSalary } from "./EditSalary";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Chef' | 'Serveur';
  salary: number;
  tempPassword?: string;
}

export const EmployeeList = ({ employees, onMessageSent }: { 
  employees: Employee[],
  onMessageSent?: () => void
}) => {
  const [editingSalary, setEditingSalary] = useState<Employee | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Prénom</TableHead>
              <TableHead className="w-[180px]">Nom</TableHead>
              <TableHead className="w-[220px]">Email</TableHead>
              <TableHead className="w-[160px]">Téléphone</TableHead>
              <TableHead className="w-[120px]">Rôle</TableHead>
              <TableHead className="w-[140px]">Salaire (DZD)</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Aucun employé trouvé. Ajoutez votre premier employé.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{employee.firstName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate max-w-[180px]">{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{employee.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{employee.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{employee.salary} DZD/mois</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingSalary(employee)}
                      title="Modifier le salaire"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {editingSalary && (
        <Dialog open={!!editingSalary} onOpenChange={(open) => !open && setEditingSalary(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le salaire</DialogTitle>
            </DialogHeader>
            <EditSalary 
              employee={editingSalary} 
              onClose={() => setEditingSalary(null)}
              onSuccess={() => {
                setEditingSalary(null);
                if (onMessageSent) onMessageSent();
              }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

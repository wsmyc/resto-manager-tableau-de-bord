
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Mail, Phone, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MessageEmployee } from "./MessageEmployee";
import { useState } from "react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Chef' | 'Serveur';
  salary: number;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@restaurant.fr",
    phone: "06 12 34 56 78",
    role: "Chef",
    salary: 2800
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Laurent",
    email: "marie.laurent@restaurant.fr",
    phone: "06 98 76 54 32",
    role: "Serveur",
    salary: 1800
  },
];

export const EmployeeList = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Salaire (€)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {employee.firstName}
                </TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {employee.email}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {employee.phone}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {employee.role}
                </TableCell>
                <TableCell>{employee.salary} €/mois</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedEmployee && (
        <MessageEmployee
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

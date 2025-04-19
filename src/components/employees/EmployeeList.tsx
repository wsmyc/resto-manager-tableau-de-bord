
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Mail, Phone, Briefcase } from 'lucide-react';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'Chef' | 'Serveur';
  salary: number;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    fullName: "Jean Dupont",
    email: "jean.dupont@restaurant.fr",
    phone: "06 12 34 56 78",
    role: "Chef",
    salary: 2800
  },
  {
    id: 2,
    fullName: "Marie Laurent",
    email: "marie.laurent@restaurant.fr",
    phone: "06 98 76 54 32",
    role: "Serveur",
    salary: 1800
  },
];

export const EmployeeList = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom Complet</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Salaire (€)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {employee.fullName}
              </TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

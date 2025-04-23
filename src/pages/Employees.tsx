
import { useState } from 'react';
import { EmployeeList, Employee } from '@/components/employees/EmployeeList';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

const Employees = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
    setIsDialogOpen(false);
  };

  const handleMessageSent = () => {
    // Cette fonction peut être utilisée pour rafraîchir les données si nécessaire
    console.log("Message envoyé ou données mises à jour");
  };

  // Mise à jour du salaire d'un employé
  const handleSalaryUpdate = (updatedEmployee: Employee) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-restaurant-primary">Gestion des Employés</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-restaurant-accent hover:bg-restaurant-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Employé
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Ajouter un Nouvel Employé</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm onSuccess={handleAddEmployee} />
          </DialogContent>
        </Dialog>
      </div>
      <EmployeeList 
        employees={employees} 
        onMessageSent={handleMessageSent} 
      />
    </div>
  );
};

export default Employees;

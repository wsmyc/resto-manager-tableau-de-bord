
import { useState } from 'react';
import { EmployeeList } from '@/components/employees/EmployeeList';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Employees = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-restaurant-primary">Gestion des Employés</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-restaurant-accent hover:bg-restaurant-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Employé
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouvel Employé</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <EmployeeList />
    </div>
  );
};

export default Employees;

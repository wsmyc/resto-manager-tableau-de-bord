
import { useState } from 'react';
import { EmployeeList } from '@/components/employees/EmployeeList';
import { AddEmployeeForm } from '@/components/employees/AddEmployeeForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Employees = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <AddEmployeeForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <EmployeeList />
    </div>
  );
};

export default Employees;

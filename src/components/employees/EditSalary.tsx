
import { useState } from "react";
import { toast } from "sonner";
import { Employee } from "./EmployeeList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EditSalaryProps {
  employee: Employee;
  onClose: () => void;
  onSuccess: (updatedEmployee: Employee) => void;
}

export const EditSalary = ({ employee, onClose, onSuccess }: EditSalaryProps) => {
  const [salary, setSalary] = useState(employee.salary);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation de base
      if (salary < 0) {
        toast.error("Le salaire ne peut pas être négatif");
        return;
      }

      // Simuler une mise à jour de base de données
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedEmployee = {
        ...employee,
        salary
      };
      
      toast.success(`Le salaire de ${employee.firstName} ${employee.lastName} a été mis à jour`);
      console.log("Salaire mis à jour:", updatedEmployee);
      onSuccess(updatedEmployee);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du salaire:", error);
      toast.error("Erreur lors de la mise à jour du salaire");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employeeName">Employé</Label>
        <Input 
          id="employeeName" 
          value={`${employee.firstName} ${employee.lastName}`} 
          disabled 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currentSalary">Salaire actuel</Label>
        <Input 
          id="currentSalary" 
          value={`${employee.salary} €/mois`} 
          disabled 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newSalary">Nouveau salaire (€/mois)</Label>
        <Input 
          id="newSalary" 
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          min={0}
          step={100}
          required
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
};


import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Chef' | 'Serveur';
  salary: number;
}

interface MessageEmployeeProps {
  employee: Employee;
  onClose: () => void;
}

export const MessageEmployee = ({ employee, onClose }: MessageEmployeeProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }
    
    console.log(`Message envoyé à ${employee.firstName} ${employee.lastName}:`, message);
    toast.success("Message envoyé avec succès");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl">
            Envoyer un message à {employee.firstName} {employee.lastName}
          </DialogTitle>
          <DialogDescription className="mt-1">
            Le message sera envoyé directement à l'employé par email et notification.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Textarea
            placeholder="Écrivez votre message ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] w-full resize-none focus:border-restaurant-accent"
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSendMessage}
              className="bg-restaurant-accent hover:bg-restaurant-accent/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

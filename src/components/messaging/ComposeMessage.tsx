
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, X } from "lucide-react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

interface ComposeMessageProps {
  employees: Employee[];
  onSend: (recipientId: number, content: string) => void;
  onCancel: () => void;
}

export const ComposeMessage = ({ employees, onSend, onCancel }: ComposeMessageProps) => {
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientId && content.trim()) {
      onSend(recipientId, content.trim());
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-semibold">Nouveau Message</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-4 flex flex-col">
        <div className="mb-4">
          <Label htmlFor="recipient">Destinataire</Label>
          <Select onValueChange={(value) => setRecipientId(Number(value))}>
            <SelectTrigger id="recipient">
              <SelectValue placeholder="Sélectionner un destinataire" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.firstName} {employee.lastName} ({employee.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex-1">
          <Label htmlFor="content">Message</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre message ici..."
            className="h-[calc(100%-30px)] min-h-[200px]"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!recipientId || !content.trim()}
            className="flex items-center"
          >
            <Send className="h-5 w-5 mr-2" />
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
};

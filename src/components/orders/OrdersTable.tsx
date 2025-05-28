
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { toast } from "sonner";

interface OrderItem {
  platName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "En attente" | "Lancée" | "Annulée";
  time: string;
  tableNumber: string;
}

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: Order["status"]) => void;
  isChef?: boolean;
}

const OrdersTable = ({ orders, onStatusChange, isChef = false }: OrdersTableProps) => {
  // Handle status change directly with Firebase
  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      // Map UI status to Firebase status
      let firestoreStatus;
      switch (newStatus) {
        case "Lancée":
          firestoreStatus = "confirmee";
          break;
        case "Annulée":
          firestoreStatus = "annulee";
          break;
        default:
          firestoreStatus = "en_attente";
      }
      
      // Update the order in Firestore
      const orderRef = doc(db, "commandes", orderId);
      await updateDoc(orderRef, {
        etat: firestoreStatus
      });
      
      // Call the prop callback
      onStatusChange(orderId, newStatus);
      
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Impossible de mettre à jour le statut");
    }
  };

  const formatItems = (items: OrderItem[]): string => {
    return items.map(item => `${item.platName} (x${item.quantity})`).join(", ");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom du Client</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                Aucune commande trouvée
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.tableNumber}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={formatItems(order.items)}>
                    {formatItems(order.items)}
                  </div>
                </TableCell>
                <TableCell>{order.total.toFixed(2)} DZD</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{order.time}</TableCell>
                <TableCell>
                  {isChef ? (
                    <Select 
                      defaultValue={order.status} 
                      onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Lancée">Lancée</SelectItem>
                        <SelectItem value="Annulée">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(order.id, "Annulée")}
                        disabled={order.status === "Annulée"}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(order.id, "Lancée")}
                        disabled={order.status === "Lancée"}
                      >
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;

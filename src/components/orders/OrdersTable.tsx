
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db, logDebug } from "@/services/firebase";
import { toast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: "En attente" | "Lancée" | "Annulée";
  time: string;
  tableNumber: string;
  server: string;
}

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: Order["status"]) => void;
  isChef?: boolean;
}

const OrdersTable = ({ orders, onStatusChange, isChef = false }: OrdersTableProps) => {
  const [firebaseOrders, setFirebaseOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time orders listener
    const q = query(collection(db, 'commandes'), orderBy('dateCreation', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      async (snapshot) => {
        try {
          // Array to store processed orders
          const ordersData: Order[] = [];
          
          for (const docSnap of snapshot.docs) {
            const commandeData = docSnap.data();
            
            // Get items for this order from commande_plat collection
            const orderItemsQuery = query(
              collection(db, 'commande_plats')
            );
            
            let orderItems: string[] = [];
            let orderTotal = commandeData.montant || 0;
            
            try {
              // For simplicity, we're just displaying order ID for now
              orderItems = [`Commande #${docSnap.id.substring(0, 4)}`];
            } catch (error) {
              console.error("Error fetching order items:", error);
              orderItems = ["Erreur de chargement"];
            }
            
            // Map Firebase status to our UI status
            let status: Order["status"] = "En attente";
            switch (commandeData.etat) {
              case "confirmed":
              case "confirmee":
              case "en_preparation":
              case "prete":
              case "servie":
                status = "Lancée";
                break;
              case "cancelled":
              case "annulee":
                status = "Annulée";
                break;
              default:
                status = "En attente";
            }
            
            // Format the time
            const timestamp = commandeData.dateCreation?.toDate();
            const timeString = timestamp 
              ? timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : 'N/A';
            
            // Add to orders array
            ordersData.push({
              id: docSnap.id,
              customerName: commandeData.idC || "Client inconnu",
              items: orderItems,
              total: orderTotal,
              status: status,
              time: timeString,
              tableNumber: commandeData.idTable || "N/A",
              server: commandeData.serveur || "N/A"
            });
          }
          
          setFirebaseOrders(ordersData);
          setLoading(false);
          logDebug("Orders fetched successfully", ordersData.length);
        } catch (error) {
          console.error("Error processing orders:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les commandes",
            variant: "destructive"
          });
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to orders:", error);
        toast({
          title: "Erreur de connexion",
          description: "Vérifiez votre connexion Firebase",
          variant: "destructive"
        });
        setLoading(false);
      }
    );
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle status change directly with Firebase
  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      // Map UI status to Firebase status
      let firestoreStatus;
      switch (newStatus) {
        case "Lancée":
          firestoreStatus = "confirmee"; // Using French status names to match your schema
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
      
      toast({
        title: "Statut mis à jour",
        description: `Commande ${orderId.substring(0, 4)} est maintenant ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  // Determine which orders to display - from props or from Firebase
  const displayOrders = firebaseOrders.length > 0 ? firebaseOrders : orders;

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Chargement des commandes...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom du Client</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Serveur</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            ) : (
              displayOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.tableNumber}</TableCell>
                  <TableCell>{order.server}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {order.items.join(", ")}
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
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrdersTable;

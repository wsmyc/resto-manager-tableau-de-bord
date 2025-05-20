
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderFilters from "@/components/orders/OrderFilters";
import OrdersTable from "@/components/orders/OrdersTable";
import { db, logDebug } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

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

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Setup real-time listener for orders
    setIsLoading(true);
    
    const q = query(
      collection(db, 'commandes'),
      orderBy('dateCreation', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const ordersData: Order[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Map Firebase status to our UI status
            let status: Order["status"] = "En attente";
            switch (data.etat) {
              case "confirmed":
              case "confirmee":
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
            const timestamp = data.dateCreation?.toDate();
            const timeString = timestamp 
              ? timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : 'N/A';
            
            ordersData.push({
              id: doc.id,
              customerName: data.idC || "Client inconnu",
              items: [`Commande #${doc.id.substring(0, 4)}`],
              total: data.montant || 0,
              status: status,
              time: timeString,
              tableNumber: data.idTable || "N/A",
              server: "Non assigné" // This could be fetched from employes collection if needed
            });
          });
          
          setOrders(ordersData);
          setIsLoading(false);
          logDebug("Orders fetched successfully", ordersData.length);
        } catch (error) {
          console.error("Error processing orders:", error);
          toast.error("Erreur lors du chargement des commandes");
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to orders:", error);
        toast.error("Erreur de connexion à la base de données");
        setIsLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    // This function is handled in the OrdersTable component directly
    // through the Firebase update mechanism
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.server.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-restaurant-primary">Commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
          />

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-accent"></div>
              <p className="mt-2 text-restaurant-primary">Chargement des commandes...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium text-lg text-restaurant-primary">Aucune commande trouvée</h3>
              <p className="text-gray-500 mt-1">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          ) : (
            <OrdersTable
              orders={filteredOrders}
              onStatusChange={updateOrderStatus}
              isChef={false} // Set to true for chef view, false for manager
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

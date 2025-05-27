
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderFilters from "@/components/orders/OrderFilters";
import OrdersTable from "@/components/orders/OrdersTable";
import { db, logDebug } from "@/services/firebase";
import { collection, onSnapshot, query, orderBy, getDocs, where, doc, getDoc } from "firebase/firestore";

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

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Function to get client name from clients collection
  const getClientName = async (clientId: string): Promise<string> => {
    try {
      const clientDoc = await getDoc(doc(db, 'clients', clientId));
      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        return clientData.name || "Client inconnu";
      }
      return "Client inconnu";
    } catch (error) {
      console.error("Error fetching client:", error);
      return "Client inconnu";
    }
  };

  // Function to get plat details from plats collection
  const getPlatDetails = async (platId: string): Promise<{ nom: string; prix: number }> => {
    try {
      const platDoc = await getDoc(doc(db, 'plats', platId));
      if (platDoc.exists()) {
        const platData = platDoc.data();
        return {
          nom: platData.nom || "Plat inconnu",
          prix: platData.prix || 0
        };
      }
      return { nom: "Plat inconnu", prix: 0 };
    } catch (error) {
      console.error("Error fetching plat:", error);
      return { nom: "Plat inconnu", prix: 0 };
    }
  };

  // Function to get order items from commandes_plat collection
  const getOrderItems = async (orderId: string): Promise<{ items: OrderItem[]; calculatedTotal: number }> => {
    try {
      const q = query(
        collection(db, 'commandes_plat'),
        where('idCmd', '==', orderId)
      );
      const snapshot = await getDocs(q);
      
      const items: OrderItem[] = [];
      let calculatedTotal = 0;
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const platDetails = await getPlatDetails(data.idP);
        const itemTotal = platDetails.prix * data.quantite;
        
        items.push({
          platName: platDetails.nom,
          quantity: data.quantite,
          price: platDetails.prix,
          total: itemTotal
        });
        
        calculatedTotal += itemTotal;
      }
      
      return { items, calculatedTotal };
    } catch (error) {
      console.error("Error fetching order items:", error);
      return { items: [], calculatedTotal: 0 };
    }
  };

  useEffect(() => {
    // Setup real-time listener for orders
    setIsLoading(true);
    
    const q = query(
      collection(db, 'commandes'),
      orderBy('dateCreation', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const ordersData: Order[] = [];
          
          for (const doc of snapshot.docs) {
            const data = doc.data();
            
            // Get client name from clients collection
            const clientName = await getClientName(data.idC);
            
            // Get detailed items and calculated total from commandes_plat and plats
            const { items, calculatedTotal } = await getOrderItems(doc.id);
            
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
              customerName: clientName,
              items: items,
              total: calculatedTotal,
              status: status,
              time: timeString,
              tableNumber: data.idTable || "N/A"
            });
          }
          
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
              isChef={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

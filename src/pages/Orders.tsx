
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderFilters from "@/components/orders/OrderFilters";
import OrdersTable from "@/components/orders/OrdersTable";

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
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockedOrders: Order[] = [
          {
            id: "ORD-001",
            customerName: "Ahmed Mokhtar",
            items: ["Chorba Frik", "Kalb el Louz", "Thé à la Menthe"],
            total: 1050,
            status: "En attente",
            time: "14:30",
            tableNumber: "T01",
            server: "Fares Cherif"
          },
          {
            id: "ORD-002",
            customerName: "Meriem Boulmerka",
            items: ["Salade Mechouia", "Couscous Poulet", "Eau Minérale"],
            total: 1200,
            status: "En attente",
            time: "14:45",
            tableNumber: "T03",
            server: "Omar Benkirane"
          },
          {
            id: "ORD-003",
            customerName: "Karim Ziani",
            items: ["Bourek Viande", "Tagine Agneau Pruneaux", "Baklava", "Thé Vert Nature"],
            total: 4200,
            status: "Lancée",
            time: "14:15",
            tableNumber: "T05",
            server: "Kaouthar Bensalah"
          },
          {
            id: "ORD-004",
            customerName: "Souad Amidou",
            items: ["Shakshouka", "Ghribia"],
            total: 800,
            status: "Lancée",
            time: "13:50",
            tableNumber: "T02",
            server: "Fares Cherif"
          },
          {
            id: "ORD-005",
            customerName: "Hakim Medane",
            items: ["Bourek Fromage", "Assiette Mixte", "Makroud"],
            total: 3700,
            status: "Annulée",
            time: "14:00",
            tableNumber: "T07",
            server: "Omar Benkirane"
          },
          {
            id: "ORD-006",
            customerName: "Amina Belouizdad",
            items: ["Harira", "Couscous Merguez", "Baghrir"],
            total: 1800,
            status: "En attente",
            time: "15:00",
            tableNumber: "T04",
            server: "Kaouthar Bensalah"
          },
          {
            id: "ORD-007",
            customerName: "Djamel Haddadi",
            items: ["Salade Fattoush", "Brochette d'Agneau", "Zlabia"],
            total: 3050,
            status: "En attente",
            time: "15:15",
            tableNumber: "T06",
            server: "Omar Benkirane"
          },
          {
            id: "ORD-008",
            customerName: "Louisa Hanoune",
            items: ["Salade Tabbouleh", "Tagine Kefta", "Mhalbi"],
            total: 3750,
            status: "En attente",
            time: "15:30",
            tableNumber: "T08",
            server: "Fares Cherif"
          }
        ];
        setOrders(mockedOrders);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
        toast.error("Impossible de charger les commandes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    toast.success(`Commande ${orderId}: Statut mis à jour vers "${newStatus}"`);
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
              isChef={false} // Mettez à true pour le chef, false pour le manager
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

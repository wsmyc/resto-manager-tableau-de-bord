import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: "En attente" | "En préparation" | "Prêt" | "Livré" | "Annulé";
  time: string;
}

const OrderStatusBadge = ({ status }: { status: Order["status"] }) => {
  let color = "";
  switch (status) {
    case "En attente":
      color = "bg-yellow-500 hover:bg-yellow-600";
      break;
    case "En préparation":
      color = "bg-blue-500 hover:bg-blue-600";
      break;
    case "Prêt":
      color = "bg-green-500 hover:bg-green-600";
      break;
    case "Livré":
      color = "bg-gray-500 hover:bg-gray-600";
      break;
    case "Annulé":
      color = "bg-red-500 hover:bg-red-600";
      break;
  }

  return (
    <Badge className={`${color} text-white`}>{status}</Badge>
  );
};

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
            customer: "Jean Dupont",
            items: ["Bœuf Bourguignon", "Crème Brûlée", "Vin Rouge"],
            total: 42.50,
            status: "En préparation",
            time: "14:30"
          },
          {
            id: "ORD-002",
            customer: "Marie Lefebvre",
            items: ["Salade Niçoise", "Coq au Vin", "Eau Minérale"],
            total: 35.80,
            status: "En attente",
            time: "14:45"
          },
          {
            id: "ORD-003",
            customer: "Philippe Martin",
            items: ["Quiche Lorraine", "Ratatouille", "Tarte Tatin", "Vin Blanc"],
            total: 53.20,
            status: "Prêt",
            time: "14:15"
          },
          {
            id: "ORD-004",
            customer: "Sophie Bernard",
            items: ["Cassoulet", "Mousse au Chocolat"],
            total: 28.90,
            status: "Livré",
            time: "13:50"
          },
          {
            id: "ORD-005",
            customer: "Lucas Petit",
            items: ["Escargots", "Magret de Canard", "Tarte aux Pommes"],
            total: 45.60,
            status: "Annulé",
            time: "14:00"
          },
          {
            id: "ORD-006",
            customer: "Emma Dubois",
            items: ["Soupe à l'Oignon", "Steak Frites", "Crêpes Suzette"],
            total: 39.70,
            status: "En préparation",
            time: "15:00"
          },
          {
            id: "ORD-007",
            customer: "Thomas Leroy",
            items: ["Foie Gras", "Blanquette de Veau", "Éclair au Chocolat"],
            total: 58.30,
            status: "En attente",
            time: "15:15"
          },
          {
            id: "ORD-008",
            customer: "Camille Roux",
            items: ["Salade de Chèvre Chaud", "Bouillabaisse", "Tarte au Citron"],
            total: 47.90,
            status: "En préparation",
            time: "15:30"
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
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher une commande..."
                className="pl-10 input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-64">
              <Filter size={18} className="text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="En préparation">En préparation</SelectItem>
                  <SelectItem value="Prêt">Prêt</SelectItem>
                  <SelectItem value="Livré">Livré</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom du Client</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {order.items.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>{order.total.toFixed(2)}€</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>{order.time}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue placeholder="Changer le statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="En attente">En attente</SelectItem>
                            <SelectItem value="En préparation">En préparation</SelectItem>
                            <SelectItem value="Prêt">Prêt</SelectItem>
                            <SelectItem value="Livré">Livré</SelectItem>
                            <SelectItem value="Annulé">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

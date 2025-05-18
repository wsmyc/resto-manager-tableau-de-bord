import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Notification } from "@/services/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadNotifications = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in production this would come from the API
      const mockNotifications: Notification[] = [
        {
          id: "notif-001",
          type: "stock",
          title: "Stock bas - Attention",
          content: "Le stock de poulet est en dessous du seuil minimum (1.2kg restant).",
          timestamp: new Date(Date.now() - 3600000 * 2),
          read: false,
          actionRequired: false,
          data: {
            ingredientId: "ing-001"
          }
        },
        {
          id: "notif-002",
          type: "commande",
          title: "Demande d'annulation",
          content: "Le client a demandé l'annulation de la commande CMD-058 (en préparation).",
          timestamp: new Date(Date.now() - 3600000 * 5),
          read: false,
          actionRequired: true,
          data: {
            commandeId: "CMD-058"
          }
        },
        {
          id: "notif-003",
          type: "reservation",
          title: "Client en retard",
          content: "Le client de la réservation RSV-024 a plus de 20min de retard. Table 7 bloquée.",
          timestamp: new Date(Date.now() - 3600000 * 1),
          read: false,
          actionRequired: true,
          data: {
            reservationId: "RSV-024",
            tableId: "table-7"
          }
        },
        {
          id: "notif-004",
          type: "stock",
          title: "Stock bas - Urgent",
          content: "Le stock d'agneau est presque épuisé (0.5kg restant).",
          timestamp: new Date(Date.now() - 3600000 * 12),
          read: true,
          actionRequired: false,
          data: {
            ingredientId: "ing-002"
          }
        },
        {
          id: "notif-005",
          type: "commande",
          title: "Demande d'annulation",
          content: "Le client a demandé l'annulation de la commande CMD-062 (prête à servir).",
          timestamp: new Date(Date.now() - 3600000 * 6),
          read: false,
          actionRequired: true,
          data: {
            commandeId: "CMD-062"
          }
        },
        {
          id: "notif-006",
          type: "reservation",
          title: "Client absent",
          content: "Le client de la réservation RSV-031 n'est pas venu. Table 12 toujours bloquée.",
          timestamp: new Date(Date.now() - 3600000 * 8),
          read: true,
          actionRequired: true,
          data: {
            reservationId: "RSV-031",
            tableId: "table-12"
          }
        },
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    };
    
    loadNotifications();
  }, []);

  const handleNotificationRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const handleApproveAction = (notification: Notification) => {
    // In a real system, this would call an API to approve the action
    if (notification.type === 'commande') {
      toast.success(`Annulation de la commande ${notification.data?.commandeId} approuvée`);
    } else if (notification.type === 'reservation') {
      toast.success(`Table ${notification.data?.tableId} libérée`);
    }

    // Mark as read and remove actionRequired
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id 
          ? { ...n, read: true, actionRequired: false } 
          : n
      )
    );
  };

  const handleRejectAction = (notification: Notification) => {
    // In a real system, this would call an API to reject the action
    if (notification.type === 'commande') {
      toast.info(`Annulation de la commande ${notification.data?.commandeId} refusée`);
    } else if (notification.type === 'reservation') {
      toast.info(`Table ${notification.data?.tableId} maintenue réservée`);
    }

    // Mark as read and remove actionRequired
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id 
          ? { ...n, read: true, actionRequired: false } 
          : n
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'commande':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'reservation':
        return <Clock className="h-6 w-6 text-blue-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-2 text-restaurant-primary" />
              <CardTitle className="text-xl font-semibold text-restaurant-primary">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500">{unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}</Badge>
                )}
              </CardTitle>
            </div>
            {actionRequiredCount > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                {actionRequiredCount} action{actionRequiredCount > 1 ? 's' : ''} requise{actionRequiredCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none h-12 bg-gray-50">
                <TabsTrigger value="all" className="data-[state=active]:bg-white">Toutes</TabsTrigger>
                <TabsTrigger value="stock" className="data-[state=active]:bg-white">Stock</TabsTrigger>
                <TabsTrigger value="commande" className="data-[state=active]:bg-white">Commandes</TabsTrigger>
                <TabsTrigger value="reservation" className="data-[state=active]:bg-white">Réservations</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>
            <TabsContent value="stock" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>
            <TabsContent value="commande" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>
            <TabsContent value="reservation" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderNotificationList(notifications: Notification[]) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-accent"></div>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Aucune notification</h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'all' 
              ? "Vous n'avez aucune notification pour le moment." 
              : `Vous n'avez aucune notification de type ${activeTab}.`}
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
            onClick={() => handleNotificationRead(notification.id)}
          >
            <div className="flex">
              <div className="mr-4 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{notification.content}</p>
                
                {notification.actionRequired && (
                  <div className="mt-3 flex space-x-3">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApproveAction(notification)}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      {notification.type === 'commande' ? 'Approuver' : 'Libérer la table'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectAction(notification)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      {notification.type === 'commande' ? 'Refuser' : 'Maintenir réservée'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Notifications;

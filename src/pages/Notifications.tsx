import { useState, useEffect, Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Notification } from "@/services/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase"; // Adjust the path to your firebase.js
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc } from "firebase/firestore";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-500">
          <h3>Une erreur s'est produite dans le composant Notifications</h3>
          <p>{this.state.errorMessage}</p>
          <p>Veuillez vérifier la console pour plus de détails ou rafraîchir la page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface RawNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  priority?: string;
  related_id?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [notificationTypes, setNotificationTypes] = useState<string[]>(["all"]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log("Utilisateur non connecté");
          setError("Utilisateur non connecté. Veuillez vous connecter.");
          setIsLoading(false);
          return;
        }

        console.log("Utilisateur connecté, UID:", user.uid);

        // Fetch notifications from Firestore
        console.log("Lancement de la requête Firestore...");
        const q = query(
          collection(db, "notifications"),
          where("recipient_type", "==", "manager"),
          orderBy("created_at", "desc"),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        console.log("Résultat de la requête:", querySnapshot.size, "documents trouvés");

        if (querySnapshot.empty) {
          console.log("Aucun document trouvé avec recipient_type: 'manager'");
          setNotifications([]);
          setNotificationTypes(["all"]);
          setIsLoading(false);
          return;
        }

        const processedNotifications: Notification[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Données brutes pour ID", doc.id, ":", data);

          // Simplified date parsing with fallback
          const createdAtStr = data.created_at || "";
          let createdAtDate = new Date();
          try {
            if (createdAtStr) {
              const cleanedDate = createdAtStr.replace("UTC+1", "").trim();
              createdAtDate = new Date(cleanedDate);
              if (isNaN(createdAtDate.getTime())) {
                throw new Error("Date invalide");
              }
            } else {
              console.warn(`created_at manquant pour ${doc.id}, utilisation de la date actuelle`);
            }
          } catch (dateError) {
            console.warn(`Échec du parsing de created_at pour ${doc.id}: ${createdAtStr}, utilisation de la date actuelle`);
            createdAtDate = new Date();
          }

          return {
            id: doc.id,
            type: data.type || "unknown",
            title: data.title || "Sans titre",
            message: data.message || "Aucun message",
            created_at: createdAtDate.toISOString(),
            read: data.read === true, // Strict boolean check
            related_id: data.related_id || "",
            actionRequired: (data.type === "commande" || data.type === "reservation" || data.type === "cancellation_request") && !data.read,
            priority: data.priority as "normal" | "high" | undefined,
            data: {
              commandeId: (data.type === "commande" || data.type === "cancellation_request") ? data.related_id : undefined,
              reservationId: data.type === "reservation" ? data.related_id : undefined,
              tableId: data.type === "reservation" && data.message?.includes("Table") ? data.message.split("Table ")[1]?.split(" ")[0] : undefined,
            },
          };
        });

        // Extract unique notification types
        const types = ["all", ...new Set(processedNotifications.map(n => n.type))];
        console.log("Types de notifications détectés:", types);
        setNotificationTypes(types);
        setNotifications(processedNotifications);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        setError("Erreur lors du chargement des notifications: " + (error instanceof Error ? error.message : "Problème inconnu"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationRead = async (notificationId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("Utilisateur non connecté");
        return;
      }

      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true,
        read_at: new Date().toISOString(),
      });

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
      toast.success("Notification marquée comme lue");
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      toast.error("Erreur lors du marquage comme lu");
    }
  };

  const handleApproveAction = async (notification: Notification) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("Utilisateur non connecté");
        return;
      }

      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, {
        read: true,
        actionRequired: false,
        status: "accepted",
        updated_at: new Date().toISOString(),
      });

      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true, actionRequired: false } : n
        )
      );
      if (notification.type === "commande" || notification.type === "cancellation_request") {
        toast.success(`Annulation de la commande ${notification.data?.commandeId} approuvée`);
      } else if (notification.type === "reservation") {
        toast.success(`Table ${notification.data?.tableId} libérée`);
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleRejectAction = async (notification: Notification) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("Utilisateur non connecté");
        return;
      }

      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, {
        read: true,
        actionRequired: false,
        status: "refused",
        updated_at: new Date().toISOString(),
        motif_refus: "Refus standard",
      });

      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true, actionRequired: false } : n
        )
      );
      if (notification.type === "commande" || notification.type === "cancellation_request") {
        toast.info(`Annulation de la commande ${notification.data?.commandeId} refusée`);
      } else if (notification.type === "reservation") {
        toast.info(`Table ${notification.data?.tableId} maintenue réservée`);
      }
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      toast.error("Erreur lors du refus");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "stock":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "commande":
      case "cancellation_request":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "reservation":
        return <Clock className="h-6 w-6 text-blue-500" />;
      case "cancellation_accepted":
      case "cancellation_refused":
        return <Bell className="h-6 w-6 text-gray-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-6 w-6 mr-2 text-restaurant-primary" />
                <CardTitle className="text-xl font-semibold text-restaurant-primary">
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500">{unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}</Badge>
                  )}
                </CardTitle>
              </div>
              {actionRequiredCount > 0 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  {actionRequiredCount} action{actionRequiredCount > 1 ? "s" : ""} requise{actionRequiredCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="p-4 text-center text-red-500">{error}</div>
            )}
            {!error && (
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none h-12 bg-gray-50">
                    {notificationTypes.map((type) => (
                      <TabsTrigger key={type} value={type} className="data-[state=active]:bg-white capitalize">
                        {type === "all" ? "Toutes" : type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {notificationTypes.map((type) => (
                  <TabsContent key={type} value={type} className="mt-0">
                    {renderNotificationList(filteredNotifications.filter(n => type === "all" || n.type === type))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );

  function renderNotificationList(notifications: Notification[]) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-accent"></div>
        </div>
      );
    }

    if (notifications.length === 0 && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Aucune notification</h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "all"
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
            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
            onClick={() => handleNotificationRead(notification.id)}
          >
            <div className="flex">
              <div className="mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{notification.message}</p>

                {notification.actionRequired && (
                  <div className="mt-3 flex space-x-3">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApproveAction(notification)}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      {notification.type === "commande" || notification.type === "cancellation_request" ? "Approuver" : "Libérer la table"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectAction(notification)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      {notification.type === "commande" || notification.type === "cancellation_request" ? "Refuser" : "Maintenir réservée"}
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
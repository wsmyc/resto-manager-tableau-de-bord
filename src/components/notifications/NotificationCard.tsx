
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Bell, Clock, Package, ShoppingCart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Notification } from "@/services/types";
import { toast } from "sonner";

interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onAction: (id: string, action: 'approve' | 'reject', type: 'commande' | 'reservation') => void;
}

export const NotificationCard = ({ notification, onRead, onAction }: NotificationCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      await onAction(notification.id, action, notification.type as 'commande' | 'reservation');
      
      if (action === 'approve') {
        if (notification.type === 'commande') {
          toast.success(`Annulation de la commande ${notification.data?.commandeId} approuvée`);
        } else {
          toast.success(`Table ${notification.data?.tableId} libérée`);
        }
      } else {
        if (notification.type === 'commande') {
          toast.info(`Annulation de la commande ${notification.data?.commandeId} refusée`);
        } else {
          toast.info(`Table ${notification.data?.tableId} maintenue réservée`);
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'action");
      console.error("Action error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'stock':
        return <Package className="h-6 w-6 text-amber-500" />;
      case 'commande':
        return <ShoppingCart className="h-6 w-6 text-red-500" />;
      case 'reservation':
        return <Clock className="h-6 w-6 text-blue-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Card 
      className={`p-4 mb-2 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <div className="flex">
        <div className="mr-4 mt-1">
          {getNotificationIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">{notification.title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: fr })}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{notification.content}</p>
          
          {notification.actionRequired && (
            <div className="mt-3 flex space-x-3">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => { e.stopPropagation(); handleAction('approve'); }}
                disabled={isProcessing}
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                {notification.type === 'commande' ? 'Approuver' : 'Libérer la table'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => { e.stopPropagation(); handleAction('reject'); }}
                disabled={isProcessing}
              >
                <XCircle className="mr-1 h-4 w-4" />
                {notification.type === 'commande' ? 'Refuser' : 'Maintenir réservée'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

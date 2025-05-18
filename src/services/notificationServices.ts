
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { Notification } from './types';

// Fetch all notifications
export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const notificationsCollection = collection(db, "notifications");
    const snapshot = await getDocs(notificationsCollection);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        content: data.content,
        timestamp: (data.timestamp as Timestamp).toDate(),
        read: data.read || false,
        actionRequired: data.actionRequired || false,
        data: data.data || {}
      } as Notification;
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Handle notification action (approve or reject)
export async function handleNotificationAction(
  notificationId: string, 
  action: 'approve' | 'reject', 
  type: 'commande' | 'reservation'
): Promise<void> {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
      actionRequired: false,
      actionTaken: action,
      actionTimestamp: Timestamp.now()
    });
    
    // Get notification to access related data
    const notificationDoc = await doc(db, "notifications", notificationId).get();
    const notificationData = notificationDoc.data();
    
    if (type === 'commande' && notificationData?.data?.commandeId) {
      // Update commande status if command cancellation was approved
      if (action === 'approve') {
        const commandeRef = doc(db, "commandes", notificationData.data.commandeId);
        await updateDoc(commandeRef, {
          etat: 'cancelled'
        });
      }
    } else if (type === 'reservation' && notificationData?.data?.tableId) {
      // Update table status if table release was approved
      if (action === 'approve') {
        const tableRef = doc(db, "tables", notificationData.data.tableId);
        await updateDoc(tableRef, {
          status: 'available'
        });
        
        if (notificationData?.data?.reservationId) {
          const reservationRef = doc(db, "reservations", notificationData.data.reservationId);
          await updateDoc(reservationRef, {
            status: 'cancelled'
          });
        }
      }
    }
  } catch (error) {
    console.error("Error handling notification action:", error);
    throw error;
  }
}

// Get unread notifications count
export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const notificationsCollection = collection(db, "notifications");
    const unreadQuery = query(notificationsCollection, where("read", "==", false));
    const snapshot = await getDocs(unreadQuery);
    return snapshot.docs.length;
  } catch (error) {
    console.error("Error getting unread notifications count:", error);
    return 0;
  }
}

// Get notifications that require action
export async function getActionRequiredNotifications(): Promise<Notification[]> {
  try {
    const notificationsCollection = collection(db, "notifications");
    const actionQuery = query(notificationsCollection, where("actionRequired", "==", true));
    const snapshot = await getDocs(actionQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        content: data.content,
        timestamp: (data.timestamp as Timestamp).toDate(),
        read: data.read || false,
        actionRequired: true,
        data: data.data || {}
      } as Notification;
    });
  } catch (error) {
    console.error("Error fetching action required notifications:", error);
    return [];
  }
}

// Mock notifications for development
export function getMockNotifications(): Notification[] {
  const now = new Date();
  
  return [
    {
      id: "notif-001",
      type: "stock",
      title: "Stock bas - Attention",
      content: "Le stock de poulet est en dessous du seuil minimum (1.2kg restant).",
      timestamp: new Date(now.getTime() - 3600000 * 2),
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
      timestamp: new Date(now.getTime() - 3600000 * 5),
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
      timestamp: new Date(now.getTime() - 3600000 * 1),
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
      timestamp: new Date(now.getTime() - 3600000 * 12),
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
      timestamp: new Date(now.getTime() - 3600000 * 6),
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
      timestamp: new Date(now.getTime() - 3600000 * 8),
      read: true,
      actionRequired: true,
      data: {
        reservationId: "RSV-031",
        tableId: "table-12"
      }
    },
  ];
}

// src/dataService.ts

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData,
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, logDebug } from './firebase';
import type {
  commandes,
  Reservation,
  Ingredient,
  Employe,
  Plat,
  SalesBySubcategory,
  commandePlat
} from './types';

/////////////////////////
// 1. Commandes totales
/////////////////////////
export async function getTotalOrders(): Promise<number> {
  try {
    const snap = await getDocs(collection(db, 'commandes'));
    logDebug('getTotalOrders: retrieved orders count', snap.size);
    return snap.size;
  } catch (error) {
    logDebug('Error retrieving total orders', error);
    return 0;
  }
}

// Real-time version for listening to orders count changes
export function listenToTotalOrders(callback: (count: number) => void): () => void {
  const ordersRef = collection(db, 'commandes');
  
  const unsubscribe = onSnapshot(ordersRef, 
    (snapshot) => {
      callback(snapshot.size);
      logDebug('listenToTotalOrders: received update', snapshot.size);
    },
    (error) => {
      logDebug('Error listening to total orders', error);
      callback(0);
    }
  );
  
  return unsubscribe;
}

/////////////////////////
// 2. Réservations actives
/////////////////////////
export async function getActiveReservations(): Promise<Reservation[]> {
  try {
    const q = query(
      collection(db, 'reservations'),
      where('status', '==', 'confirmed')
    );
    const snap = await getDocs(q);
    const reservations = snap.docs.map(docSnap => {
      const d = docSnap.data() as DocumentData;
      return {
        idRes:      docSnap.id,
        client_id:  d.client_id    as string,
        created_at: d.created_at   as Timestamp,
        date_time:  d.date_time    as Timestamp,
        party_size: d.party_size   as number,
        status:     d.status       as 'pending' | 'confirmed' | 'cancelled',
        table_id:   d.table_id     as string
      };
    });
    logDebug('getActiveReservations: retrieved active reservations', reservations.length);
    return reservations;
  } catch (error) {
    logDebug('Error retrieving active reservations', error);
    return [];
  }
}

// Real-time version for listening to active reservations
export function listenToActiveReservations(callback: (reservations: Reservation[]) => void): () => void {
  const q = query(
    collection(db, 'reservations'),
    where('status', '==', 'confirmed')
  );
  
  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const reservations = snapshot.docs.map(docSnap => {
        const d = docSnap.data() as DocumentData;
        return {
          idRes:      docSnap.id,
          client_id:  d.client_id    as string,
          created_at: d.created_at   as Timestamp,
          date_time:  d.date_time    as Timestamp,
          party_size: d.party_size   as number,
          status:     d.status       as 'pending' | 'confirmed' | 'cancelled',
          table_id:   d.table_id     as string
        };
      });
      callback(reservations);
      logDebug('listenToActiveReservations: received update', reservations.length);
    },
    (error) => {
      logDebug('Error listening to active reservations', error);
      callback([]);
    }
  );
  
  return unsubscribe;
}

/////////////////////////
// 3. Revenus cette semaine
/////////////////////////
export async function getRevenueThisWeek(): Promise<number> {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'commandes'),
      where('dateCreation', '>=', Timestamp.fromDate(start)),
      where('etat', '==', 'confirmed')
    );
    const snap = await getDocs(q);
    const totalRevenue = snap.docs.reduce((sum, docSnap) => {
      const d = docSnap.data() as DocumentData;
      return sum + (d.montant as number);
    }, 0);
    
    logDebug('getRevenueThisWeek: retrieved weekly revenue', totalRevenue);
    return totalRevenue;
  } catch (error) {
    logDebug('Error retrieving weekly revenue', error);
    return 0;
  }
}

// Real-time version for listening to weekly revenue
export function listenToWeeklyRevenue(callback: (revenue: number) => void): () => void {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  
  const q = query(
    collection(db, 'commandes'),
    where('dateCreation', '>=', Timestamp.fromDate(start)),
    where('etat', '==', 'confirmed')
  );
  
  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const totalRevenue = snapshot.docs.reduce((sum, docSnap) => {
        const d = docSnap.data() as DocumentData;
        return sum + (d.montant as number);
      }, 0);
      
      callback(totalRevenue);
      logDebug('listenToWeeklyRevenue: received update', totalRevenue);
    },
    (error) => {
      logDebug('Error listening to weekly revenue', error);
      callback(0);
    }
  );
  
  return unsubscribe;
}

/////////////////////////
// 4. Liste journalière des revenus
/////////////////////////
export async function getDailyRevenue(): Promise<{ date: string; revenue: number }[]> {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6); // Get last 7 days
    start.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'commandes'),
      where('dateCreation', '>=', Timestamp.fromDate(start)),
      where('etat', '==', 'confirmed'),
      orderBy('dateCreation', 'asc')
    );
    const snap = await getDocs(q);
    const map = new Map<string, number>();
    
    // Initialize all 7 days with zero revenue
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().slice(0, 10);
      map.set(dateStr, 0);
    }
    
    // Add revenue data from Firebase
    snap.docs.forEach(docSnap => {
      const d = docSnap.data() as DocumentData;
      const date = (d.dateCreation as Timestamp).toDate().toISOString().slice(0, 10);
      map.set(date, (map.get(date) || 0) + (d.montant as number));
    });
    
    // Convert map to array and format for chart
    const result = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => {
        const dateObj = new Date(date);
        // Get day name in French
        const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(dateObj);
        return { 
          name: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3), // Format as "Lun", "Mar", etc.
          date,
          revenue
        };
      });
    
    logDebug('getDailyRevenue: retrieved daily revenue', result);
    return result;
  } catch (error) {
    logDebug('Error retrieving daily revenue', error);
    return [];
  }
}

// Real-time version for listening to daily revenue
export function listenToDailyRevenue(callback: (data: { name: string; date: string; revenue: number }[]) => void): () => void {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6); // Get last 7 days
  start.setHours(0, 0, 0, 0);
  
  const q = query(
    collection(db, 'commandes'),
    where('dateCreation', '>=', Timestamp.fromDate(start)),
    where('etat', '==', 'confirmed'),
    orderBy('dateCreation', 'asc')
  );
  
  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      const map = new Map<string, number>();
      
      // Initialize all 7 days with zero revenue
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().slice(0, 10);
        map.set(dateStr, 0);
      }
      
      // Add revenue data from Firebase
      snapshot.docs.forEach(docSnap => {
        const d = docSnap.data() as DocumentData;
        const date = (d.dateCreation as Timestamp).toDate().toISOString().slice(0, 10);
        map.set(date, (map.get(date) || 0) + (d.montant as number));
      });
      
      // Convert map to array and format for chart
      const result = Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => {
          const dateObj = new Date(date);
          // Get day name in French
          const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(dateObj);
          return { 
            name: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3), // Format as "Lun", "Mar", etc.
            date,
            revenue
          };
        });
      
      callback(result);
      logDebug('listenToDailyRevenue: received update', result);
    },
    (error) => {
      logDebug('Error listening to daily revenue', error);
      callback([]);
    }
  );
  
  return unsubscribe;
}

/////////////////////////
// 5. Plats les plus populaires
/////////////////////////
export async function getPopularDishes(topN = 5): Promise<{ item: Plat; count: number }[]> {
  try {
    const cpSnap = await getDocs(collection(db, 'commande_plat'));
    const counts = new Map<string, number>();
    cpSnap.docs.forEach(docSnap => {
      const d = docSnap.data() as DocumentData;
      const pId = d.idP as string;
      const qte = d.quantité as number;
      counts.set(pId, (counts.get(pId) || 0) + qte);
    });
    
    const platsSnap = await getDocs(collection(db, 'plats'));
    const mapPlat = new Map<string, Plat>();
    platsSnap.docs.forEach(docSnap => {
      mapPlat.set(docSnap.id, docSnap.data() as Plat);
    });
    
    const result = Array.from(counts.entries())
      .map(([idP, count]) => {
        const plat = mapPlat.get(idP);
        if (!plat) return null;
        return { item: plat, count };
      })
      .filter((item): item is { item: Plat; count: number } => item !== null) // Type guard
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);
    
    logDebug('getPopularDishes: retrieved popular dishes', result);
    return result;
  } catch (error) {
    logDebug('Error retrieving popular dishes', error);
    return [];
  }
}

// Real-time version for listening to popular dishes
export function listenToPopularDishes(topN = 5, callback: (dishes: { item: Plat; count: number }[]) => void): () => void {
  const commandePlatsRef = collection(db, 'commande_plat');
  
  const unsubscribe = onSnapshot(commandePlatsRef, 
    async (snapshot) => {
      try {
        const counts = new Map<string, number>();
        snapshot.docs.forEach(docSnap => {
          const d = docSnap.data() as DocumentData;
          const pId = d.idP as string;
          const qte = d.quantité as number;
          counts.set(pId, (counts.get(pId) || 0) + qte);
        });
        
        const platsSnap = await getDocs(collection(db, 'plats'));
        const mapPlat = new Map<string, Plat>();
        platsSnap.docs.forEach(docSnap => {
          mapPlat.set(docSnap.id, docSnap.data() as Plat);
        });
        
        const result = Array.from(counts.entries())
          .map(([idP, count]) => {
            const plat = mapPlat.get(idP);
            if (!plat) return null;
            return { item: plat, count };
          })
          .filter((item): item is { item: Plat; count: number } => item !== null)
          .sort((a, b) => b.count - a.count)
          .slice(0, topN);
        
        callback(result);
        logDebug('listenToPopularDishes: received update', result.length);
      } catch (error) {
        logDebug('Error processing popular dishes update', error);
        callback([]);
      }
    },
    (error) => {
      logDebug('Error listening to popular dishes', error);
      callback([]);
    }
  );
  
  return unsubscribe;
}

/////////////////////////
// 6. Commandes par catégorie
/////////////////////////
export async function getOrdersByCategory(): Promise<{ name: string; orders: number }[]> {
  try {
    const cpSnap = await getDocs(collection(db, 'commande_plat'));
    const platsSnap = await getDocs(collection(db, 'plats'));
    const catMap = new Map<string, string>();
    
    platsSnap.docs.forEach(docSnap => {
      const p = docSnap.data() as Plat;
      catMap.set(docSnap.id, p.idCat);
    });
    
    const counts = new Map<string, number>();
    
    cpSnap.docs.forEach(docSnap => {
      const d = docSnap.data() as DocumentData;
      const platId = d.idP as string;
      const qte = d.quantité as number;
      const categoryId = catMap.get(platId) || 'Inconnue';
      
      // Map category ID to a human-readable name
      let categoryName;
      switch (categoryId) {
        case '100':
          categoryName = 'Entrées';
          break;
        case '200':
          categoryName = 'Plats';
          break;
        case '300':
          categoryName = 'Desserts';
          break;
        case '400':
          categoryName = 'Accompagnements';
          break;
        case '500':
          categoryName = 'Boissons';
          break;
        default:
          categoryName = categoryId;
      }
      
      counts.set(categoryName, (counts.get(categoryName) || 0) + qte);
    });
    
    const result = Array.from(counts.entries())
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders);
    
    logDebug('getOrdersByCategory: retrieved orders by category', result);
    return result;
  } catch (error) {
    logDebug('Error retrieving orders by category', error);
    return [];
  }
}

// Real-time version for listening to orders by category
export function listenToOrdersByCategory(callback: (categories: { name: string; orders: number }[]) => void): () => void {
  const commandePlatsRef = collection(db, 'commande_plat');
  
  const unsubscribe = onSnapshot(commandePlatsRef, 
    async (snapshot) => {
      try {
        const platsSnap = await getDocs(collection(db, 'plats'));
        const catMap = new Map<string, string>();
        
        platsSnap.docs.forEach(docSnap => {
          const p = docSnap.data() as Plat;
          catMap.set(docSnap.id, p.idCat);
        });
        
        const counts = new Map<string, number>();
        
        snapshot.docs.forEach(docSnap => {
          const d = docSnap.data() as DocumentData;
          const platId = d.idP as string;
          const qte = d.quantité as number;
          const categoryId = catMap.get(platId) || 'Inconnue';
          
          // Map category ID to a human-readable name
          let categoryName;
          switch (categoryId) {
            case '100':
              categoryName = 'Entrées';
              break;
            case '200':
              categoryName = 'Plats';
              break;
            case '300':
              categoryName = 'Desserts';
              break;
            case '400':
              categoryName = 'Accompagnements';
              break;
            case '500':
              categoryName = 'Boissons';
              break;
            default:
              categoryName = categoryId;
          }
          
          counts.set(categoryName, (counts.get(categoryName) || 0) + qte);
        });
        
        const result = Array.from(counts.entries())
          .map(([name, orders]) => ({ name, orders }))
          .sort((a, b) => b.orders - a.orders);
        
        callback(result);
        logDebug('listenToOrdersByCategory: received update', result);
      } catch (error) {
        logDebug('Error processing orders by category update', error);
        callback([]);
      }
    },
    (error) => {
      logDebug('Error listening to orders by category', error);
      callback([]);
    }
  );
  
  return unsubscribe;
}

/////////////////////////
// 7. Commandes (tableau)
/////////////////////////
export async function getOrdersTable(): Promise<commandes[]> {
  const snap = await getDocs(collection(db, 'commandes'));
  return snap.docs.map(docSnap => {
    const d = docSnap.data() as DocumentData;
    return {
      idCmd:        docSnap.id,
      confirmation: d.confirmation as boolean,
      dateCreation: d.dateCreation as Timestamp,
      etat:         d.etat as 'pending' | 'confirmed' | 'cancelled',
      idC:          d.idC as string,
      idT:          d.idT as string,
      montant:      d.montant as number,
      notes:        d.notes as string
    };
  });
}

/////////////////////////
// 8. Stock des ingrédients
/////////////////////////
export async function getIngredientsStock(): Promise<Ingredient[]> {
  const snap = await getDocs(collection(db, 'ingredient'));
  return snap.docs.map(docSnap => {
    const d = docSnap.data() as DocumentData;
    return {
      idIng:  docSnap.id,
      nbrMax: d.nbrMax as number,
      nbrMin: d.nbrMin as number,
      nomIng: d.nomIng as string
    };
  });
}

/////////////////////////
// 9. Réservations (tableau)
/////////////////////////
export async function getReservationsTable(): Promise<Reservation[]> {
  const snap = await getDocs(collection(db, 'reservations'));
  return snap.docs.map(docSnap => {
    const d = docSnap.data() as DocumentData;
    return {
      idRes:      docSnap.id,
      client_id:  d.client_id as string,
      created_at: d.created_at as Timestamp,
      date_time:  d.date_time as Timestamp,
      party_size: d.party_size as number,
      status:     d.status as 'pending' | 'confirmed' | 'cancelled',
      table_id:   d.table_id as string
    };
  });
}

/////////////////////////
// 10. Employés (tableau)
/////////////////////////
export async function getEmployeesList(): Promise<Employe[]> {
  const snap = await getDocs(collection(db, 'employes'));
  return snap.docs.map(docSnap => {
    const d = docSnap.data() as DocumentData;
    return {
      idE:           docSnap.id,
      adresseE:      d.adresseE as string,
      dateEmbauche:  d.dateEmbauche as Timestamp,
      emailE:        d.emailE as string,
      firebase_uid:  d.firebase_uid as string,
      nomE:          d.nomE as string,
      numeroE:       d.numeroE as string,
      prenomE:       d.prenomE as string,
      role:          d.role as 'serveur' | 'chef' | 'manager',
      salaire:       d.salaire as string,
      usernameE:     d.usernameE as string
    };
  });
}

/////////////////////////
// 11. Ventes par sous-catégorie
/////////////////////////
export async function getSalesBySubcategory(): Promise<SalesBySubcategory[]> {
  const cpSnap = await getDocs(collection(db, 'commande_plat'));
  const platsSnap = await getDocs(collection(db, 'plats'));
  const catMap = new Map<string, string>();
  const priceMap = new Map<string, number>();

  platsSnap.docs.forEach(docSnap => {
    const p = docSnap.data() as Plat;
    catMap.set(docSnap.id, p.idCat);
    priceMap.set(docSnap.id, p.prix);
  });

  const sales = new Map<string, number>();
  cpSnap.docs.forEach(docSnap => {
    const d = docSnap.data() as DocumentData;
    const cat = catMap.get(d.idP as string) || 'Inconnue';
    const qte = d.quantité as number;
    const price = priceMap.get(d.idP as string) || 0;
    sales.set(cat, (sales.get(cat) || 0) + qte * price);
  });

  return Array.from(sales.entries()).map(([sous_catégorie, salesAmt]) => ({
    sous_catégorie,
    sales: salesAmt
  }));
}

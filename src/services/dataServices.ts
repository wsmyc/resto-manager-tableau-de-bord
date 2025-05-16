// src/dataService.ts

import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
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
  const snap = await getDocs(collection(db, 'commandes'));
  return snap.size;
}

/////////////////////////
// 2. Réservations actives
/////////////////////////
export async function getActiveReservations(): Promise<Reservation[]> {
  const q = query(
    collection(db, 'reservations'),
    where('status', '==', 'confirmed')
  );
  const snap = await getDocs(q);
  return snap.docs.map(docSnap => {
    const d = docSnap.data() as DocumentData;
    return {
      idRes:      d.idRes        as string,
      client_id:  d.client_id    as string,
      created_at: d.created_at   as Timestamp,
      date_time:  d.date_time    as Timestamp,
      party_size: d.party_size   as number,
      status:     d.status       as 'pending' | 'confirmed' | 'cancelled',
      table_id:   d.table_id     as string
    };
  });
}

/////////////////////////
// 3. Revenus cette semaine
/////////////////////////
export async function getRevenueThisWeek(): Promise<number> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const q = query(
    collection(db, 'commandes'),
    where('dateCreation', '>=', Timestamp.fromDate(start)),
    where('etat', '==', 'confirmed')
  );
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, docSnap) => {
    const d = docSnap.data() as DocumentData;
    return sum + (d.montant as number);
  }, 0);
}

/////////////////////////
// 4. Liste journalière des revenus
/////////////////////////
export async function getDailyRevenue(): Promise<{ date: string; revenue: number }[]> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const q = query(
    collection(db, 'commandes'),
    where('dateCreation', '>=', Timestamp.fromDate(start)),
    where('etat', '==', 'confirmed')
  );
  const snap = await getDocs(q);
  const map = new Map<string, number>();
  snap.docs.forEach(docSnap => {
    const d = docSnap.data() as DocumentData;
    const date = (d.dateCreation as Timestamp).toDate().toISOString().slice(0, 10);
    map.set(date, (map.get(date) || 0) + (d.montant as number));
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));
}

/////////////////////////
// 5. Plats les plus populaires
/////////////////////////
export async function getPopularDishes(topN = 5): Promise<{ item: Plat; count: number }[]> {
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

  return Array.from(counts.entries())
    .map(([idP, count]) => ({ item: mapPlat.get(idP)!, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/////////////////////////
// 6. Commandes par catégorie
/////////////////////////
export async function getOrdersByCategory(): Promise<{ catégorie: string; count: number }[]> {
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
    const cat = catMap.get(d.idP as string) || 'Inconnue';
    const qte = d.quantité as number;
    counts.set(cat, (counts.get(cat) || 0) + qte);
  });

  return Array.from(counts.entries()).map(([cat, count]) => ({
    catégorie: cat,
    count
  }));
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

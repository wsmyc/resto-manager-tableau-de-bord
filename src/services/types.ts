
// src/types.ts

import type { Timestamp } from 'firebase/firestore';

/** 1. Collection `commandes` */
export interface commandes {
  idCmd: string;
  confirmation: boolean;
  dateCreation: Timestamp;
  etat: 'pending' | 'confirmed' | 'cancelled' | 'en preparation' | 'prete';
  idC: string;
  idT: string;
  montant: number;
  notes: string;
}

/** 2. Collection `commande_plat` */
export interface commandePlat {
  idCmd: string;
  idP: string;
  quantité: number;
}

/** 3. Collection `plats` */
export interface Plat {
  idP: string;
  description: string;
  estimation: number;
  idCat: string;
  ingrédients: string[];
  nom: string;
  note: number;
  prix: number;
  quantité: number;
}

/** 4. Collection `reservations` */
export interface Reservation {
  idRes: string;
  client_id: string;
  created_at: Timestamp;
  date_time: Timestamp;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  table_id: string;
}

/** 5. Collection `ingredient` */
export interface Ingredient {
  idIng: string;
  nbrMax: number;
  nbrMin: number;
  nomIng: string;
}

/** 6. Collection `employes` */
export interface Employe {
  idE: string;
  adresseE: string;
  dateEmbauche: Timestamp;
  emailE: string;
  firebase_uid: string;
  nomE: string;
  numeroE: string;
  prenomE: string;
  role: 'serveur' | 'chef' | 'manager';
  salaire: string;
  usernameE: string;
}

/** Pour la fonction ventes par sous-catégorie */
export interface SalesBySubcategory {
  sous_catégorie: string;
  sales: number;
}

/** Types pour le calcul des coûts des plats */
export interface IngredientCostDetail {
  name: string;
  quantity: number;
  unit: 'kg' | 'g' | 'L' | 'ml' | 'unité';
  cost: number;
}

export interface PlatCostDetails {
  menuItemId: string;
  costDetails: IngredientCostDetail[];
  totalCost: number;
}

/** Types pour les notifications */
export interface Notification {
  id: string;
  type: 'stock' | 'commande' | 'reservation';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  data?: {
    commandeId?: string;
    reservationId?: string;
    ingredientId?: string;
    tableId?: string;
  };
}

/** Types pour Firebase menu */
export interface FirestorePlat {
  description: string;
  estimations: number;
  idCat: string;
  nom_du_plat: string;
  note: number;
  prix: number;
}

export interface FirestorePlatIngredient {
  nom: string;
  quantite_g: number;
  nom_du_plat: string;
  ingredients: Array<{nom: string, quantite_g: number}>;
  idP: string;
}

/** Mappage catégorie -> ID */
export const CATEGORY_TO_ID: Record<string, string> = {
  "Entrée": "CAT1",
  "Plat": "CAT2",
  "Dessert": "CAT3",
  "Accompagnement": "CAT4",
  "Boisson": "CAT5"
};

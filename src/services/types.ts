
// src/types.ts

import type { Timestamp } from 'firebase/firestore';

/** 1. Collection `commandes` */
export interface Commande {
  id?: string;
  confirmation: boolean;
  dateCreation: Timestamp;
  discount_applied?: boolean;
  etat: 'en_attente' | 'confirmee' | 'annulee' | 'en_preparation' | 'prete' | 'servie' | 'pending' | 'confirmed' | 'cancelled';
  idC: string;
  idTable: string;
  montant: number;
  notes?: string;
}

/** 2. Collection `commande_plat` */
export interface CommandePlat {
  idCmd: string;
  idP: string;
  quantité: number;
}

/** 3. Collection `plats` */
export interface Plat {
  id?: string;
  description: string;
  estimations: number;
  idCat: number;
  nom_du_plat: string;
  note: number;
  prix?: number;
}

/** 4. Collection `reservations` */
export interface Reservation {
  id?: string;
  client_name: string;
  created_at: Timestamp;
  date_time: string;
  notes?: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  table_id: string;
  telephone: string;
  updated_at?: Timestamp;
}

/** 5. Collection `ingredient` */
export interface Ingredient {
  id?: string;
  categorie: string;
  cout_par_unite: number;
  createdAt: Timestamp;
  date_expiration: string;
  nom: string;
  quantite: number;
  seuil_alerte: number;
  unite: string;
}

/** 6. Collection `employes` */
export interface Employe {
  id?: string;
  adresseE: string;
  dateEmbauche: Timestamp;
  emailE: string;
  firebase_uid: string;
  nomE: string;
  numeroE: string;
  prenomE: string;
  role: string;
  salaire: string;
  usernameE: string;
}

/** 7. Collection 'montant_encaisse' */
export interface MontantEncaisse {
  id?: string;
  dateMontant: string;
  totalEncaissé: number;
}

/** 8. Collection 'reapprovisionnements' */
export interface Reapprovisionnement {
  id?: string;
  date_reapprovisionnement: Timestamp;
  idIng: string;
  quantite: number;
  user_id: string;
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
  unit: string;
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

/** Mappage catégorie -> ID */
export const CATEGORY_TO_ID: Record<string, number> = {
  "Entrées": 100,
  "Plats": 200,
  "Desserts": 300,
  "Accompagnements": 400,
  "Boissons": 500
};

/** Mappage des noms de catégories français vers anglais pour la compatibilité */
export const CATEGORY_NAME_MAPPING: Record<string, string> = {
  "Entrées": "Entrée",
  "Plats": "Plat",
  "Desserts": "Dessert",
  "Accompagnements": "Accompagnement",
  "Boissons": "Boisson"
};

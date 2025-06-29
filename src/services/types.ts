// src/services/types.ts

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

/** 2. Collection `commande_plat` - Structure réelle basée sur les captures */
export interface CommandesPlat {
  idCmd: string;
  idP: string;
  quantite: number;
}

/** 3. Collection `plats` */
export interface Plat {
  id?: string;
  description: string;
  estimations: number;
  idCat: number | string;
  nom_du_plat: string;
  note: number;
  prix?: number;
}

/** Used for Firebase Plat documents */
export interface FirestorePlat {
  description: string;
  estimations: number;
  idCat: number | string;
  nom_du_plat: string;
  note: number;
  prix?: number;
}

/** Used for Firebase Plat Ingredients */
export interface FirestorePlatIngredient {
  nom_du_plat: string;
  ingredients: Array<{ nom: string; quantite_g: number }>;
  idP: string;
  nom: string;
  quantite_g: number;
}

/** 4. Collection `reservations` */
export interface Reservation {
  id?: string;
  client_name: string;
  client_id?: string;
  created_at: Timestamp;
  date_time: string | Timestamp;
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
  idIng?: string; // For backward compatibility
  categorie: string;
  cout_par_unite: number;
  createdAt: Timestamp;
  date_expiration: string;
  nom: string;
  quantite: number;
  seuil_alerte: number;
  unite: string;
  // Legacy properties for compatibility
  nbrMax?: number;
  nbrMin?: number;
  nomIng?: string;
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
  idE?: string; // For backward compatibility
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
  type: "stock" | "commande" | "reservation" | "cancellation_request" | "cancellation_accepted" | "cancellation_refused";
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  related_id?: string;
  actionRequired?: boolean;
  priority?: "normal" | "high";
  data?: {
    commandeId?: string;
    reservationId?: string;
    tableId?: string;
  };
}
/** Collection `clients` */
export interface Client {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  birthdate?: string;
  gender?: string;
  is_guest?: boolean;
  allergies?: string[];
  preferences?: any;
  restrictions?: any;
  fidelity_points?: number;
  created_at?: Timestamp;
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

// Legacy type aliases for backward compatibility
export type commandes = Commande;
export type commandePlat = CommandePlat;

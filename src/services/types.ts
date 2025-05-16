// src/types.ts

import type { Timestamp } from 'firebase/firestore';

/** 1. Collection `commandes` */
export interface commandes {
  idCmd: string;
  confirmation: boolean;
  dateCreation: Timestamp;
  etat: 'pending' | 'confirmed' | 'cancelled';
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

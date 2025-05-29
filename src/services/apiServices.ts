
// src/apiService.ts

import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { auth, db } from './firebase';
import { doc, collection, setDoc, addDoc } from 'firebase/firestore';
import type {
  Commande,
  Reservation,
  Ingredient,
  Plat,
  commandePlat,
  SalesBySubcategory,
  Employe,
  PlatCostDetails,
  FirestorePlat,
  FirestorePlatIngredient
} from './types';
import { CATEGORY_TO_ID } from './types';
import { estimateCost, getCostDetailsByMenuItemId } from '../data/ingredientCosts';

// 1. Create an Axios instance pointing at your Cloud Functions base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// 2. Interceptor to auto-attach Firebase Auth ID token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      // Ensure headers exists and is an AxiosHeaders instance
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      // Use AxiosHeaders.set to attach the token
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  error => Promise.reject(error)
);

// ----- Authentication -----
export function managerSignup(data: { username: string; password: string }) {
  return api.post('/auth/signup/', data);
}

export function managerLogin(data: { username: string; password: string }) {
  return api.post('/auth/login/', data);
}

export function createEmploye(data: Partial<Employe>) {
  return api.post('/employes/create/', data);
}

// ----- Commandes -----
export function getAllCommandes(): Promise<Commande[]> {
  return api.get('/commandes/').then(res => res.data);
}

export function getCommandesEnAttente(): Promise<Commande[]> {
  return api.get('/commandes/en-attente/').then(res => res.data);
}

export function getCommandesLancees(): Promise<Commande[]> {
  return api.get('/commandes/lancees/').then(res => res.data);
}

export function getCommandesServies(): Promise<Commande[]> {
  return api.get('/commandes/servies/').then(res => res.data);
}

export function getCommandesAnnulees(): Promise<Commande[]> {
  return api.get('/commandes/annulees/').then(res => res.data);
}

export function getTotalCommandes(): Promise<{ total: number }> {
  return api.get('/commandes/total/').then(res => res.data);
}

// ----- Commande Plat -----
export function getCommandePlatList(): Promise<commandePlat[]> {
  return api.get('/commande-plat/').then(res => res.data);
}

// ----- Categories & Sous-Categories -----
export function getCategories(): Promise<string[]> {
  return api.get('/categories/').then(res => res.data);
}

export function getSousCategories(): Promise<string[]> {
  return api.get('/sous-categories/').then(res => res.data);
}

export function getSousCategoriesByCategory(categoryId: string): Promise<string[]> {
  return api.get(`/categories/sous-categories/?category_id=${categoryId}`).then(res => res.data);
}

// ----- Plats -----
export function getAllPlats(): Promise<Plat[]> {
  return api.get('/plats/').then(res => res.data);
}

export async function addPlat(data: Plat) {
  // Add to local API first
  const response = await api.post('/plats/add/', data);
  
  // Then sync with Firebase
  await syncPlatWithFirebase(data);
  
  return response;
}

export async function updatePlat(platId: string, data: Partial<Plat>) {
  // Update local API first
  const response = await api.put(`/plats/${platId}/`, data);
  
  // Get the full updated plat
  const updatedPlat = { ...data, id: platId } as Plat;
  
  // Then sync with Firebase
  await syncPlatWithFirebase(updatedPlat);
  
  return response;
}

export async function deletePlat(platId: string) {
  // Delete from local API first
  const response = await api.delete(`/plats/${platId}/delete/`);
  
  // Then delete from Firebase (you'd need to implement this based on your Firebase structure)
  // await deletePlatFromFirebase(platId);
  
  return response;
}

export function getPlatCostDetails(platId: string): Promise<PlatCostDetails> {
  return api.get(`/plats/${platId}/cost-details/`).then(res => res.data);
}

// Firebase sync for plats
export async function syncPlatWithFirebase(plat: Plat) {
  try {
    // Get cost details for the plat
    const costDetails = getCostDetailsByMenuItemId(plat.id || '') || { totalCost: estimateCost(plat.prix) };
    
    // Create Firestore plat document
    const platDocRef = doc(db, "plats", plat.id || '');
    const firestorePlat: FirestorePlat = {
      description: plat.description,
      estimations: costDetails.totalCost,
      idCat: plat.idCat,
      nom_du_plat: plat.nom_du_plat,
      note: plat.note || 0,
      prix: plat.prix
    };
    
    // Save plat to Firestore
    await setDoc(platDocRef, firestorePlat);
    
    // Get ingredients (handle the case where costDetails might not have costDetails property)
    const ingredients = 'costDetails' in costDetails 
      ? costDetails.costDetails?.map(detail => ({
          nom: detail.name,
          quantite_g: detail.quantity
        })) 
      : [];
    
    // Create or update plat_ingredients document
    const ingredientsDocRef = doc(db, "plat_ingredients", plat.id || '');
    const firestorePlatIngredient: FirestorePlatIngredient = {
      nom_du_plat: plat.nom_du_plat,
      ingredients: ingredients || [],
      idP: plat.id || '',
      nom: plat.nom_du_plat, // Use nom_du_plat since nom doesn't exist in Plat
      quantite_g: 0 // This field seems redundant with ingredients array
    };
    
    // Save ingredients to Firestore
    await setDoc(ingredientsDocRef, firestorePlatIngredient);
    
    console.log(`Plat ${plat.id} synced with Firebase successfully`);
    return true;
  } catch (error) {
    console.error("Error syncing plat with Firebase:", error);
    throw error;
  }
}

// ----- Ingredients -----
export function getAllIngredients(): Promise<Ingredient[]> {
  return api.get('/ingredients/').then(res => res.data);
}

export function addIngredient(data: Ingredient) {
  return api.post('/ingredients/add/', data);
}

export function restockIngredient(ingredientId: string, quantity: number) {
  return api.post(`/ingredients/${ingredientId}/restock/`, { quantity });
}

// ----- Reservations -----
export function getAllReservations(): Promise<Reservation[]> {
  return api.get('/reservations/').then(res => res.data);
}

export function getActiveReservations(): Promise<Reservation[]> {
  return api.get('/reservations/active/').then(res => res.data);
}

export function addReservation(data: Partial<Reservation>) {
  return api.post('/reservations/add/', data);
}

export function confirmReservation(reservationId: string) {
  return api.post(`/reservations/${reservationId}/confirm/`);
}

export function cancelReservation(reservationId: string) {
  return api.post(`/reservations/${reservationId}/cancel/`);
}

// ----- Revenue -----
export function getDailyRevenue(): Promise<{ date: string; revenue: number }[]> {
  return api.get('/revenue/daily/').then(res => res.data);
}

export function getWeeklyRevenue(): Promise<{ weekly: number }> {
  return api.get('/revenue/weekly/').then(res => res.data);
}

// ----- Employees -----
export function getAllEmployees(): Promise<Employe[]> {
  return api.get('/employes/').then(res => res.data);
}

export function updateEmployeeSalary(employeeId: string, salary: string) {
  return api.post(`/employes/${employeeId}/update-salary/`, { salary });
}

// ----- Sales by Subcategory -----
export function getSalesBySubcategory(): Promise<SalesBySubcategory[]> {
  return api.get('/sales-by-subcategory/').then(res => res.data);
}

// ----- Notifications -----
export function getNotifications() {
  return api.get('/notifications/').then(res => res.data);
}

export function markNotificationRead(notificationId: string) {
  return api.post(`/notifications/${notificationId}/read/`);
}

export function handleNotificationAction(notificationId: string, action: 'approve' | 'reject') {
  return api.post(`/notifications/${notificationId}/action/`, { action });
}

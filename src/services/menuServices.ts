
import { db } from './firebase';
import { collection, getDocs, setDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { MenuItem } from '../components/menu/MenuItemTable';
import { CATEGORY_TO_ID, CATEGORY_NAME_MAPPING, FirestorePlat, FirestorePlatIngredient } from './types';
import { estimateCost } from '../data/ingredientCosts';

/**
 * Add a menu item to the Firebase database
 * @param menuItem The menu item to add
 * @returns The generated dish ID
 */
export async function addMenuItemToFirebase(menuItem: MenuItem): Promise<string> {
  try {
    // 1. Generate a new ID for the dish based on its category
    const dishId = await generateDishId(menuItem.category);
    
    // 2. Create the FirestorePlat object
    const firestorePlat: FirestorePlat = {
      description: menuItem.description,
      estimations: estimateCost(menuItem.price),
      idCat: CATEGORY_TO_ID[menuItem.category],
      nom_du_plat: menuItem.name,
      note: 0, // Default rating
      prix: menuItem.price
    };
    
    // 3. Add the dish to the "plats" collection
    const platDocRef = doc(db, "plats", dishId);
    await setDoc(platDocRef, firestorePlat);
    
    // 4. Parse ingredients from string to array
    const ingredientsArray = menuItem.ingredients ? menuItem.ingredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)
      .map(ing => {
        return {
          nom: ing,
          quantite_g: 100 // Default quantity, could be improved with actual quantities
        };
      }) : [];
    
    // 5. Create the FirestorePlatIngredient object
    const firestorePlatIngredient: FirestorePlatIngredient = {
      nom: "", // This field seems redundant with nom_du_plat
      quantite_g: 0, // This field seems redundant with ingredients array
      nom_du_plat: menuItem.name,
      ingredients: ingredientsArray,
      idP: dishId
    };
    
    // 6. Add the dish ingredients to the "plat_ingredients" collection
    const ingredientsDocRef = doc(db, "plat_ingredients", dishId);
    await setDoc(ingredientsDocRef, firestorePlatIngredient);
    
    console.log(`Menu item ${menuItem.name} added with ID: ${dishId}`);
    return dishId;
  } catch (error) {
    console.error("Error adding menu item to Firebase:", error);
    throw error;
  }
}

/**
 * Generate a new dish ID based on its category
 * Example: For category "Plats", generate "201", "202", etc.
 * @param category The dish category
 * @returns A new dish ID
 */
async function generateDishId(category: string): Promise<string> {
  try {
    // 1. Get the category prefix (e.g., "200" for "Plats")
    const categoryPrefix = CATEGORY_TO_ID[category];
    if (!categoryPrefix) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    // 2. Get all existing dishes in this category
    const platsCollection = collection(db, "plats");
    const categoryQuery = query(
      platsCollection,
      where("idCat", "==", categoryPrefix),
      orderBy("idP", "desc"),
      limit(1)
    );
    
    const snapshot = await getDocs(categoryQuery);
    
    // 3. Generate a new ID
    let newId: number;
    
    if (snapshot.empty) {
      // If no dishes exist in this category yet, start with 01
      newId = parseInt(categoryPrefix) + 1;
    } else {
      // Get the highest existing ID and increment by 1
      const highestDishId = snapshot.docs[0].id;
      const highestNumber = parseInt(highestDishId);
      newId = highestNumber + 1;
    }
    
    return newId.toString();
  } catch (error) {
    console.error("Error generating dish ID:", error);
    throw error;
  }
}

/**
 * Updates an existing menu item in Firebase
 * @param dishId The ID of the dish to update
 * @param menuItem The updated menu item data
 */
export async function updateMenuItemInFirebase(dishId: string, menuItem: MenuItem): Promise<void> {
  try {
    // 1. Create the FirestorePlat object
    const firestorePlat: FirestorePlat = {
      description: menuItem.description,
      estimations: estimateCost(menuItem.price),
      idCat: CATEGORY_TO_ID[menuItem.category],
      nom_du_plat: menuItem.name,
      note: 0, // Maintain existing rating if possible
      prix: menuItem.price
    };
    
    // 2. Update the dish in the "plats" collection
    const platDocRef = doc(db, "plats", dishId);
    await setDoc(platDocRef, firestorePlat, { merge: true });
    
    // 3. Parse ingredients from string to array
    const ingredientsArray = menuItem.ingredients ? menuItem.ingredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)
      .map(ing => {
        return {
          nom: ing,
          quantite_g: 100 // Default quantity
        };
      }) : [];
    
    // 4. Create the FirestorePlatIngredient object
    const firestorePlatIngredient: FirestorePlatIngredient = {
      nom: "", // This field seems redundant
      quantite_g: 0, // This field seems redundant
      nom_du_plat: menuItem.name,
      ingredients: ingredientsArray,
      idP: dishId
    };
    
    // 5. Update the dish ingredients in the "plat_ingredients" collection
    const ingredientsDocRef = doc(db, "plat_ingredients", dishId);
    await setDoc(ingredientsDocRef, firestorePlatIngredient, { merge: true });
    
    console.log(`Menu item ${menuItem.name} updated with ID: ${dishId}`);
  } catch (error) {
    console.error("Error updating menu item in Firebase:", error);
    throw error;
  }
}

/**
 * Deletes a menu item from Firebase
 * @param dishId The ID of the dish to delete
 */
export async function deleteMenuItemFromFirebase(dishId: string): Promise<void> {
  // Note: In a production environment, you might want to implement soft deletion
  // or check for references before deleting
  
  // For now, this is left as a placeholder for future implementation
  console.log(`Menu item with ID: ${dishId} would be deleted here`);
}

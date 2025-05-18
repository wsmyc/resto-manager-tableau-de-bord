
import { db } from './firebase';
import { collection, getDocs, setDoc, doc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
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
    console.log("Début de l'ajout de l'article au menu:", menuItem);
    
    // 1. Vérification des données
    if (!menuItem.name || !menuItem.description || !menuItem.category || menuItem.price === undefined) {
      throw new Error("Données d'article incomplètes");
    }
    
    // 2. Generate a new ID for the dish based on its category
    const dishId = await generateDishId(menuItem.category);
    console.log("ID de plat généré:", dishId);
    
    // 3. Create the FirestorePlat object
    const firestorePlat: FirestorePlat = {
      description: menuItem.description,
      estimations: estimateCost(menuItem.price),
      idCat: CATEGORY_TO_ID[menuItem.category] || "",
      nom_du_plat: menuItem.name,
      note: 0, // Default rating
      prix: menuItem.price
    };
    
    console.log("Objet FirestorePlat créé:", firestorePlat);
    
    // 4. Add the dish to the "plats" collection
    const platDocRef = doc(db, "plats", dishId);
    await setDoc(platDocRef, {
      ...firestorePlat,
      created_at: serverTimestamp(),
    });
    
    console.log("Plat ajouté à la collection 'plats'");
    
    // 5. Parse ingredients from string to array
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
    
    // 6. Create the FirestorePlatIngredient object
    const firestorePlatIngredient: FirestorePlatIngredient = {
      nom: menuItem.name, // Use the dish name here
      quantite_g: 0, // This field seems redundant with ingredients array
      nom_du_plat: menuItem.name,
      ingredients: ingredientsArray,
      idP: dishId
    };
    
    console.log("Objet FirestorePlatIngredient créé:", firestorePlatIngredient);
    
    // 7. Add the dish ingredients to the "plat_ingredients" collection
    const ingredientsDocRef = doc(db, "plat_ingredients", dishId);
    await setDoc(ingredientsDocRef, {
      ...firestorePlatIngredient,
      created_at: serverTimestamp(),
    });
    
    console.log(`Article de menu ${menuItem.name} ajouté avec ID: ${dishId}`);
    return dishId;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'article au menu:", error);
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
      throw new Error(`Catégorie invalide: ${category}`);
    }
    
    console.log("Préfixe de catégorie:", categoryPrefix);
    
    // 2. Get all existing dishes in this category
    const platsCollection = collection(db, "plats");
    const categoryQuery = query(
      platsCollection,
      where("idCat", "==", categoryPrefix),
      orderBy("idP", "desc"),
      limit(1)
    );
    
    const snapshot = await getDocs(categoryQuery);
    console.log("Résultat de la requête:", snapshot.empty ? "Aucun plat existant" : "Plats existants trouvés");
    
    // 3. Generate a new ID
    let newId: number;
    
    if (snapshot.empty) {
      // If no dishes exist in this category yet, start with 01
      newId = parseInt(categoryPrefix) + 1;
      console.log("Aucun plat existant, nouvel ID:", newId);
    } else {
      // Get the highest existing ID and increment by 1
      const highestDish = snapshot.docs[0];
      const highestDishId = highestDish.id;
      console.log("ID le plus élevé trouvé:", highestDishId);
      
      const highestNumber = parseInt(highestDishId);
      newId = highestNumber + 1;
      console.log("Nouvel ID calculé:", newId);
    }
    
    return newId.toString();
  } catch (error) {
    console.error("Erreur lors de la génération de l'ID du plat:", error);
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
    console.log("Début de la mise à jour de l'article au menu:", menuItem);
    
    // 1. Vérification des données
    if (!menuItem.name || !menuItem.description || !menuItem.category || menuItem.price === undefined) {
      throw new Error("Données d'article incomplètes");
    }
    
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
    await setDoc(platDocRef, {
      ...firestorePlat,
      updated_at: serverTimestamp(),
    }, { merge: true });
    
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
      nom: menuItem.name, // Use the dish name here
      quantite_g: 0, // This field seems redundant
      nom_du_plat: menuItem.name,
      ingredients: ingredientsArray,
      idP: dishId
    };
    
    // 5. Update the dish ingredients in the "plat_ingredients" collection
    const ingredientsDocRef = doc(db, "plat_ingredients", dishId);
    await setDoc(ingredientsDocRef, {
      ...firestorePlatIngredient,
      updated_at: serverTimestamp(),
    }, { merge: true });
    
    console.log(`Article de menu ${menuItem.name} mis à jour avec ID: ${dishId}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article au menu:", error);
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
  console.log(`Article de menu avec ID: ${dishId} serait supprimé ici`);
}

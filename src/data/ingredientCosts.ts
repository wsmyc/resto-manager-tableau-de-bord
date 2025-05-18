
import { PlatCostDetails, IngredientCostDetail } from "../services/types";

// Ingredient prices database (DZD/kg or unit as specified)
export const ingredientPrices: Record<string, { price: number; unit: string }> = {
  // Vegetables
  "oignons": { price: 70, unit: "kg" },
  "oignon": { price: 70, unit: "kg" },
  "tomates": { price: 80, unit: "kg" },
  "tomate": { price: 80, unit: "kg" },
  "poivrons": { price: 130, unit: "kg" },
  "poivron": { price: 130, unit: "kg" },
  "laitue": { price: 120, unit: "kg" },
  "carottes": { price: 75, unit: "kg" },
  "carotte": { price: 75, unit: "kg" },
  "betteraves": { price: 150, unit: "kg" },
  "concombre": { price: 100, unit: "kg" },
  "epinards": { price: 100, unit: "kg" },
  "pommes de terre": { price: 80, unit: "kg" },
  "aubergines": { price: 120, unit: "kg" },
  "aubergine": { price: 120, unit: "kg" },
  "courgettes": { price: 75, unit: "kg" },
  "courgette": { price: 75, unit: "kg" },
  "navets": { price: 70, unit: "kg" },
  "navet": { price: 70, unit: "kg" },
  "celeri": { price: 100, unit: "kg" },
  "céleri": { price: 100, unit: "kg" },
  "radis": { price: 90, unit: "kg" },
  "légumes": { price: 80, unit: "kg" }, // Moyenne
  
  // Meats
  "agneau": { price: 2600, unit: "kg" },
  "agneau haché": { price: 2800, unit: "kg" },
  "viande hachée": { price: 2300, unit: "kg" },
  "viande de bœuf": { price: 2300, unit: "kg" },
  "bœuf haché": { price: 2300, unit: "kg" },
  "poulet": { price: 400, unit: "kg" },
  "poulet fermier": { price: 450, unit: "kg" },
  "blanc de poulet": { price: 500, unit: "kg" },
  "merguez": { price: 1600, unit: "kg" },
  "côtelettes d'agneau": { price: 2200, unit: "kg" },
  "dinde": { price: 700, unit: "kg" },
  "bœuf": { price: 2300, unit: "kg" },
  
  // Seafood
  "poisson": { price: 1000, unit: "kg" },
  "filet de poisson": { price: 1200, unit: "kg" },
  "dorade": { price: 1200, unit: "kg" },
  "filet de dorade": { price: 1400, unit: "kg" },
  "calamar": { price: 2500, unit: "kg" },
  "calamars": { price: 2500, unit: "kg" },
  "crevettes": { price: 4000, unit: "kg" },
  "saumon": { price: 3500, unit: "kg" },
  "thon": { price: 1800, unit: "kg" },
  "tilapia": { price: 900, unit: "kg" },
  
  // Grains & Legumes
  "frik": { price: 100, unit: "kg" },
  "frik (blé vert)": { price: 100, unit: "kg" },
  "pois chiches": { price: 400, unit: "kg" },
  "lentilles": { price: 350, unit: "kg" },
  "haricots blancs": { price: 600, unit: "kg" },
  "semoule": { price: 120, unit: "kg" },
  "semoule fine": { price: 120, unit: "kg" },
  "riz": { price: 240, unit: "kg" },
  "riz basmati": { price: 400, unit: "kg" },
  "boulgour": { price: 300, unit: "kg" },
  "vermicelles": { price: 120, unit: "kg" },
  "pain rassis": { price: 10, unit: "unité" },
  "pain": { price: 20, unit: "unité" },
  "pain arabe": { price: 30, unit: "unité" },
  "farine": { price: 100, unit: "kg" },
  "chapelure": { price: 200, unit: "kg" },
  "feuille de brick": { price: 500, unit: "kg" },
  "pâte filo": { price: 400, unit: "kg" },
  
  // Herbs & Spices
  "ail": { price: 300, unit: "kg" },
  "epices": { price: 400, unit: "kg" },
  "épices": { price: 400, unit: "kg" },
  "menthe fraiche": { price: 200, unit: "kg" },
  "menthe": { price: 200, unit: "kg" },
  "herbes": { price: 150, unit: "kg" },
  "persil": { price: 150, unit: "kg" },
  "coriandre": { price: 150, unit: "kg" },
  "thym": { price: 300, unit: "kg" },
  "romarin": { price: 300, unit: "kg" },
  "cumin": { price: 400, unit: "kg" },
  "paprika": { price: 400, unit: "kg" },
  "piment": { price: 350, unit: "kg" },
  "cannelle": { price: 600, unit: "kg" },
  "sumac": { price: 800, unit: "kg" },
  "aneth": { price: 300, unit: "kg" },
  "levure": { price: 800, unit: "kg" },
  "sel": { price: 50, unit: "kg" },
  "poivre": { price: 800, unit: "kg" },
  "vanille": { price: 1000, unit: "kg" },
  "hibiscus séché": { price: 600, unit: "kg" },
  "arômes": { price: 400, unit: "kg" },
  "arômes saisonniers": { price: 400, unit: "kg" },
  "câpres": { price: 500, unit: "kg" },
  
  // Dairy & Eggs
  "œuf": { price: 20, unit: "unité" },
  "œufs": { price: 20, unit: "unité" },
  "yaourt": { price: 140, unit: "litre" },
  "fromage": { price: 1600, unit: "kg" },
  "fromage frais": { price: 1200, unit: "kg" },
  "lait": { price: 150, unit: "litre" },
  "creme": { price: 200, unit: "litre" },
  "crème": { price: 200, unit: "litre" },
  "beurre": { price: 1400, unit: "kg" },
  
  // Fruits
  "citron": { price: 150, unit: "kg" },
  "oranges": { price: 150, unit: "kg" },
  "orange": { price: 150, unit: "kg" },
  "pommes": { price: 400, unit: "kg" },
  "pomme": { price: 400, unit: "kg" },
  "grenades": { price: 350, unit: "kg" },
  "grenade": { price: 350, unit: "kg" },
  "pasteque": { price: 130, unit: "kg" },
  "pastèque": { price: 130, unit: "kg" },
  "fruits": { price: 350, unit: "kg" },
  "pruneaux": { price: 800, unit: "kg" },
  "dattes": { price: 400, unit: "kg" },
  "pâte de dattes": { price: 600, unit: "kg" },
  "citron confit": { price: 300, unit: "kg" },
  
  // Nuts & Seeds
  "olives": { price: 600, unit: "kg" },
  "amandes": { price: 1600, unit: "kg" },
  "noix": { price: 1600, unit: "kg" },
  "pistaches": { price: 2000, unit: "kg" },
  "sesames": { price: 600, unit: "kg" },
  "sésame": { price: 600, unit: "kg" },
  "tahini": { price: 600, unit: "kg" },
  
  // Oils & Liquids
  "huile dolive": { price: 1000, unit: "litre" },
  "huile d'olive": { price: 1000, unit: "litre" },
  "huile": { price: 400, unit: "litre" },
  "eau de rose": { price: 100, unit: "litre" },
  "fleur doranger": { price: 700, unit: "litre" },
  "eau de fleur d'oranger": { price: 700, unit: "litre" },
  "eau": { price: 5, unit: "litre" },
  "eau gazeuse": { price: 60, unit: "litre" },
  "eau minérale": { price: 40, unit: "litre" },
  "soda": { price: 100, unit: "litre" },
  
  // Baking & Sweets
  "sucre": { price: 100, unit: "kg" },
  "miel": { price: 2000, unit: "litre" },
  
  // Beverages
  "café turc": { price: 2000, unit: "kg" },
  "café algerien": { price: 1000, unit: "kg" },
  "café algérien": { price: 1000, unit: "kg" },
  "café": { price: 1500, unit: "kg" },
  "thé vert": { price: 800, unit: "kg" }
};

// Function to calculate cost based on ingredient name and quantity in grams
export function calculateIngredientCost(name: string, quantityGrams: number): number {
  const ingredient = ingredientPrices[name.toLowerCase()];
  if (!ingredient) {
    console.warn(`No price found for ingredient: ${name}`);
    return 0;
  }
  
  // Convert from grams to kg for calculation
  const quantityInKg = quantityGrams / 1000;
  return Math.round(ingredient.price * quantityInKg);
}

// Function to generate ingredient cost details from CSV data
export function generateIngredientCostDetails(
  menuItemId: string, 
  ingredients: Array<{ingredient: string, quantite_g: number}>
): PlatCostDetails {
  const costDetails: IngredientCostDetail[] = [];
  let totalCost = 0;
  
  for (const item of ingredients) {
    const name = item.ingredient;
    const quantity = item.quantite_g;
    const cost = calculateIngredientCost(name, quantity);
    
    const unitInfo = ingredientPrices[name.toLowerCase()];
    const unit = unitInfo?.unit === "kg" ? "g" : 
                 unitInfo?.unit === "litre" ? "ml" : 
                 unitInfo?.unit || "unité";
    
    costDetails.push({
      name,
      quantity,
      unit: unit as any,
      cost
    });
    
    totalCost += cost;
  }
  
  return {
    menuItemId,
    costDetails,
    totalCost
  };
}

// Parse the CSV data to create our ingredient cost database
// This data comes from the menuIngredients.csv file
export const menuIngredientsData: Record<string, Array<{ingredient: string, quantite_g: number}>> = {
  "101": [ // Chorba Frik
    { ingredient: "frik (blé vert)", quantite_g: 80 },
    { ingredient: "agneau haché", quantite_g: 120 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "tomates", quantite_g: 80 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "sel", quantite_g: 2 },
    { ingredient: "poivre", quantite_g: 2 },
    { ingredient: "piment", quantite_g: 2 }
  ],
  "102": [ // Lablabi
    { ingredient: "pois chiches", quantite_g: 80 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "cumin", quantite_g: 5 },
    { ingredient: "paprika", quantite_g: 5 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "pain rassis", quantite_g: 30 },
    { ingredient: "œuf", quantite_g: 50 },
    { ingredient: "coriandre", quantite_g: 5 }
  ],
  "103": [ // Harira
    { ingredient: "lentilles", quantite_g: 80 },
    { ingredient: "pois chiches", quantite_g: 80 },
    { ingredient: "viande de bœuf", quantite_g: 120 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "céleri", quantite_g: 30 },
    { ingredient: "tomates", quantite_g: 80 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "104": [ // Chorba Beïda
    { ingredient: "vermicelles", quantite_g: 80 },
    { ingredient: "poulet", quantite_g: 120 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "105": [ // Chorba Loubia
    { ingredient: "haricots blancs", quantite_g: 80 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "tomate", quantite_g: 80 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "cumin", quantite_g: 5 },
    { ingredient: "coriandre", quantite_g: 5 }
  ],
  "106": [ // Chorba Poisson
    { ingredient: "filet de poisson", quantite_g: 120 },
    { ingredient: "tomates", quantite_g: 80 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "107": [ // Salade Mechouia
    { ingredient: "poivrons", quantite_g: 70 },
    { ingredient: "tomates", quantite_g: 80 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "sel", quantite_g: 2 }
  ],
  "108": [ // Salade Fattoush
    { ingredient: "laitue", quantite_g: 60 },
    { ingredient: "tomates", quantite_g: 80 },
    { ingredient: "concombre", quantite_g: 50 },
    { ingredient: "radis", quantite_g: 30 },
    { ingredient: "menthe", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "pain arabe", quantite_g: 30 },
    { ingredient: "sumac", quantite_g: 5 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "citron", quantite_g: 30 }
  ],
  "109": [ // Zaalouk
    { ingredient: "aubergines", quantite_g: 70 },
    { ingredient: "tomates", quantite_g: 80 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "paprika", quantite_g: 5 },
    { ingredient: "huile d'olive", quantite_g: 10 }
  ],
  "110": [ // Salade d'Orange
    { ingredient: "oranges", quantite_g: 100 },
    { ingredient: "cannelle", quantite_g: 2 },
    { ingredient: "sucre", quantite_g: 10 }
  ],
  "111": [ // Salade de Carottes
    { ingredient: "carottes", quantite_g: 70 },
    { ingredient: "citron", quantite_g: 30 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 }
  ],
  "112": [ // Salade de Betterave
    { ingredient: "betteraves", quantite_g: 70 },
    { ingredient: "citron", quantite_g: 30 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "sel", quantite_g: 2 }
  ],
  "115": [ // Bourek Viande
    { ingredient: "feuille de brick", quantite_g: 50 },
    { ingredient: "viande hachée", quantite_g: 120 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "œuf", quantite_g: 50 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "116": [ // Bourek Fromage
    { ingredient: "feuille de brick", quantite_g: 50 },
    { ingredient: "fromage frais", quantite_g: 50 },
    { ingredient: "œuf", quantite_g: 50 },
    { ingredient: "beurre", quantite_g: 20 }
  ],
  "201": [ // Couscous Poulet
    { ingredient: "semoule", quantite_g: 80 },
    { ingredient: "poulet fermier", quantite_g: 120 },
    { ingredient: "carottes", quantite_g: 70 },
    { ingredient: "navets", quantite_g: 70 },
    { ingredient: "courgettes", quantite_g: 70 },
    { ingredient: "pois chiches", quantite_g: 80 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "202": [ // Couscous Agneau
    { ingredient: "semoule", quantite_g: 80 },
    { ingredient: "agneau", quantite_g: 120 },
    { ingredient: "carottes", quantite_g: 70 },
    { ingredient: "navets", quantite_g: 70 },
    { ingredient: "pois chiches", quantite_g: 80 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "206": [ // Tagine Poulet Citron
    { ingredient: "poulet", quantite_g: 120 },
    { ingredient: "citron confit", quantite_g: 30 },
    { ingredient: "olives", quantite_g: 30 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "épices", quantite_g: 25 }
  ],
  "207": [ // Tagine Agneau Pruneaux
    { ingredient: "agneau", quantite_g: 120 },
    { ingredient: "pruneaux", quantite_g: 30 },
    { ingredient: "amandes", quantite_g: 20 },
    { ingredient: "miel", quantite_g: 10 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "211": [ // Steak Haché
    { ingredient: "bœuf haché", quantite_g: 120 },
    { ingredient: "œuf", quantite_g: 50 },
    { ingredient: "chapelure", quantite_g: 30 },
    { ingredient: "poivre", quantite_g: 5 },
    { ingredient: "crème", quantite_g: 30 },
    { ingredient: "beurre", quantite_g: 20 }
  ],
  "212": [ // Côtelettes d'Agneau
    { ingredient: "côtelettes d'agneau", quantite_g: 120 },
    { ingredient: "ail", quantite_g: 5 },
    { ingredient: "romarin", quantite_g: 5 },
    { ingredient: "huile d'olive", quantite_g: 10 },
    { ingredient: "sel", quantite_g: 5 },
    { ingredient: "poivre", quantite_g: 2 }
  ],
  "226": [ // Falafel
    { ingredient: "pois chiches", quantite_g: 80 },
    { ingredient: "oignon", quantite_g: 50 },
    { ingredient: "ail", quantite_g: 15 },
    { ingredient: "coriandre", quantite_g: 5 },
    { ingredient: "persil", quantite_g: 5 },
    { ingredient: "épices", quantite_g: 5 }
  ],
  "302": [ // Kalb el Louz
    { ingredient: "semoule", quantite_g: 80 },
    { ingredient: "amandes", quantite_g: 20 },
    { ingredient: "miel", quantite_g: 10 },
    { ingredient: "eau de fleur d'oranger", quantite_g: 5 }
  ],
  "501": [ // Thé à la Menthe
    { ingredient: "thé vert", quantite_g: 5 },
    { ingredient: "menthe fraîche", quantite_g: 5 },
    { ingredient: "sucre", quantite_g: 10 },
    { ingredient: "eau", quantite_g: 200 }
  ],
  "507": [ // Jus d'Orange Frais
    { ingredient: "oranges", quantite_g: 200 }
  ]
};

// Generate cost details for all menu items from the CSV data
export const ingredientCostDetails: PlatCostDetails[] = Object.entries(menuIngredientsData)
  .map(([id, ingredients]) => generateIngredientCostDetails(id, ingredients));

// Function to get cost details by menu item ID
export function getCostDetailsByMenuItemId(id: string): PlatCostDetails | undefined {
  return ingredientCostDetails.find(item => item.menuItemId === id);
}

// Fallback estimation for items without detailed costs (approximately 35% of selling price)
export function estimateCost(price: number): number {
  return Math.round(price * 0.35);
}

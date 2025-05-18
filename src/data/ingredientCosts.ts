
import { PlatCostDetails, IngredientCostDetail } from "../services/types";

// Ingredient prices database (DZD/kg or unit as specified)
export const ingredientPrices: Record<string, { price: number; unit: string }> = {
  // Vegetables
  "oignons": { price: 70, unit: "kg" },
  "tomates": { price: 80, unit: "kg" },
  "poivrons": { price: 130, unit: "kg" },
  "laitue": { price: 120, unit: "kg" },
  "carottes": { price: 75, unit: "kg" },
  "betteraves": { price: 150, unit: "kg" },
  "concombre": { price: 100, unit: "kg" },
  "epinards": { price: 100, unit: "kg" },
  "pommes de terre": { price: 80, unit: "kg" },
  "aubergines": { price: 120, unit: "kg" },
  "courgettes": { price: 75, unit: "kg" },
  "navets": { price: 70, unit: "kg" },
  "celeri": { price: 100, unit: "kg" },
  "radis": { price: 90, unit: "kg" },
  
  // Meats
  "agneau": { price: 2600, unit: "kg" },
  "agneau haché": { price: 2800, unit: "kg" },
  "viande hachée": { price: 2300, unit: "kg" },
  "poulet": { price: 400, unit: "kg" },
  "merguez": { price: 1600, unit: "kg" },
  "coteletes": { price: 2200, unit: "kg" },
  "dinde": { price: 700, unit: "kg" },
  "bœuf": { price: 2300, unit: "kg" },
  
  // Seafood
  "poisson": { price: 1000, unit: "kg" },
  "dorade": { price: 1200, unit: "kg" },
  "calamar": { price: 2500, unit: "kg" },
  "crevettes": { price: 4000, unit: "kg" },
  "saumon": { price: 3500, unit: "kg" },
  "thon": { price: 1800, unit: "kg" },
  "filet de poisson": { price: 1200, unit: "kg" },
  
  // Grains & Legumes
  "frik": { price: 100, unit: "kg" },
  "pois chiches": { price: 400, unit: "kg" },
  "lentilles": { price: 350, unit: "kg" },
  "haricots blancs": { price: 600, unit: "kg" },
  "semoule": { price: 120, unit: "kg" },
  "riz": { price: 240, unit: "kg" },
  "riz basmati": { price: 400, unit: "kg" },
  "boulgour": { price: 300, unit: "kg" },
  "vermicelles": { price: 120, unit: "kg" },
  
  // Herbs & Spices
  "ail": { price: 300, unit: "kg" },
  "epices": { price: 400, unit: "kg" },
  "menthe fraiche": { price: 200, unit: "kg" },
  "herbes": { price: 150, unit: "kg" },
  "vanille": { price: 1000, unit: "kg" },
  "persil": { price: 150, unit: "kg" },
  "coriandre": { price: 150, unit: "kg" },
  "menthe": { price: 200, unit: "kg" },
  "thym": { price: 300, unit: "kg" },
  "romarin": { price: 300, unit: "kg" },
  "cumin": { price: 400, unit: "kg" },
  "paprika": { price: 400, unit: "kg" },
  "piment": { price: 350, unit: "kg" },
  "cannelle": { price: 600, unit: "kg" },
  "sumac": { price: 800, unit: "kg" },
  
  // Dairy & Eggs
  "oeuf": { price: 20, unit: "unité" },
  "yaourt": { price: 140, unit: "litre" },
  "fromage": { price: 1600, unit: "kg" },
  "lait": { price: 150, unit: "litre" },
  "creme": { price: 200, unit: "litre" },
  "beurre": { price: 1400, unit: "kg" },
  "emmental": { price: 1800, unit: "kg" },
  "comté": { price: 2000, unit: "kg" },
  "roquefort": { price: 2500, unit: "kg" },
  "parmesan": { price: 2200, unit: "kg" },
  "fromage frais": { price: 1200, unit: "kg" },
  
  // Fruits
  "citron": { price: 150, unit: "kg" },
  "oranges": { price: 150, unit: "kg" },
  "pommes": { price: 400, unit: "kg" },
  "grenades": { price: 350, unit: "kg" },
  "pasteque": { price: 130, unit: "kg" },
  "fruits": { price: 350, unit: "kg" },
  "pruneaux": { price: 800, unit: "kg" },
  "dattes": { price: 400, unit: "kg" },
  "citron confit": { price: 300, unit: "kg" },
  
  // Nuts & Seeds
  "olives": { price: 600, unit: "kg" },
  "amandes": { price: 1600, unit: "kg" },
  "noix": { price: 1600, unit: "kg" },
  "sesames": { price: 600, unit: "kg" },
  "tahini": { price: 600, unit: "kg" },
  
  // Oils & Liquids
  "huile dolive": { price: 1000, unit: "litre" },
  "huile": { price: 400, unit: "litre" },
  "eau de rose": { price: 100, unit: "litre" },
  "fleur doranger": { price: 700, unit: "litre" },
  "eau minerale": { price: 40, unit: "litre" },
  "eau gazeuze": { price: 60, unit: "litre" },
  "soda": { price: 100, unit: "litre" },
  
  // Baking & Desserts
  "sucre": { price: 100, unit: "kg" },
  "miel": { price: 2000, unit: "litre" },
  "chapelure": { price: 200, unit: "kg" },
  "feuilleté": { price: 500, unit: "kg" },
  "pate filo": { price: 400, unit: "kg" },
  
  // Breads
  "pain": { price: 20, unit: "unité" },
  "chapati": { price: 50, unit: "unité" },
  "pain de mie": { price: 150, unit: "unité" },
  "pain arabe": { price: 30, unit: "unité" },
  "pain baguette": { price: 25, unit: "unité" },
  
  // Beverages
  "café turc": { price: 2000, unit: "kg" },
  "café algerien": { price: 1000, unit: "kg" },
  "café": { price: 1500, unit: "kg" },
  "thé vert": { price: 800, unit: "kg" },
  "infusion": { price: 50, unit: "unité" },
  "chocolat noir": { price: 1200, unit: "kg" }
};

// Complete ingredient cost details for all menu items
export const ingredientCostDetails: PlatCostDetails[] = [
  // Soupes et Potages
  {
    menuItemId: "101", // Chorba Frik
    costDetails: [
      { name: "Oignons", quantity: 0.2, unit: "kg", cost: 70 * 0.2 },
      { name: "Frik (blé vert)", quantity: 0.3, unit: "kg", cost: 100 * 0.3 },
      { name: "Agneau haché", quantity: 0.08, unit: "kg", cost: 2800 * 0.08 },
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Persil", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Huile d'olive", quantity: 0.03, unit: "L", cost: 1000 * 0.03 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 260
  },
  {
    menuItemId: "102", // Lablabi
    costDetails: [
      { name: "Pois chiches", quantity: 0.2, unit: "kg", cost: 400 * 0.2 },
      { name: "Ail", quantity: 0.02, unit: "kg", cost: 300 * 0.02 },
      { name: "Cumin", quantity: 0.005, unit: "kg", cost: 400 * 0.005 },
      { name: "Paprika", quantity: 0.005, unit: "kg", cost: 400 * 0.005 },
      { name: "Huile d'olive", quantity: 0.02, unit: "L", cost: 1000 * 0.02 },
      { name: "Pain", quantity: 0.5, unit: "unité", cost: 20 * 0.5 },
      { name: "Oeuf", quantity: 1, unit: "unité", cost: 20 },
    ],
    totalCost: 100
  },
  {
    menuItemId: "103", // Harira
    costDetails: [
      { name: "Lentilles", quantity: 0.1, unit: "kg", cost: 350 * 0.1 },
      { name: "Pois chiches", quantity: 0.1, unit: "kg", cost: 400 * 0.1 },
      { name: "Viande hachée", quantity: 0.05, unit: "kg", cost: 2300 * 0.05 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Céleri", quantity: 0.05, unit: "kg", cost: 100 * 0.05 },
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Persil", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 195
  },
  {
    menuItemId: "104", // Chorba Beïda
    costDetails: [
      { name: "Vermicelles", quantity: 0.1, unit: "kg", cost: 120 * 0.1 },
      { name: "Poulet", quantity: 0.15, unit: "kg", cost: 400 * 0.15 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Coriandre", quantity: 0.01, unit: "kg", cost: 150 * 0.01 },
      { name: "Persil", quantity: 0.01, unit: "kg", cost: 150 * 0.01 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 87
  },
  {
    menuItemId: "105", // Chorba Loubia
    costDetails: [
      { name: "Haricots blancs", quantity: 0.15, unit: "kg", cost: 600 * 0.15 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Ail", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Cumin", quantity: 0.005, unit: "kg", cost: 400 * 0.005 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
    ],
    totalCost: 113
  },
  {
    menuItemId: "106", // Chorba Poisson
    costDetails: [
      { name: "Filet de poisson", quantity: 0.15, unit: "kg", cost: 1200 * 0.15 },
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Oignon", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Ail", quantity: 0.02, unit: "kg", cost: 300 * 0.02 },
      { name: "Persil", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 196
  },
  
  // Salades et Crudités
  {
    menuItemId: "107", // Salade Mechouia
    costDetails: [
      { name: "Poivrons", quantity: 0.3, unit: "kg", cost: 130 * 0.3 },
      { name: "Tomates", quantity: 0.2, unit: "kg", cost: 80 * 0.2 },
      { name: "Ail", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Huile d'olive", quantity: 0.03, unit: "L", cost: 1000 * 0.03 },
    ],
    totalCost: 78
  },
  {
    menuItemId: "108", // Salade Fattoush
    costDetails: [
      { name: "Laitue", quantity: 0.1, unit: "kg", cost: 120 * 0.1 },
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Concombre", quantity: 0.1, unit: "kg", cost: 100 * 0.1 },
      { name: "Radis", quantity: 0.05, unit: "kg", cost: 90 * 0.05 },
      { name: "Menthe", quantity: 0.01, unit: "kg", cost: 200 * 0.01 },
      { name: "Persil", quantity: 0.01, unit: "kg", cost: 150 * 0.01 },
      { name: "Pain arabe", quantity: 0.5, unit: "unité", cost: 30 * 0.5 },
      { name: "Sumac", quantity: 0.005, unit: "kg", cost: 800 * 0.005 },
      { name: "Huile d'olive", quantity: 0.03, unit: "L", cost: 1000 * 0.03 },
      { name: "Citron", quantity: 0.05, unit: "kg", cost: 150 * 0.05 },
    ],
    totalCost: 70
  },
  {
    menuItemId: "109", // Zaalouk
    costDetails: [
      { name: "Aubergines", quantity: 0.3, unit: "kg", cost: 120 * 0.3 },
      { name: "Tomates", quantity: 0.2, unit: "kg", cost: 80 * 0.2 },
      { name: "Ail", quantity: 0.02, unit: "kg", cost: 300 * 0.02 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Paprika", quantity: 0.005, unit: "kg", cost: 400 * 0.005 },
      { name: "Huile d'olive", quantity: 0.05, unit: "L", cost: 1000 * 0.05 },
    ],
    totalCost: 95
  },
  
  // Plus de salades
  {
    menuItemId: "110", // Salade d'Orange
    costDetails: [
      { name: "Oranges", quantity: 0.4, unit: "kg", cost: 150 * 0.4 },
      { name: "Cannelle", quantity: 0.005, unit: "kg", cost: 600 * 0.005 },
      { name: "Sucre", quantity: 0.01, unit: "kg", cost: 100 * 0.01 },
    ],
    totalCost: 64
  },
  {
    menuItemId: "111", // Salade de Carottes
    costDetails: [
      { name: "Carottes", quantity: 0.3, unit: "kg", cost: 75 * 0.3 },
      { name: "Citron", quantity: 0.05, unit: "kg", cost: 150 * 0.05 },
      { name: "Huile d'olive", quantity: 0.02, unit: "L", cost: 1000 * 0.02 },
      { name: "Ail", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Persil", quantity: 0.01, unit: "kg", cost: 150 * 0.01 },
    ],
    totalCost: 47
  },
  
  // Spécialités Chaudes
  {
    menuItemId: "115", // Bourek Viande
    costDetails: [
      { name: "Feuille de brick", quantity: 0.1, unit: "kg", cost: 500 * 0.1 },
      { name: "Viande hachée", quantity: 0.1, unit: "kg", cost: 2300 * 0.1 },
      { name: "Oignon", quantity: 0.05, unit: "kg", cost: 70 * 0.05 },
      { name: "Persil", quantity: 0.01, unit: "kg", cost: 150 * 0.01 },
      { name: "Oeuf", quantity: 0.5, unit: "unité", cost: 20 * 0.5 },
      { name: "Epices", quantity: 0.005, unit: "kg", cost: 400 * 0.005 },
      { name: "Huile", quantity: 0.05, unit: "L", cost: 400 * 0.05 },
    ],
    totalCost: 261
  },
  {
    menuItemId: "116", // Bourek Fromage
    costDetails: [
      { name: "Feuille de brick", quantity: 0.1, unit: "kg", cost: 500 * 0.1 },
      { name: "Fromage frais", quantity: 0.08, unit: "kg", cost: 1200 * 0.08 },
      { name: "Oeuf", quantity: 0.5, unit: "unité", cost: 20 * 0.5 },
      { name: "Beurre", quantity: 0.02, unit: "kg", cost: 1400 * 0.02 },
      { name: "Huile", quantity: 0.05, unit: "L", cost: 400 * 0.05 },
    ],
    totalCost: 188
  },
  
  // Plats traditionnels
  {
    menuItemId: "201", // Couscous Poulet
    costDetails: [
      { name: "Poulet", quantity: 0.3, unit: "kg", cost: 400 * 0.3 },
      { name: "Semoule", quantity: 0.2, unit: "kg", cost: 120 * 0.2 },
      { name: "Carottes", quantity: 0.1, unit: "kg", cost: 75 * 0.1 },
      { name: "Navets", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Courgettes", quantity: 0.1, unit: "kg", cost: 75 * 0.1 },
      { name: "Pois chiches", quantity: 0.05, unit: "kg", cost: 400 * 0.05 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 163
  },
  {
    menuItemId: "202", // Couscous Agneau
    costDetails: [
      { name: "Agneau", quantity: 0.2, unit: "kg", cost: 2600 * 0.2 },
      { name: "Semoule", quantity: 0.2, unit: "kg", cost: 120 * 0.2 },
      { name: "Carottes", quantity: 0.1, unit: "kg", cost: 75 * 0.1 },
      { name: "Navets", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Courgettes", quantity: 0.1, unit: "kg", cost: 75 * 0.1 },
      { name: "Pois chiches", quantity: 0.05, unit: "kg", cost: 400 * 0.05 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 558
  },
  
  // Tagines
  {
    menuItemId: "206", // Tagine Poulet Citron
    costDetails: [
      { name: "Poulet", quantity: 0.3, unit: "kg", cost: 400 * 0.3 },
      { name: "Citron confit", quantity: 0.05, unit: "kg", cost: 300 * 0.05 },
      { name: "Olives", quantity: 0.05, unit: "kg", cost: 600 * 0.05 },
      { name: "Ail", quantity: 0.02, unit: "kg", cost: 300 * 0.02 },
      { name: "Oignon", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
      { name: "Huile d'olive", quantity: 0.03, unit: "L", cost: 1000 * 0.03 },
    ],
    totalCost: 181
  },
  {
    menuItemId: "207", // Tagine Agneau Pruneaux
    costDetails: [
      { name: "Agneau", quantity: 0.25, unit: "kg", cost: 2600 * 0.25 },
      { name: "Pruneaux", quantity: 0.1, unit: "kg", cost: 800 * 0.1 },
      { name: "Amandes", quantity: 0.05, unit: "kg", cost: 1600 * 0.05 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Miel", quantity: 0.02, unit: "kg", cost: 2000 * 0.02 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
      { name: "Huile d'olive", quantity: 0.03, unit: "L", cost: 1000 * 0.03 },
    ],
    totalCost: 766
  },
  
  // Viandes
  {
    menuItemId: "211", // Steak Haché
    costDetails: [
      { name: "Viande hachée", quantity: 0.2, unit: "kg", cost: 2300 * 0.2 },
      { name: "Oeuf", quantity: 1, unit: "unité", cost: 20 },
      { name: "Chapelure", quantity: 0.02, unit: "kg", cost: 200 * 0.02 },
      { name: "Poivre", quantity: 0.005, unit: "kg", cost: 400 * 0.005 },
      { name: "Crème", quantity: 0.05, unit: "L", cost: 200 * 0.05 },
      { name: "Beurre", quantity: 0.02, unit: "kg", cost: 1400 * 0.02 },
    ],
    totalCost: 504
  },
  {
    menuItemId: "212", // Côtelettes d'Agneau
    costDetails: [
      { name: "Côtelettes d'agneau", quantity: 0.3, unit: "kg", cost: 2200 * 0.3 },
      { name: "Ail", quantity: 0.02, unit: "kg", cost: 300 * 0.02 },
      { name: "Romarin", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Huile d'olive", quantity: 0.02, unit: "L", cost: 1000 * 0.02 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
    ],
    totalCost: 682
  },
  
  // Végétarien
  {
    menuItemId: "226", // Falafel
    costDetails: [
      { name: "Pois chiches", quantity: 0.2, unit: "kg", cost: 400 * 0.2 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Ail", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Coriandre", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Persil", quantity: 0.02, unit: "kg", cost: 150 * 0.02 },
      { name: "Epices", quantity: 0.01, unit: "kg", cost: 400 * 0.01 },
      { name: "Huile", quantity: 0.1, unit: "L", cost: 400 * 0.1 },
    ],
    totalCost: 141
  },
  
  // Desserts
  {
    menuItemId: "302", // Kalb el Louz
    costDetails: [
      { name: "Semoule", quantity: 0.2, unit: "kg", cost: 120 * 0.2 },
      { name: "Amandes", quantity: 0.1, unit: "kg", cost: 1600 * 0.1 },
      { name: "Sucre", quantity: 0.1, unit: "kg", cost: 100 * 0.1 },
      { name: "Eau de rose", quantity: 0.02, unit: "L", cost: 100 * 0.02 },
    ],
    totalCost: 188
  },
  
  // Boissons
  {
    menuItemId: "501", // Thé à la Menthe
    costDetails: [
      { name: "Thé vert", quantity: 0.01, unit: "kg", cost: 800 * 0.01 },
      { name: "Menthe fraiche", quantity: 0.02, unit: "kg", cost: 200 * 0.02 },
      { name: "Sucre", quantity: 0.01, unit: "kg", cost: 100 * 0.01 },
    ],
    totalCost: 13
  },
  {
    menuItemId: "507", // Jus d'Orange Frais
    costDetails: [
      { name: "Oranges", quantity: 0.5, unit: "kg", cost: 150 * 0.5 },
      { name: "Sucre", quantity: 0.02, unit: "kg", cost: 100 * 0.02 },
    ],
    totalCost: 77
  }
];

// Generate full cost details for all menu items
export function generateCompleteCostDetails(): PlatCostDetails[] {
  // The existing detailed costs we've already defined
  const existingCosts = new Set(ingredientCostDetails.map(item => item.menuItemId));
  
  // For missing items, generate basic cost estimates (30-40% of selling price)
  const additionalCostDetails: PlatCostDetails[] = [];
  
  // Would be populated with menu items that don't have detailed costs yet
  // In a real implementation, you would iterate through all menu items here
  
  return [...ingredientCostDetails, ...additionalCostDetails];
}

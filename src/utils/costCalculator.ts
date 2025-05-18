
import { PlatCostDetails, IngredientCostDetail } from "../services/types";
import { ingredientPrices } from "../data/ingredientCosts";

/**
 * Calculate the cost for a menu item based on its ingredients
 * @param ingredients Array of ingredients with quantities
 * @returns Total cost and detailed breakdown
 */
export function calculateMenuItemCost(ingredients: Array<{name: string, quantity: number, unit: string}>): {
  totalCost: number;
  details: IngredientCostDetail[];
} {
  let totalCost = 0;
  const details: IngredientCostDetail[] = [];

  ingredients.forEach(ingredient => {
    const ingredientLower = ingredient.name.toLowerCase();
    const priceInfo = ingredientPrices[ingredientLower] || { price: 0, unit: ingredient.unit };
    
    const cost = priceInfo.price * ingredient.quantity;
    totalCost += cost;

    details.push({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit as any,
      cost
    });
  });

  return {
    totalCost,
    details
  };
}

/**
 * Get ingredient price per unit
 * @param ingredientName Name of the ingredient
 * @returns Price per unit and unit type
 */
export function getIngredientPrice(ingredientName: string): {price: number, unit: string} {
  const ingredientLower = ingredientName.toLowerCase();
  return ingredientPrices[ingredientLower] || { price: 0, unit: "kg" };
}

/**
 * Calculate profit margin and percentage
 * @param sellingPrice Selling price
 * @param cost Cost price
 * @returns Object with margin and percentage
 */
export function calculateMargin(sellingPrice: number, cost: number): {margin: number, percentage: number} {
  const margin = sellingPrice - cost;
  const percentage = (margin / sellingPrice) * 100;
  
  return {
    margin,
    percentage
  };
}

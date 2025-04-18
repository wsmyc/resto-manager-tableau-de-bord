
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MenuItem } from "@/components/menu/MenuItemTable";

// Define the interface for ingredient usage
interface IngredientUsage {
  menuItemId: string;
  menuItemName: string;
  ingredientId: string;
  ingredientName: string;
  quantityPerServing: number;
  unit: string;
  category: string;
}

// Mock data for ingredient usage per menu item
const mockIngredientUsage: IngredientUsage[] = [
  { menuItemId: "101", menuItemName: "Soupe à l'Oignon", ingredientId: "ing-001", ingredientName: "Oignons", quantityPerServing: 0.2, unit: "kg", category: "Légumes" },
  { menuItemId: "101", menuItemName: "Soupe à l'Oignon", ingredientId: "ing-004", ingredientName: "Farine", quantityPerServing: 0.05, unit: "kg", category: "Secs" },
  { menuItemId: "102", menuItemName: "Salade Niçoise", ingredientId: "ing-002", ingredientName: "Tomates", quantityPerServing: 0.15, unit: "kg", category: "Légumes" },
  { menuItemId: "201", menuItemName: "Burger Bistrot", ingredientId: "ing-003", ingredientName: "Bœuf haché", quantityPerServing: 0.18, unit: "kg", category: "Viandes" },
  { menuItemId: "201", menuItemName: "Burger Bistrot", ingredientId: "ing-001", ingredientName: "Oignons", quantityPerServing: 0.05, unit: "kg", category: "Légumes" },
  { menuItemId: "301", menuItemName: "Coq au Vin", ingredientId: "ing-005", ingredientName: "Lait", quantityPerServing: 0.1, unit: "L", category: "Produits Laitiers" },
];

// Mock menu items
const mockMenuItems = [
  { id: "101", name: "Soupe à l'Oignon", category: "Entrées", subcategory: "Soupes et Potages", price: 7.50, description: "Soupe traditionnelle aux oignons caramélisés, gratinée au fromage comté", ingredients: "Oignons, bouillon de bœuf, comté, pain baguette" },
  { id: "102", name: "Salade Niçoise", category: "Entrées", subcategory: "Salades et Crudités", price: 9.00, description: "Salade méditerranéenne avec thon, olives, œufs, et haricots verts", ingredients: "Thon, olives noires, œufs, tomates, vinaigrette" },
  { id: "201", name: "Burger Bistrot", category: "Plats", subcategory: "Sandwichs et Burgers", price: 15.00, description: "Pain brioché, steak haché charolais, oignons confits, roquefort", ingredients: "Bœuf, roquefort, oignons, salade" },
  { id: "301", name: "Coq au Vin", category: "Plats", subcategory: "Cuisine Traditionnelle", price: 16.00, description: "Cuisse de poulet mijotée au vin rouge (sans alcool), champignons", ingredients: "Poulet, carottes, oignons, bouillon" },
];

// Mock sales data
const mockSales = [
  { menuItemId: "101", quantity: 120 },
  { menuItemId: "102", quantity: 85 },
  { menuItemId: "201", quantity: 150 },
  { menuItemId: "301", quantity: 75 },
];

const IngredientUsageComponent = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("all");
  
  // Calculate ingredient usage based on sales
  const calculateIngredientUsage = () => {
    const usageData: { [key: string]: { name: string; category: string; totalUsage: number; unit: string } } = {};
    
    mockIngredientUsage.forEach(usage => {
      if (selectedMenuItem === "all" || usage.menuItemId === selectedMenuItem) {
        const menuItem = mockSales.find(sale => sale.menuItemId === usage.menuItemId);
        if (menuItem) {
          const totalUsage = usage.quantityPerServing * menuItem.quantity;
          
          if (usageData[usage.ingredientId]) {
            usageData[usage.ingredientId].totalUsage += totalUsage;
          } else {
            usageData[usage.ingredientId] = {
              name: usage.ingredientName,
              category: usage.category,
              totalUsage,
              unit: usage.unit
            };
          }
        }
      }
    });
    
    return Object.values(usageData).map(item => ({
      name: item.name,
      category: item.category,
      totalUsage: parseFloat(item.totalUsage.toFixed(2)),
      unit: item.unit
    }));
  };
  
  const usageData = calculateIngredientUsage();
  
  // Prepare chart data
  const chartData = usageData.map(item => ({
    name: item.name,
    usage: item.totalUsage,
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Utilisation des Ingrédients</h3>
        <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Sélectionner un plat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les plats</SelectItem>
            {mockMenuItems.map(item => (
              <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisation par Ingrédient</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#8884d8" name="Quantité utilisée" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Détails d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrédient</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Utilisation Totale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.totalUsage} {item.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Composition des Plats</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plat</TableHead>
                <TableHead>Ingrédient</TableHead>
                <TableHead>Quantité par Portion</TableHead>
                <TableHead>Ventes</TableHead>
                <TableHead>Utilisation Totale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIngredientUsage.map((usage, index) => {
                const sale = mockSales.find(s => s.menuItemId === usage.menuItemId);
                const totalUsage = sale ? usage.quantityPerServing * sale.quantity : 0;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{usage.menuItemName}</TableCell>
                    <TableCell>{usage.ingredientName}</TableCell>
                    <TableCell>{usage.quantityPerServing} {usage.unit}/portion</TableCell>
                    <TableCell>{sale?.quantity || 0} portions</TableCell>
                    <TableCell>{totalUsage.toFixed(2)} {usage.unit}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientUsageComponent;

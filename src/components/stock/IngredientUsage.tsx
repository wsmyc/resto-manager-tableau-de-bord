
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IngredientUsage {
  menuItemId: string;
  menuItemName: string;
  ingredientId: string;
  ingredientName: string;
  quantityPerServing: number;
  unit: string;
  category: string;
}

const mockIngredientUsage: IngredientUsage[] = [
  { menuItemId: "101", menuItemName: "Soupe à l'Oignon", ingredientId: "ing-001", ingredientName: "Oignons", quantityPerServing: 0.2, unit: "kg", category: "Légumes" },
  { menuItemId: "101", menuItemName: "Soupe à l'Oignon", ingredientId: "ing-004", ingredientName: "Farine", quantityPerServing: 0.05, unit: "kg", category: "Secs" },
  { menuItemId: "102", menuItemName: "Salade Niçoise", ingredientId: "ing-002", ingredientName: "Tomates", quantityPerServing: 0.15, unit: "kg", category: "Légumes" },
  { menuItemId: "102", menuItemName: "Salade Niçoise", ingredientId: "ing-006", ingredientName: "Thon", quantityPerServing: 0.1, unit: "kg", category: "Poissons" },
  { menuItemId: "102", menuItemName: "Salade Niçoise", ingredientId: "ing-007", ingredientName: "Œufs", quantityPerServing: 2, unit: "unité", category: "Œufs" },
  { menuItemId: "102", menuItemName: "Salade Niçoise", ingredientId: "ing-008", ingredientName: "Olives", quantityPerServing: 0.05, unit: "kg", category: "Conserves" },
  { menuItemId: "201", menuItemName: "Burger Bistrot", ingredientId: "ing-003", ingredientName: "Bœuf haché", quantityPerServing: 0.18, unit: "kg", category: "Viandes" },
  { menuItemId: "201", menuItemName: "Burger Bistrot", ingredientId: "ing-001", ingredientName: "Oignons", quantityPerServing: 0.05, unit: "kg", category: "Légumes" },
  { menuItemId: "201", menuItemName: "Burger Bistrot", ingredientId: "ing-009", ingredientName: "Pain burger", quantityPerServing: 1, unit: "unité", category: "Boulangerie" },
  { menuItemId: "301", menuItemName: "Coq au Vin", ingredientId: "ing-005", ingredientName: "Lait", quantityPerServing: 0.1, unit: "L", category: "Produits Laitiers" },
  { menuItemId: "301", menuItemName: "Coq au Vin", ingredientId: "ing-010", ingredientName: "Poulet", quantityPerServing: 0.25, unit: "kg", category: "Viandes" },
  { menuItemId: "401", menuItemName: "Gratin de Légumes", ingredientId: "ing-011", ingredientName: "Courgettes", quantityPerServing: 0.15, unit: "kg", category: "Légumes" },
  { menuItemId: "401", menuItemName: "Gratin de Légumes", ingredientId: "ing-012", ingredientName: "Aubergines", quantityPerServing: 0.15, unit: "kg", category: "Légumes" },
  { menuItemId: "401", menuItemName: "Gratin de Légumes", ingredientId: "ing-013", ingredientName: "Emmental", quantityPerServing: 0.08, unit: "kg", category: "Fromages" },
  { menuItemId: "403", menuItemName: "Risotto aux Champignons", ingredientId: "ing-014", ingredientName: "Riz arborio", quantityPerServing: 0.12, unit: "kg", category: "Riz" },
  { menuItemId: "403", menuItemName: "Risotto aux Champignons", ingredientId: "ing-015", ingredientName: "Champignons", quantityPerServing: 0.15, unit: "kg", category: "Légumes" },
  { menuItemId: "403", menuItemName: "Risotto aux Champignons", ingredientId: "ing-016", ingredientName: "Parmesan", quantityPerServing: 0.04, unit: "kg", category: "Fromages" },
  { menuItemId: "501", menuItemName: "Frites Maison", ingredientId: "ing-017", ingredientName: "Pommes de terre", quantityPerServing: 0.25, unit: "kg", category: "Légumes" },
  { menuItemId: "501", menuItemName: "Frites Maison", ingredientId: "ing-018", ingredientName: "Huile", quantityPerServing: 0.1, unit: "L", category: "Huiles" },
  { menuItemId: "801", menuItemName: "Crème Brûlée", ingredientId: "ing-019", ingredientName: "Crème liquide", quantityPerServing: 0.15, unit: "L", category: "Produits Laitiers" },
  { menuItemId: "801", menuItemName: "Crème Brûlée", ingredientId: "ing-007", ingredientName: "Œufs", quantityPerServing: 1, unit: "unité", category: "Œufs" },
  { menuItemId: "801", menuItemName: "Crème Brûlée", ingredientId: "ing-020", ingredientName: "Vanille", quantityPerServing: 0.01, unit: "kg", category: "Épices" },
  { menuItemId: "802", menuItemName: "Tarte Tatin", ingredientId: "ing-021", ingredientName: "Pommes", quantityPerServing: 0.2, unit: "kg", category: "Fruits" },
  { menuItemId: "802", menuItemName: "Tarte Tatin", ingredientId: "ing-022", ingredientName: "Pâte feuilletée", quantityPerServing: 0.1, unit: "kg", category: "Boulangerie" },
  { menuItemId: "802", menuItemName: "Tarte Tatin", ingredientId: "ing-023", ingredientName: "Beurre", quantityPerServing: 0.05, unit: "kg", category: "Produits Laitiers" },
  { menuItemId: "601", menuItemName: "Café Allongé", ingredientId: "ing-024", ingredientName: "Café", quantityPerServing: 0.02, unit: "kg", category: "Boissons" },
  { menuItemId: "602", menuItemName: "Thé à la Menthe Fraîche", ingredientId: "ing-025", ingredientName: "Thé vert", quantityPerServing: 0.005, unit: "kg", category: "Boissons" },
  { menuItemId: "602", menuItemName: "Thé à la Menthe Fraîche", ingredientId: "ing-026", ingredientName: "Menthe fraîche", quantityPerServing: 0.01, unit: "kg", category: "Herbes" },
  { menuItemId: "701", menuItemName: "Jus d'Orange Pressé", ingredientId: "ing-027", ingredientName: "Oranges", quantityPerServing: 0.4, unit: "kg", category: "Fruits" },
  // Additional ingredient usage data
  { menuItemId: "103", menuItemName: "Salade César", ingredientId: "ing-028", ingredientName: "Laitue romaine", quantityPerServing: 0.2, unit: "kg", category: "Légumes" },
  { menuItemId: "103", menuItemName: "Salade César", ingredientId: "ing-029", ingredientName: "Poulet grillé", quantityPerServing: 0.12, unit: "kg", category: "Viandes" },
  { menuItemId: "103", menuItemName: "Salade César", ingredientId: "ing-030", ingredientName: "Parmesan", quantityPerServing: 0.03, unit: "kg", category: "Fromages" },
  { menuItemId: "302", menuItemName: "Boeuf Bourguignon", ingredientId: "ing-031", ingredientName: "Bœuf", quantityPerServing: 0.25, unit: "kg", category: "Viandes" },
  { menuItemId: "302", menuItemName: "Boeuf Bourguignon", ingredientId: "ing-032", ingredientName: "Carottes", quantityPerServing: 0.1, unit: "kg", category: "Légumes" },
  { menuItemId: "202", menuItemName: "Club Sandwich", ingredientId: "ing-033", ingredientName: "Pain de mie", quantityPerServing: 3, unit: "unité", category: "Boulangerie" },
  { menuItemId: "202", menuItemName: "Club Sandwich", ingredientId: "ing-034", ingredientName: "Dinde", quantityPerServing: 0.12, unit: "kg", category: "Viandes" },
  { menuItemId: "803", menuItemName: "Mousse au Chocolat", ingredientId: "ing-035", ingredientName: "Chocolat noir", quantityPerServing: 0.08, unit: "kg", category: "Chocolat" },
  { menuItemId: "803", menuItemName: "Mousse au Chocolat", ingredientId: "ing-007", ingredientName: "Œufs", quantityPerServing: 2, unit: "unité", category: "Œufs" }
];

const mockMenuItems = [
  { id: "101", name: "Soupe à l'Oignon", category: "Entrées", subcategory: "Soupes et Potages", price: 7.50, description: "Soupe traditionnelle aux oignons caramélisés, gratinée au fromage comté", ingredients: "Oignons, bouillon de bœuf, comté, pain baguette" },
  { id: "102", name: "Salade Niçoise", category: "Entrées", subcategory: "Salades et Crudités", price: 9.00, description: "Salade méditerranéenne avec thon, olives, œufs, et haricots verts", ingredients: "Thon, olives noires, œufs, tomates, vinaigrette" },
  { id: "103", name: "Salade César", category: "Entrées", subcategory: "Salades et Crudités", price: 8.00, description: "Salade César avec poulet grillé et fromage parmesan", ingredients: "Laitue romaine, poulet grillé, fromage parmesan" },
  { id: "201", name: "Burger Bistrot", category: "Plats", subcategory: "Sandwichs et Burgers", price: 15.00, description: "Pain brioché, steak haché charolais, oignons confits, roquefort", ingredients: "Bœuf, roquefort, oignons, salade" },
  { id: "202", name: "Club Sandwich", category: "Plats", subcategory: "Sandwichs et Burgers", price: 12.00, description: "Club Sandwich avec pain de mie et dinde", ingredients: "Pain de mie, dinde, fromage parmesan" },
  { id: "301", name: "Coq au Vin", category: "Plats", subcategory: "Cuisine Traditionnelle", price: 16.00, description: "Cuisse de poulet mijotée au vin rouge (sans alcool), champignons", ingredients: "Poulet, carottes, oignons, bouillon" },
  { id: "302", name: "Boeuf Bourguignon", category: "Plats", subcategory: "Cuisine Traditionnelle", price: 18.00, description: "Boeuf bourguignon avec carottes et bœuf", ingredients: "Bœuf, carottes, fromage parmesan" },
  { id: "401", name: "Gratin de Légumes", category: "Plats", subcategory: "Plats préparés", price: 12.00, description: "Gratin de légumes aux courgettes, aubergines et emmental", ingredients: "Courgettes, aubergines, emmental" },
  { id: "403", name: "Risotto aux Champignons", category: "Plats", subcategory: "Plats préparés", price: 14.00, description: "Risotto aux champignons et riz arborio", ingredients: "Riz arborio, champignons" },
  { id: "501", name: "Frites Maison", category: "Plats", subcategory: "Plats préparés", price: 6.00, description: "Frites maison aux pommes de terre", ingredients: "Pommes de terre, huile" },
  { id: "601", name: "Café Allongé", category: "Boissons", subcategory: "Boissons", price: 2.00, description: "Café allongé", ingredients: "Café" },
  { id: "602", name: "Thé à la Menthe Fraîche", category: "Boissons", subcategory: "Boissons", price: 1.50, description: "Thé à la menthe fraîche", ingredients: "Thé vert, menthe fraîche" },
  { id: "701", name: "Jus d'Orange Pressé", category: "Boissons", subcategory: "Boissons", price: 3.00, description: "Jus d'orange pressé", ingredients: "Oranges" },
  { id: "801", name: "Crème Brûlée", category: "Desserts", subcategory: "Desserts", price: 4.00, description: "Crème brûlée", ingredients: "Crème liquide, œufs, vanille" },
  { id: "802", name: "Tarte Tatin", category: "Desserts", subcategory: "Desserts", price: 5.00, description: "Tarte tatin", ingredients: "Pommes, pâte feuilletée, beurre" },
  { id: "803", name: "Mousse au Chocolat", category: "Desserts", subcategory: "Desserts", price: 6.00, description: "Mousse au chocolat", ingredients: "Chocolat noir, œufs" }
];

const mockSales = [
  { menuItemId: "101", quantity: 120 },
  { menuItemId: "102", quantity: 85 },
  { menuItemId: "103", quantity: 50 },
  { menuItemId: "201", quantity: 150 },
  { menuItemId: "202", quantity: 100 },
  { menuItemId: "301", quantity: 75 },
  { menuItemId: "302", quantity: 100 },
  { menuItemId: "401", quantity: 60 },
  { menuItemId: "403", quantity: 90 },
  { menuItemId: "501", quantity: 200 },
  { menuItemId: "601", quantity: 300 },
  { menuItemId: "602", quantity: 150 },
  { menuItemId: "701", quantity: 180 },
  { menuItemId: "801", quantity: 95 },
  { menuItemId: "802", quantity: 80 },
  { menuItemId: "803", quantity: 70 }
];

const menuSubcategories = [
  "Soupes et Potages",
  "Salades et Crudités",
  "Sandwichs et Burgers",
  "Cuisine Traditionnelle",
  "Plats préparés",
  "Desserts",
  "Boissons"
];

const IngredientUsageComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const calculateIngredientUsage = () => {
    const usageData: { [key: string]: { name: string; category: string; totalUsage: number; unit: string } } = {};
    
    mockIngredientUsage.forEach(usage => {
      const menuItem = mockMenuItems.find(item => item.id === usage.menuItemId);
      if (selectedCategory === "all" || menuItem?.subcategory === selectedCategory) {
        const menuItemSales = mockSales.find(sale => sale.menuItemId === usage.menuItemId);
        if (menuItemSales) {
          const totalUsage = usage.quantityPerServing * menuItemSales.quantity;
          
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
    
    return Object.values(usageData);
  };
  
  const usageData = calculateIngredientUsage();
  
  const chartData = usageData.map(item => ({
    name: item.name,
    usage: item.totalUsage,
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Utilisation des Ingrédients</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {menuSubcategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
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
                    <TableCell>{item.totalUsage.toFixed(2)} {item.unit}</TableCell>
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

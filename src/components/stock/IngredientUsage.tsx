import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MenuItem } from "@/components/menu/MenuItemTable";

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
  { menuItemId: "701", menuItemName: "Jus d'Orange Pressé", ingredientId: "ing-027", ingredientName: "Oranges", quantityPerServing: 0.4, unit: "kg", category: "Fruits" }
];

const mockMenuItems = [
  { id: "101", name: "Soupe à l'Oignon", category: "Entrées", subcategory: "Soupes et Potages", price: 7.50, description: "Soupe traditionnelle aux oignons caramélisés, gratinée au fromage comté", ingredients: "Oignons, bouillon de bœuf, comté, pain baguette" },
  { id: "102", name: "Salade Niçoise", category: "Entrées", subcategory: "Salades et Crudités", price: 9.00, description: "Salade méditerranéenne avec thon, olives, œufs, et haricots verts", ingredients: "Thon, olives noires, œufs, tomates, vinaigrette" },
  { id: "201", name: "Burger Bistrot", category: "Plats", subcategory: "Sandwichs et Burgers", price: 15.00, description: "Pain brioché, steak haché charolais, oignons confits, roquefort", ingredients: "Bœuf, roquefort, oignons, salade" },
  { id: "301", name: "Coq au Vin", category: "Plats", subcategory: "Cuisine Traditionnelle", price: 16.00, description: "Cuisse de poulet mijotée au vin rouge (sans alcool), champignons", ingredients: "Poulet, carottes, oignons, bouillon" },
  { id: "401", name: "Gratin de Légumes", category: "Plats", subcategory: "Plats préparés", price: 12.00, description: "Gratin de légumes aux courgettes, aubergines et emmental", ingredients: "Courgettes, aubergines, emmental" },
  { id: "403", name: "Risotto aux Champignons", category: "Plats", subcategory: "Plats préparés", price: 14.00, description: "Risotto aux champignons et riz arborio", ingredients: "Riz arborio, champignons" },
  { id: "501", name: "Frites Maison", category: "Plats", subcategory: "Plats préparés", price: 6.00, description: "Frites maison aux pommes de terre", ingredients: "Pommes de terre, huile" },
  { id: "601", name: "Café Allongé", category: "Boissons", subcategory: "Boissons", price: 2.00, description: "Café allongé", ingredients: "Café" },
  { id: "602", name: "Thé à la Menthe Fraîche", category: "Boissons", subcategory: "Boissons", price: 1.50, description: "Thé à la menthe fraîche", ingredients: "Thé vert, menthe fraîche" },
  { id: "701", name: "Jus d'Orange Pressé", category: "Boissons", subcategory: "Boissons", price: 3.00, description: "Jus d'orange pressé", ingredients: "Oranges" },
  { id: "801", name: "Crème Brûlée", category: "Boissons", subcategory: "Boissons", price: 4.00, description: "Crème brûlée", ingredients: "Crème liquide, œufs, vanille" },
  { id: "802", name: "Tarte Tatin", category: "Boissons", subcategory: "Boissons", price: 5.00, description: "Tarte tatin", ingredients: "Pommes, pâte feuilletée, beurre" }
];

const mockSales = [
  { menuItemId: "101", quantity: 120 },
  { menuItemId: "102", quantity: 85 },
  { menuItemId: "201", quantity: 150 },
  { menuItemId: "301", quantity: 75 },
  { menuItemId: "401", quantity: 60 },
  { menuItemId: "403", quantity: 90 },
  { menuItemId: "501", quantity: 200 },
  { menuItemId: "601", quantity: 300 },
  { menuItemId: "602", quantity: 150 },
  { menuItemId: "701", quantity: 180 },
  { menuItemId: "801", quantity: 95 },
  { menuItemId: "802", quantity: 80 }
];

const IngredientUsageComponent = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("all");
  
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

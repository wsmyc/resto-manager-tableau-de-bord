
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Ingredient cost data interface
interface IngredientCost {
  ingredientId: string;
  ingredientName: string;
  category: string;
  costPerUnit: number;
  unit: string;
}

// Menu item cost data interface
interface MenuItemCost {
  menuItemId: string;
  menuItemName: string;
  category: string;
  subcategory: string;
  sellingPrice: number;
  ingredientCost: number;
  profitMargin: number;
  profitPercentage: number;
}

// Mock ingredient cost data
const mockIngredientCost: IngredientCost[] = [
  { ingredientId: "ing-001", ingredientName: "Oignons", category: "Légumes", costPerUnit: 1.75, unit: "kg" },
  { ingredientId: "ing-002", ingredientName: "Tomates", category: "Légumes", costPerUnit: 2.25, unit: "kg" },
  { ingredientId: "ing-003", ingredientName: "Bœuf haché", category: "Viandes", costPerUnit: 12.50, unit: "kg" },
  { ingredientId: "ing-004", ingredientName: "Farine", category: "Secs", costPerUnit: 1.20, unit: "kg" },
  { ingredientId: "ing-005", ingredientName: "Lait", category: "Produits Laitiers", costPerUnit: 1.00, unit: "L" },
];

// Mock menu item cost data
const mockMenuItemCosts: MenuItemCost[] = [
  { menuItemId: "101", menuItemName: "Soupe à l'Oignon", category: "Entrées", subcategory: "Soupes et Potages", sellingPrice: 7.50, ingredientCost: 2.15, profitMargin: 5.35, profitPercentage: 71.3 },
  { menuItemId: "102", menuItemName: "Salade Niçoise", category: "Entrées", subcategory: "Salades et Crudités", sellingPrice: 9.00, ingredientCost: 3.65, profitMargin: 5.35, profitPercentage: 59.4 },
  { menuItemId: "201", menuItemName: "Burger Bistrot", category: "Plats", subcategory: "Sandwichs et Burgers", sellingPrice: 15.00, ingredientCost: 5.75, profitMargin: 9.25, profitPercentage: 61.7 },
  { menuItemId: "301", menuItemName: "Coq au Vin", category: "Plats", subcategory: "Cuisine Traditionnelle", sellingPrice: 16.00, ingredientCost: 6.20, profitMargin: 9.80, profitPercentage: 61.3 },
  { menuItemId: "501", menuItemName: "Frites Maison", category: "Accompagnements", subcategory: "Féculents", sellingPrice: 5.00, ingredientCost: 1.30, profitMargin: 3.70, profitPercentage: 74.0 },
  { menuItemId: "801", menuItemName: "Crème Brûlée", category: "Desserts", subcategory: "Crèmes et Mousses", sellingPrice: 6.50, ingredientCost: 1.90, profitMargin: 4.60, profitPercentage: 70.8 },
];

// Monthly expense data
const mockMonthlyExpenses = [
  { month: "Jan", expenses: 3850 },
  { month: "Fév", expenses: 4230 },
  { month: "Mar", expenses: 3950 },
  { month: "Avr", expenses: 4100 },
  { month: "Mai", expenses: 4320 },
  { month: "Juin", expenses: 4580 },
  { month: "Juil", expenses: 4900 },
  { month: "Août", expenses: 5120 },
  { month: "Sep", expenses: 4750 },
  { month: "Oct", expenses: 4380 },
  { month: "Nov", expenses: 4200 },
  { month: "Déc", expenses: 4650 },
];

// Category expense data
const mockCategoryExpenses = [
  { name: "Légumes", value: 1450 },
  { name: "Viandes", value: 2850 },
  { name: "Produits Laitiers", value: 1200 },
  { name: "Boissons", value: 850 },
  { name: "Secs", value: 750 },
];

// COLORS for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExpenseAnalytics = () => {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [sortField, setSortField] = useState<string>("profitMargin");

  // Sort menu items by selected field
  const sortedMenuItems = [...mockMenuItemCosts].sort((a, b) => {
    if (sortField === "profitMargin") {
      return b.profitMargin - a.profitMargin;
    } else if (sortField === "profitPercentage") {
      return b.profitPercentage - a.profitPercentage;
    } else if (sortField === "ingredientCost") {
      return b.ingredientCost - a.ingredientCost;
    } else {
      return b.sellingPrice - a.sellingPrice;
    }
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profitability" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="profitability">Rentabilité</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        {/* Profitability tab */}
        <TabsContent value="profitability" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Rentabilité des Articles</h3>
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profitMargin">Marge (€)</SelectItem>
                <SelectItem value="profitPercentage">Marge (%)</SelectItem>
                <SelectItem value="ingredientCost">Coût des Ingrédients</SelectItem>
                <SelectItem value="sellingPrice">Prix de Vente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marge par Article</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedMenuItems}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="menuItemName" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                    <Bar dataKey="ingredientCost" stackId="a" fill="#8884d8" name="Coût des Ingrédients" />
                    <Bar dataKey="profitMargin" stackId="a" fill="#82ca9d" name="Marge" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marge (%)</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedMenuItems}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="menuItemName" angle={-45} textAnchor="end" height={70} />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => `${value} %`} />
                    <Legend />
                    <Bar dataKey="profitPercentage" fill="#82ca9d" name="Marge (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Coûts et Marges Détaillés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix de Vente</TableHead>
                    <TableHead>Coût des Ingrédients</TableHead>
                    <TableHead>Marge (€)</TableHead>
                    <TableHead>Marge (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMenuItems.map((item) => (
                    <TableRow key={item.menuItemId}>
                      <TableCell className="font-medium">{item.menuItemName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.sellingPrice.toFixed(2)} €</TableCell>
                      <TableCell>{item.ingredientCost.toFixed(2)} €</TableCell>
                      <TableCell>{item.profitMargin.toFixed(2)} €</TableCell>
                      <TableCell>{item.profitPercentage.toFixed(1)} %</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Expenses tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Répartition des Dépenses</h3>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dépenses par Catégorie</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryExpenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockCategoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Ingrédients par Coût</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingrédient</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Coût par unité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIngredientCost
                      .sort((a, b) => b.costPerUnit - a.costPerUnit)
                      .map((ingredient) => (
                      <TableRow key={ingredient.ingredientId}>
                        <TableCell className="font-medium">{ingredient.ingredientName}</TableCell>
                        <TableCell>{ingredient.category}</TableCell>
                        <TableCell>{ingredient.costPerUnit.toFixed(2)} €/{ingredient.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trends tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Dépenses</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockMonthlyExpenses}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Dépenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseAnalytics;

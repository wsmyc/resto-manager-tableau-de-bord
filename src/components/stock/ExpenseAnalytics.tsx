
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

// Mock ingredient cost data (with Algerian costs)
const mockIngredientCost: IngredientCost[] = [
  { ingredientId: "ing-001", ingredientName: "Oignons", category: "Légumes", costPerUnit: 70, unit: "kg" },
  { ingredientId: "ing-002", ingredientName: "Tomates", category: "Légumes", costPerUnit: 80, unit: "kg" },
  { ingredientId: "ing-003", ingredientName: "Agneau haché", category: "Viandes", costPerUnit: 2800, unit: "kg" },
  { ingredientId: "ing-004", ingredientName: "Frik (blé vert)", category: "Secs", costPerUnit: 100, unit: "kg" },
  { ingredientId: "ing-005", ingredientName: "Pois chiches", category: "Légumineuses", costPerUnit: 400, unit: "kg" },
  { ingredientId: "ing-006", ingredientName: "Ail", category: "Légumes", costPerUnit: 300, unit: "kg" },
  { ingredientId: "ing-007", ingredientName: "Poulet", category: "Viandes", costPerUnit: 400, unit: "kg" },
  { ingredientId: "ing-008", ingredientName: "Semoule", category: "Céréales", costPerUnit: 120, unit: "kg" },
  { ingredientId: "ing-009", ingredientName: "Merguez", category: "Viandes", costPerUnit: 1600, unit: "kg" },
];

// Mock menu item cost data with Algerian menu items
const mockMenuItemCosts: MenuItemCost[] = [
  { menuItemId: "101", menuItemName: "Chorba Frik", category: "Entrées", subcategory: "Soupes et Potages", sellingPrice: 500, ingredientCost: 260, profitMargin: 240, profitPercentage: 48.0 },
  { menuItemId: "102", menuItemName: "Lablabi", category: "Entrées", subcategory: "Soupes et Potages", sellingPrice: 450, ingredientCost: 100, profitMargin: 350, profitPercentage: 77.8 },
  { menuItemId: "201", menuItemName: "Couscous Poulet", category: "Plats", subcategory: "Cuisine Traditionnelle", sellingPrice: 750, ingredientCost: 240, profitMargin: 510, profitPercentage: 68.0 },
  { menuItemId: "207", menuItemName: "Tagine Agneau Pruneaux", category: "Plats", subcategory: "Cuisine Traditionnelle", sellingPrice: 3400, ingredientCost: 850, profitMargin: 2550, profitPercentage: 75.0 },
  { menuItemId: "211", menuItemName: "Steak Haché", category: "Plats", subcategory: "Viandes", sellingPrice: 2200, ingredientCost: 600, profitMargin: 1600, profitPercentage: 72.7 },
  { menuItemId: "501", menuItemName: "Thé à la Menthe", category: "Boissons", subcategory: "Boissons Chaudes", sellingPrice: 300, ingredientCost: 80, profitMargin: 220, profitPercentage: 73.3 },
];

// Monthly expense data in DZD
const mockMonthlyExpenses = [
  { month: "Jan", expenses: 385000 },
  { month: "Fév", expenses: 423000 },
  { month: "Mar", expenses: 395000 },
  { month: "Avr", expenses: 410000 },
  { month: "Mai", expenses: 432000 },
  { month: "Juin", expenses: 458000 },
  { month: "Juil", expenses: 490000 },
  { month: "Août", expenses: 512000 },
  { month: "Sep", expenses: 475000 },
  { month: "Oct", expenses: 438000 },
  { month: "Nov", expenses: 420000 },
  { month: "Déc", expenses: 465000 },
];

// Category expense data in DZD
const mockCategoryExpenses = [
  { name: "Légumes", value: 145000 },
  { name: "Viandes", value: 285000 },
  { name: "Produits Laitiers", value: 120000 },
  { name: "Boissons", value: 85000 },
  { name: "Secs", value: 75000 },
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
                <SelectItem value="profitMargin">Marge (DZD)</SelectItem>
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
                    <Tooltip formatter={(value) => `${value} DZD`} />
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
                    <TableHead>Marge (DZD)</TableHead>
                    <TableHead>Marge (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMenuItems.map((item) => (
                    <TableRow key={item.menuItemId}>
                      <TableCell className="font-medium">{item.menuItemName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.sellingPrice.toFixed(2)} DZD</TableCell>
                      <TableCell>{item.ingredientCost.toFixed(2)} DZD</TableCell>
                      <TableCell>{item.profitMargin.toFixed(2)} DZD</TableCell>
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
                    <Tooltip formatter={(value) => `${value} DZD`} />
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
                        <TableCell>{ingredient.costPerUnit.toFixed(2)} DZD/{ingredient.unit}</TableCell>
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
                  <Tooltip formatter={(value) => `${value} DZD`} />
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

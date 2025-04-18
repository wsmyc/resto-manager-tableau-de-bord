
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockInventory from "@/components/stock/StockInventory";
import IngredientUsage from "@/components/stock/IngredientUsage";
import ExpenseAnalytics from "@/components/stock/ExpenseAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Stocks</h1>
      </div>

      <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="usage">Utilisation</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventaire des Ingrédients</CardTitle>
              <CardDescription>
                Gérez votre inventaire, dates d'expiration et commandez des réapprovisionnements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockInventory />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des Ingrédients</CardTitle>
              <CardDescription>
                Suivez l'utilisation des ingrédients par plat ou période
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IngredientUsage />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Dépenses</CardTitle>
              <CardDescription>
                Visualisez les coûts et l'efficacité de votre inventaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManagement;

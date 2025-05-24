
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockInventory from "@/components/stock/StockInventory";
import IngredientUsage from "@/components/stock/IngredientUsage";
import ExpenseAnalytics from "@/components/stock/ExpenseAnalytics";
import IngredientInventory from "@/components/stock/IngredientInventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableIcon, BarChartBig } from "lucide-react";

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [useNewInventory, setUseNewInventory] = useState(true);

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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventaire des Ingrédients</CardTitle>
                <CardDescription>
                  Gérez votre inventaire, dates d'expiration et commandez des réapprovisionnements
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setUseNewInventory(!useNewInventory)}
              >
                {useNewInventory ? 
                  <><TableIcon size={16} className="mr-1" /> Vue simplifiée</> : 
                  <><BarChartBig size={16} className="mr-1" /> Vue détaillée</>
                }
              </Button>
            </CardHeader>
            <CardContent>
              {useNewInventory ? <IngredientInventory /> : <StockInventory />}
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

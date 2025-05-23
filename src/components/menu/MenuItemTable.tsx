
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, FileText, DollarSign } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { getCostDetailsByMenuItemId, estimateCost } from "@/data/ingredientCosts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 
    | "Entrées"
    | "Plats"
    | "Accompagnements"
    | "Boissons"
    | "Desserts";
  subcategory:
    | "Soupes et Potages"
    | "Salades et Crudités"
    | "Spécialités Chaudes"
    | "Cuisine Traditionnelle"
    | "Viandes"
    | "Poissons et Fruits de Mer"
    | "Végétarien"
    | "Féculents"
    | "Légumes"
    | "Pâtisseries"
    | "Fruits et Sorbets"
    | "Boissons Chaudes"
    | "Boissons Froides";
  ingredients?: string;
}

interface MenuItemTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

const MenuItemTable = ({ items, onEdit }: MenuItemTableProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const openCostDialog = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const getItemCost = (itemId: string) => {
    return getCostDetailsByMenuItemId(itemId);
  };
  
  // Fallback estimation for items without detailed costs (approximately 35% of selling price)
  const calculateCost = (item: MenuItem) => {
    const costData = getItemCost(item.id);
    return costData ? costData.totalCost : estimateCost(item.price);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de l'Article</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Sous-Catégorie</TableHead>
            <TableHead>Coût</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const costData = getItemCost(item.id);
            const costAmount = costData?.totalCost || estimateCost(item.price);
            const profitMargin = item.price - costAmount;
            const profitPercentage = ((profitMargin / item.price) * 100).toFixed(1);
            
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  <div className="flex items-center">
                    <span className="truncate">{item.description}</span>
                    {item.ingredients && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 ml-1">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">Ingrédients:</p>
                            <p>{item.ingredients}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.price.toFixed(2)} DZD</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-restaurant-primary/10 text-restaurant-primary border-restaurant-primary/20">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    {item.subcategory}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => openCostDialog(item.id)}
                      >
                        <FileText className="h-3 w-3" />
                        {costAmount.toFixed(2)} DZD
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Détails des Coûts - {item.name}</DialogTitle>
                        <DialogDescription>
                          Détails du coût des ingrédients et marges pour cet article.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Prix de vente</span>
                            <span className="text-xl font-bold">{item.price.toFixed(2)} DZD</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Coût total</span>
                            <span className="text-xl font-bold">{costAmount.toFixed(2)} DZD</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Marge</span>
                            <span className="text-xl font-bold text-emerald-600">{profitMargin.toFixed(2)} DZD</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Marge (%)</span>
                            <span className="text-xl font-bold text-emerald-600">{profitPercentage}%</span>
                          </div>
                        </div>
                        
                        <Card className="p-4">
                          <h4 className="font-medium mb-2">Détail des ingrédients</h4>
                          {costData ? (
                            <div className="divide-y">
                              {costData.costDetails.map((detail, idx) => (
                                <div key={idx} className="flex justify-between py-2">
                                  <div>
                                    <span className="font-medium">{detail.name}</span>
                                    <span className="text-sm text-muted-foreground ml-2">
                                      ({detail.quantity} {detail.unit})
                                    </span>
                                  </div>
                                  <span>{detail.cost.toFixed(2)} DZD</span>
                                </div>
                              ))}
                              <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                                <span>Total</span>
                                <span>{costData.totalCost.toFixed(2)} DZD</span>
                              </div>
                            </div>
                          ) : (
                            <div className="py-3 text-center text-muted-foreground">
                              <p>Estimation basée sur un coût de 35% du prix de vente.</p>
                              <p className="mt-2">Coût estimé: {costAmount.toFixed(2)} DZD</p>
                            </div>
                          )}
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => onEdit(item)}
                            className="h-8 w-8"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier le prix</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuItemTable;

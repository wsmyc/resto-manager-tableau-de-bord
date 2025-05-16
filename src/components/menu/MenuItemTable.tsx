
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Info, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useState } from "react";

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

// Ingredient cost data with values based on the provided Algerian costs
const mockIngredientCosts = [
  {
    menuItemId: "101", // Chorba Frik
    costDetails: [
      { name: "Oignons", quantity: 0.2, unit: "kg", cost: 70 * 0.2 },
      { name: "Frik (blé vert)", quantity: 0.3, unit: "kg", cost: 100 * 0.3 },
      { name: "Agneau haché", quantity: 0.08, unit: "kg", cost: 2800 * 0.08 },
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
    ],
    totalCost: 260
  },
  {
    menuItemId: "102", // Lablabi
    costDetails: [
      { name: "Pois chiches", quantity: 0.2, unit: "kg", cost: 400 * 0.2 },
      { name: "Ail", quantity: 0.02, unit: "kg", cost: 300 * 0.02 },
      { name: "Pain", quantity: 0.1, unit: "unité", cost: 20 * 0.1 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
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
      { name: "Tomates", quantity: 0.15, unit: "kg", cost: 80 * 0.15 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
    ],
    totalCost: 195
  },
  {
    menuItemId: "104", // Chorba Beïda
    costDetails: [
      { name: "Vermicelles", quantity: 0.1, unit: "kg", cost: 120 * 0.1 },
      { name: "Poulet", quantity: 0.15, unit: "kg", cost: 400 * 0.15 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
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
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
    ],
    totalCost: 113
  },
  {
    menuItemId: "201", // Couscous Poulet
    costDetails: [
      { name: "Poulet", quantity: 0.3, unit: "kg", cost: 400 * 0.3 },
      { name: "Semoule", quantity: 0.2, unit: "kg", cost: 120 * 0.2 },
      { name: "Légumes", quantity: 0.2, unit: "kg", cost: 60 },
      { name: "Pois chiches", quantity: 0.05, unit: "kg", cost: 400 * 0.05 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 20 },
    ],
    totalCost: 240
  },
  {
    menuItemId: "202", // Couscous Agneau
    costDetails: [
      { name: "Agneau", quantity: 0.2, unit: "kg", cost: 2600 * 0.2 },
      { name: "Semoule", quantity: 0.2, unit: "kg", cost: 120 * 0.2 },
      { name: "Légumes", quantity: 0.2, unit: "kg", cost: 60 },
      { name: "Pois chiches", quantity: 0.05, unit: "kg", cost: 400 * 0.05 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 20 },
    ],
    totalCost: 600
  },
  {
    menuItemId: "203", // Couscous Merguez
    costDetails: [
      { name: "Merguez", quantity: 0.2, unit: "kg", cost: 1600 * 0.2 },
      { name: "Semoule", quantity: 0.2, unit: "kg", cost: 120 * 0.2 },
      { name: "Légumes", quantity: 0.2, unit: "kg", cost: 60 },
      { name: "Pois chiches", quantity: 0.05, unit: "kg", cost: 400 * 0.05 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 20 },
    ],
    totalCost: 420
  },
  {
    menuItemId: "207", // Tagine Agneau Pruneaux
    costDetails: [
      { name: "Agneau", quantity: 0.25, unit: "kg", cost: 2600 * 0.25 },
      { name: "Pruneaux", quantity: 0.1, unit: "kg", cost: 800 * 0.1 },
      { name: "Amandes", quantity: 0.05, unit: "kg", cost: 1600 * 0.05 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Miel", quantity: 0.02, unit: "kg", cost: 2000 * 0.02 },
      { name: "Épices", quantity: 0.02, unit: "kg", cost: 30 },
    ],
    totalCost: 850
  },
  {
    menuItemId: "208", // Tagine Kefta
    costDetails: [
      { name: "Viande hachée", quantity: 0.25, unit: "kg", cost: 2300 * 0.25 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Tomates", quantity: 0.2, unit: "kg", cost: 80 * 0.2 },
      { name: "Ail", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Œufs", quantity: 2, unit: "unité", cost: 20 * 2 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
    ],
    totalCost: 621
  },
  {
    menuItemId: "211", // Steak Haché
    costDetails: [
      { name: "Viande hachée", quantity: 0.25, unit: "kg", cost: 2300 * 0.25 },
      { name: "Œuf", quantity: 1, unit: "unité", cost: 20 * 1 },
      { name: "Oignons", quantity: 0.05, unit: "kg", cost: 70 * 0.05 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
    ],
    totalCost: 600
  },
  {
    menuItemId: "226", // Falafel
    costDetails: [
      { name: "Pois chiches", quantity: 0.2, unit: "kg", cost: 400 * 0.2 },
      { name: "Oignons", quantity: 0.1, unit: "kg", cost: 70 * 0.1 },
      { name: "Ail", quantity: 0.01, unit: "kg", cost: 300 * 0.01 },
      { name: "Épices", quantity: 0.01, unit: "kg", cost: 15 },
    ],
    totalCost: 95
  },
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
  {
    menuItemId: "501", // Thé à la Menthe
    costDetails: [
      { name: "Thé vert", quantity: 0.01, unit: "kg", cost: 50 },
      { name: "Menthe fraîche", quantity: 0.02, unit: "kg", cost: 25 },
      { name: "Sucre", quantity: 0.005, unit: "kg", cost: 100 * 0.005 },
    ],
    totalCost: 80
  },
  {
    menuItemId: "507", // Jus d'Orange Frais
    costDetails: [
      { name: "Oranges", quantity: 0.5, unit: "kg", cost: 150 * 0.5 },
      { name: "Sucre", quantity: 0.02, unit: "kg", cost: 100 * 0.02 },
    ],
    totalCost: 77
  },
  {
    menuItemId: "512", // Limonade Maison
    costDetails: [
      { name: "Citron", quantity: 0.2, unit: "kg", cost: 150 * 0.2 },
      { name: "Sucre", quantity: 0.05, unit: "kg", cost: 100 * 0.05 },
      { name: "Menthe", quantity: 0.01, unit: "kg", cost: 25 },
    ],
    totalCost: 60
  }
];

const MenuItemTable = ({ items, onEdit, onDelete }: MenuItemTableProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const openCostDialog = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const getItemCost = (itemId: string) => {
    return mockIngredientCosts.find(cost => cost.menuItemId === itemId);
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
            const costAmount = costData?.totalCost || 0;
            const profitMargin = item.price - costAmount;
            const profitPercentage = costAmount > 0 ? ((profitMargin / item.price) * 100).toFixed(1) : "N/A";
            
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
                        {costAmount > 0 ? `${costAmount.toFixed(2)} DZD` : "N/A"}
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
                        {costData ? (
                          <>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Prix de vente</span>
                                <span className="text-xl font-bold">{item.price.toFixed(2)} DZD</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Coût total</span>
                                <span className="text-xl font-bold">{costData.totalCost.toFixed(2)} DZD</span>
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
                              </div>
                              <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                                <span>Total</span>
                                <span>{costData.totalCost.toFixed(2)} DZD</span>
                              </div>
                            </Card>
                          </>
                        ) : (
                          <div className="py-8 text-center text-muted-foreground">
                            Aucun détail de coût disponible pour cet article.
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onEdit(item)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

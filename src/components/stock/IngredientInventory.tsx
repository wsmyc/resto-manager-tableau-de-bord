
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ingredientPrices } from "@/data/ingredientCosts";

interface IngredientStock {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  pricePerUnit: number;
  minLevel: number;
  maxLevel: number;
  totalValue: number;
  lastRestocked?: string;
}

const IngredientInventory = () => {
  const [ingredients, setIngredients] = useState<IngredientStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<IngredientStock | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('tous');
  
  // Generate ingredients from the prices database
  useEffect(() => {
    const generateIngredients = () => {
      const ingredientList: IngredientStock[] = Object.entries(ingredientPrices).map(([name, info], index) => {
        // Group ingredients into categories
        let category = "Divers";
        if (name.includes("oignon") || name.includes("tomate") || name.includes("carotte") || 
            name.includes("poivron") || name.includes("ail") || name.includes("pomme") || name.includes("courgette")) {
          category = "Légumes";
        } else if (name.includes("agneau") || name.includes("viande") || name.includes("poulet") || 
                  name.includes("merguez") || name.includes("bœuf")) {
          category = "Viandes";
        } else if (name.includes("poisson") || name.includes("dorade") || name.includes("crevette") || 
                  name.includes("saumon")) {
          category = "Poissons et Fruits de mer";
        } else if (name.includes("frik") || name.includes("pois chiche") || name.includes("semoule") || 
                  name.includes("lentille") || name.includes("riz")) {
          category = "Céréales et Légumineuses";
        } else if (name.includes("huile") || name.includes("beurre")) {
          category = "Huiles et Matières grasses";
        } else if (name.includes("epice") || name.includes("menthe") || name.includes("persil") || 
                  name.includes("coriandre")) {
          category = "Épices et Herbes";
        } else if (name.includes("sucre") || name.includes("miel")) {
          category = "Sucres et Édulcorants";
        } else if (name.includes("lait") || name.includes("fromage") || name.includes("yaourt") || 
                  name.includes("crème") || name.includes("oeuf")) {
          category = "Produits Laitiers et Œufs";
        } else if (name.includes("orange") || name.includes("citron") || name.includes("pomme") || 
                  name.includes("fruit")) {
          category = "Fruits";
        }
        
        // Generate random stock levels for demonstration
        const maxLevel = Math.floor(Math.random() * 20) + 10; // 10-30
        const currentStock = Math.floor(Math.random() * maxLevel);
        const minLevel = Math.floor(maxLevel * 0.2); // 20% of max
        
        return {
          id: `ing-${index + 100}`,
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          category,
          currentStock,
          unit: info.unit,
          pricePerUnit: info.price,
          minLevel,
          maxLevel,
          totalValue: currentStock * info.price,
          lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
        };
      });
      
      setIngredients(ingredientList);
      setLoading(false);
    };
    
    generateIngredients();
  }, []);
  
  const handleRestock = (ingredient: IngredientStock) => {
    setCurrentIngredient(ingredient);
    setRestockAmount(ingredient.maxLevel - ingredient.currentStock);
    setRestockDialogOpen(true);
  };
  
  const confirmRestock = () => {
    if (!currentIngredient) return;
    
    const newStock = [...ingredients];
    const index = newStock.findIndex(i => i.id === currentIngredient.id);
    
    if (index !== -1) {
      const updatedStock = currentIngredient.currentStock + restockAmount;
      newStock[index] = {
        ...currentIngredient,
        currentStock: updatedStock,
        totalValue: updatedStock * currentIngredient.pricePerUnit,
        lastRestocked: new Date().toLocaleDateString('fr-FR')
      };
      
      setIngredients(newStock);
      toast.success(`${currentIngredient.name} réapprovisionné avec succès`);
      setRestockDialogOpen(false);
    }
  };
  
  const getStockStatus = (ingredient: IngredientStock) => {
    if (ingredient.currentStock <= ingredient.minLevel) {
      return { status: "faible", color: "bg-red-100 text-red-800 border-red-200" };
    } else if (ingredient.currentStock >= ingredient.maxLevel * 0.8) {
      return { status: "bon", color: "bg-green-100 text-green-800 border-green-200" };
    } else {
      return { status: "moyen", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    }
  };
  
  const filteredIngredients = ingredients
    .filter(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(ing => categoryFilter === 'tous' || ing.category === categoryFilter);
  
  const categories = ['Légumes', 'Viandes', 'Poissons et Fruits de mer', 'Céréales et Légumineuses', 
                     'Épices et Herbes', 'Huiles et Matières grasses', 'Sucres et Édulcorants',
                     'Produits Laitiers et Œufs', 'Fruits', 'Divers'];
                     
  const totalInventoryValue = ingredients.reduce((sum, ing) => sum + ing.totalValue, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="space-y-2 sm:space-y-0 sm:flex gap-4 flex-1">
          <Input 
            type="text" 
            placeholder="Rechercher un ingrédient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1 border rounded-md"
          >
            <option value="tous">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <Card className="p-4 bg-muted/50">
          <div className="font-medium text-sm">Valeur totale du stock</div>
          <div className="text-2xl font-bold">{totalInventoryValue.toLocaleString('fr-FR')} DZD</div>
        </Card>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Stock actuel</TableHead>
              <TableHead>Prix unitaire</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernier approvisionnement</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Chargement des ingrédients...
                </TableCell>
              </TableRow>
            ) : filteredIngredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Aucun ingrédient trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredIngredients.map(ingredient => {
                const status = getStockStatus(ingredient);
                
                return (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell>
                      {ingredient.currentStock} {ingredient.unit}
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            ingredient.currentStock <= ingredient.minLevel ? "bg-red-500" :
                            ingredient.currentStock >= ingredient.maxLevel * 0.8 ? "bg-green-500" : "bg-yellow-500"
                          }`}
                          style={{ width: `${(ingredient.currentStock / ingredient.maxLevel) * 100}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>{ingredient.pricePerUnit.toLocaleString('fr-FR')} DZD/{ingredient.unit}</TableCell>
                    <TableCell>{ingredient.totalValue.toLocaleString('fr-FR')} DZD</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        {status.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ingredient.lastRestocked || "N/A"}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRestock(ingredient)}
                      >
                        Réapprovisionner
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réapprovisionner {currentIngredient?.name}</DialogTitle>
            <DialogDescription>
              Ajouter du stock pour cet ingrédient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-stock" className="text-right">
                Stock actuel
              </Label>
              <div className="col-span-3">
                {currentIngredient?.currentStock} {currentIngredient?.unit}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-level" className="text-right">
                Niveau maximum
              </Label>
              <div className="col-span-3">
                {currentIngredient?.maxLevel} {currentIngredient?.unit}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="restock-amount" className="text-right">
                Quantité à ajouter
              </Label>
              <Input
                id="restock-amount"
                type="number"
                value={restockAmount}
                min={1}
                max={currentIngredient ? currentIngredient.maxLevel - currentIngredient.currentStock : 0}
                onChange={(e) => setRestockAmount(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Coût
              </Label>
              <div className="col-span-3">
                {currentIngredient ? (restockAmount * currentIngredient.pricePerUnit).toLocaleString('fr-FR') : 0} DZD
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestockDialogOpen(false)}>Annuler</Button>
            <Button onClick={confirmRestock}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientInventory;

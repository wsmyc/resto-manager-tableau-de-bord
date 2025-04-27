import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  alertThreshold: number;
  costPerUnit: number;
  
}

const sampleStock: StockItem[] = [
  {
    id: "ing-001",
    name: "Oignons",
    category: "Légumes",
    quantity: 25,
    unit: "kg",
    expiryDate: "2025-05-15",
    alertThreshold: 5,
    costPerUnit: 1.75,
    
  },
  {
    id: "ing-002",
    name: "Tomates",
    category: "Légumes",
    quantity: 15,
    unit: "kg",
    expiryDate: "2025-04-25",
    alertThreshold: 3,
    costPerUnit: 2.25,
    
  },
  {
    id: "ing-003",
    name: "Bœuf haché",
    category: "Viandes",
    quantity: 8,
    unit: "kg",
    expiryDate: "2025-04-21",
    alertThreshold: 2,
    costPerUnit: 12.50,
    
  },
  {
    id: "ing-004",
    name: "Farine",
    category: "Secs",
    quantity: 30,
    unit: "kg",
    expiryDate: "2025-08-10",
    alertThreshold: 5,
    costPerUnit: 1.20,
    
  },
  {
    id: "ing-005",
    name: "Lait",
    category: "Produits Laitiers",
    quantity: 12,
    unit: "L",
    expiryDate: "2025-04-20",
    alertThreshold: 4,
    costPerUnit: 1.00,
   
  }
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  quantity: z.number().min(0.1, { message: "La quantité doit être positive" }),
  unit: z.string().min(1, { message: "L'unité est requise" }),
  expiryDate: z.string().min(1, { message: "La date d'expiration est requise" }),
  alertThreshold: z.number().min(0, { message: "Le seuil d'alerte doit être positif" }),
  costPerUnit: z.number().min(0.01, { message: "Le coût par unité doit être positif" }),
  
});

const StockInventory = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>(sampleStock);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 1,
      unit: "kg",
      expiryDate: new Date().toISOString().split("T")[0],
      alertThreshold: 5,
      costPerUnit: 1,
      
    },
  });

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (values: z.infer<typeof formSchema>) => {
    const newItem: StockItem = {
      id: `ing-${Math.floor(Math.random() * 1000)}`,
      name: values.name,
      category: values.category,
      quantity: values.quantity,
      unit: values.unit,
      expiryDate: values.expiryDate,
      alertThreshold: values.alertThreshold,
      costPerUnit: values.costPerUnit,
     
    };
    
    setStockItems([...stockItems, newItem]);
    setIsAddDialogOpen(false);
    form.reset();
    toast({
      title: "Stock ajouté",
      description: `${values.name} a été ajouté à l'inventaire`,
    });
  };

  const handleRestock = (itemId: string) => {
    const quantity = restockQuantity[itemId];
    if (!quantity || quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez spécifier une quantité valide"
      });
      return;
    }
    
    const updatedItems = stockItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + quantity
        };
      }
      return item;
    });
    
    setStockItems(updatedItems);
    setRestockQuantity(prev => ({ ...prev, [itemId]: 0 }));
    toast({
      title: "Réapprovisionnement réussi",
      description: "Réapprovisionnement effectué avec succès"
    });
  };

  const categories = ["all", ...new Set(stockItems.map(item => item.category))];

  const isNearExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const isBelowThreshold = (quantity: number, threshold: number) => {
    return quantity <= threshold;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Toutes les catégories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exporter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un ingrédient</DialogTitle>
                <DialogDescription>
                  Entrez les détails de l'ingrédient à ajouter au stock
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unité</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Unité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                              <SelectItem value="g">Gramme (g)</SelectItem>
                              <SelectItem value="L">Litre (L)</SelectItem>
                              <SelectItem value="ml">Millilitre (ml)</SelectItem>
                              <SelectItem value="unité">Unité</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alertThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seuil d'alerte</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="costPerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coût par unité (€)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                  </div>
                  <DialogFooter>
                    <Button type="submit">Ajouter au stock</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Date d'expiration</TableHead>
              <TableHead>Coût</TableHead>
              
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Aucun ingrédient trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className={isExpired(item.expiryDate) ? "text-red-500" : isNearExpiry(item.expiryDate) ? "text-amber-500" : ""}>
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.costPerUnit.toFixed(2)} €/{item.unit}</TableCell>
                  
                  <TableCell>
                    {isExpired(item.expiryDate) && (
                      <Badge variant="destructive" className="mr-1">Expiré</Badge>
                    )}
                    {!isExpired(item.expiryDate) && isNearExpiry(item.expiryDate) && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 mr-1">Expire bientôt</Badge>
                    )}
                    {isBelowThreshold(item.quantity, item.alertThreshold) && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Stock bas</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 items-center">
                      <Input
                        type="number"
                        min="1"
                        value={restockQuantity[item.id] || ""}
                        onChange={(e) => setRestockQuantity(prev => ({
                          ...prev,
                          [item.id]: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="Qté"
                        className="w-20"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRestock(item.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Commander
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockInventory;

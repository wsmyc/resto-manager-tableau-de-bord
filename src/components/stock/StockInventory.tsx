
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

// Stock item interface
export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  alertThreshold: number;
  costPerUnit: number;
  supplier: string;
}

// Sample stock data
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
    supplier: "Légumes du Marché"
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
    supplier: "Légumes du Marché"
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
    supplier: "Boucherie Martin"
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
    supplier: "Grossiste Alimentaire"
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
    supplier: "Ferme Laitière"
  }
];

// Form schema for adding new stock
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  quantity: z.number().min(0.1, { message: "La quantité doit être positive" }),
  unit: z.string().min(1, { message: "L'unité est requise" }),
  expiryDate: z.string().min(1, { message: "La date d'expiration est requise" }),
  alertThreshold: z.number().min(0, { message: "Le seuil d'alerte doit être positif" }),
  costPerUnit: z.number().min(0.01, { message: "Le coût par unité doit être positif" }),
  supplier: z.string().min(1, { message: "Le fournisseur est requis" }),
});

const StockInventory = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>(sampleStock);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
      supplier: "",
    },
  });

  // Filter stock items based on search and category
  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle adding new stock item
  const handleAddItem = (values: z.infer<typeof formSchema>) => {
    const newItem: StockItem = {
      id: `ing-${Math.floor(Math.random() * 1000)}`,
      ...values
    };
    
    setStockItems([...stockItems, newItem]);
    setIsAddDialogOpen(false);
    form.reset();
    toast({
      title: "Stock ajouté",
      description: `${values.name} a été ajouté à l'inventaire`,
    });
  };

  // Get unique categories for filter
  const categories = ["all", ...new Set(stockItems.map(item => item.category))];

  // Check if item is near expiry (less than 7 days)
  const isNearExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  // Check if item is expired
  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  // Check if item is below threshold
  const isBelowThreshold = (quantity: number, threshold: number) => {
    return quantity <= threshold;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Rechercher par nom ou fournisseur..."
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
                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fournisseur</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
              <TableHead>Fournisseur</TableHead>
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
                  <TableCell>{item.supplier}</TableCell>
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
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Commander",
                          description: `Commande de ${item.name} envoyée au fournisseur`,
                        });
                      }}>
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

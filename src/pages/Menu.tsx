
import { 
  PlusCircle, 
  AlertCircle, 
  Utensils, 
  Menu as BurgerIcon,
  ChefHat, 
  Leaf, 
  CupSoda, 
  Cake 
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import MenuItemForm from "@/components/menu/MenuItemForm";
import MenuItemTable from "@/components/menu/MenuItemTable";
import MenuFilters from "@/components/menu/MenuFilters";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 
    | "Entrées"
    | "Burgers & Sandwichs"
    | "Plats Traditionnels"
    | "Options Végétariennes"
    | "Accompagnements"
    | "Boissons Chaudes"
    | "Boissons Froides"
    | "Desserts"
    | "Plats de Viande"
    | "Poissons & Fruits de Mer"
    | "Pizzas & Tartes"
    | "Pâtes"
    | "Salades"
    | "Plats Rapides"
    | "Végétarien";
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "Plats Traditionnels"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockMenuItems: MenuItem[] = [
          {
            id: "item-001",
            name: "Salade Niçoise",
            description: "Salade avec thon, œufs, tomates, olives et anchois",
            price: 10.50,
            category: "Entrées"
          },
          {
            id: "item-002",
            name: "Burger Classic",
            description: "Burger de bœuf avec fromage, laitue et tomate",
            price: 12.90,
            category: "Burgers & Sandwichs"
          },
          {
            id: "item-003",
            name: "Coq au Vin",
            description: "Poulet mijoté au vin rouge avec lardons et champignons",
            price: 16.50,
            category: "Plats Traditionnels"
          },
          {
            id: "item-004",
            name: "Ratatouille Végétarienne",
            description: "Plat de légumes provençaux mijotés",
            price: 14.00,
            category: "Options Végétariennes"
          },
          {
            id: "item-005",
            name: "Frites Maison",
            description: "Frites croustillantes faites maison",
            price: 4.50,
            category: "Accompagnements"
          },
          {
            id: "item-006",
            name: "Café Expresso",
            description: "Café expresso italien traditionnel",
            price: 2.50,
            category: "Boissons Chaudes"
          },
          {
            id: "item-007",
            name: "Limonade Fraîche",
            description: "Limonade maison rafraîchissante",
            price: 3.50,
            category: "Boissons Froides"
          },
          {
            id: "item-008",
            name: "Tarte Tatin",
            description: "Tarte aux pommes caramélisées renversée",
            price: 8.00,
            category: "Desserts"
          },
          // Nouvelles entrées - Plats de Viande
          {
            id: "item-009",
            name: "Entrecôte grillée",
            description: "Entrecôte grillée à la perfection, servie avec sauce au poivre",
            price: 22.00,
            category: "Plats de Viande"
          },
          {
            id: "item-010",
            name: "Faux-filet au poivre",
            description: "Faux-filet tendre nappé de sauce au poivre",
            price: 20.00,
            category: "Plats de Viande"
          },
          {
            id: "item-011",
            name: "Magret de canard",
            description: "Magret rôti, sauce miel et vinaigre balsamique",
            price: 23.00,
            category: "Plats de Viande"
          },
          {
            id: "item-012",
            name: "Confit de canard",
            description: "Confit de cuisse de canard croustillant, pommes sarladaises",
            price: 21.00,
            category: "Plats de Viande"
          },
          {
            id: "item-013",
            name: "Côte de porc grillée",
            description: "Côte de porc grillée, sauce moutarde à l'ancienne",
            price: 18.00,
            category: "Plats de Viande"
          },
          {
            id: "item-014",
            name: "Escalope de veau à la crème",
            description: "Escalope tendre, sauce crème et champignons",
            price: 19.50,
            category: "Plats de Viande"
          },
          {
            id: "item-015",
            name: "Filet mignon sauce moutarde",
            description: "Filet mignon tendre, sauce moutarde douce",
            price: 20.50,
            category: "Plats de Viande"
          },
          {
            id: "item-016",
            name: "Steak tartare",
            description: "Bœuf cru haché, câpres, cornichons et œuf cru",
            price: 19.00,
            category: "Plats de Viande"
          },
          {
            id: "item-017",
            name: "Andouillette de Troyes",
            description: "Spécialité de Troyes grillée, sauce moutarde",
            price: 17.50,
            category: "Plats de Viande"
          },
          {
            id: "item-018",
            name: "Jambon persillé",
            description: "Terrine de jambon au persil, servie froide",
            price: 10.00,
            category: "Plats de Viande"
          },
          // Poissons & Fruits de Mer
          {
            id: "item-019",
            name: "Moules marinières",
            description: "Moules fraîches au vin blanc et persil",
            price: 15.00,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-020",
            name: "Moules-frites",
            description: "Moules marinières servies avec frites maison",
            price: 16.00,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-021",
            name: "Filet de saumon grillé",
            description: "Saumon grillé, légumes croquants",
            price: 18.00,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-022",
            name: "Cabillaud sauce citronnée",
            description: "Dos de cabillaud, sauce citron légère",
            price: 17.50,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-023",
            name: "Calamars à la plancha",
            description: "Calamars grillés à l'ail et au persil",
            price: 16.50,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-024",
            name: "Crevettes sautées à l'ail",
            description: "Crevettes sautées, ail et piment doux",
            price: 17.00,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-025",
            name: "Risotto aux fruits de mer",
            description: "Risotto crémeux, moules, crevettes, calamars",
            price: 19.00,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-026",
            name: "Bouillabaisse",
            description: "Soupe de poissons provençale avec rouille et croûtons",
            price: 24.00,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-027",
            name: "Brandade de morue",
            description: "Purée de morue et pommes de terre à l'huile d'olive",
            price: 15.50,
            category: "Poissons & Fruits de Mer"
          },
          {
            id: "item-028",
            name: "Saint-Jacques poêlées",
            description: "Noix de Saint-Jacques poêlées, purée maison",
            price: 22.00,
            category: "Poissons & Fruits de Mer"
          },
          // Pizzas & Tartes
          {
            id: "item-029",
            name: "Pizza Reine",
            description: "Pizza avec jambon, champignons et fromage",
            price: 12.00,
            category: "Pizzas & Tartes"
          },
          {
            id: "item-030",
            name: "Pizza 4 fromages",
            description: "Pizza au bleu, chèvre, emmental, mozzarella",
            price: 13.00,
            category: "Pizzas & Tartes"
          },
          {
            id: "item-031",
            name: "Pizza Margherita",
            description: "Tomates, mozzarella, basilic frais",
            price: 11.00,
            category: "Pizzas & Tartes"
          },
          {
            id: "item-032",
            name: "Pizza au chorizo",
            description: "Chorizo épicé, tomates, mozzarella",
            price: 13.50,
            category: "Pizzas & Tartes"
          },
          {
            id: "item-033",
            name: "Tarte flambée",
            description: "Crème, oignons, lardons sur pâte fine",
            price: 12.50,
            category: "Pizzas & Tartes"
          },
          {
            id: "item-034",
            name: "Fougasse aux olives",
            description: "Pain garni aux olives noires et herbes",
            price: 8.50,
            category: "Pizzas & Tartes"
          },
          {
            id: "item-035",
            name: "Calzone",
            description: "Pizza repliée, jambon, champignons et œuf",
            price: 14.00,
            category: "Pizzas & Tartes"
          },
          // Pâtes
          {
            id: "item-036",
            name: "Lasagnes bolognaises",
            description: "Lasagnes maison au bœuf et sauce tomate",
            price: 14.50,
            category: "Pâtes"
          },
          {
            id: "item-037",
            name: "Penne à la carbonara",
            description: "Pâtes à la crème, lardons et parmesan",
            price: 13.00,
            category: "Pâtes"
          },
          {
            id: "item-038",
            name: "Tagliatelles aux champignons",
            description: "Tagliatelles fraîches aux champignons de saison",
            price: 13.50,
            category: "Pâtes"
          },
          {
            id: "item-039",
            name: "Spaghetti bolognaise",
            description: "Sauce tomate mijotée, viande hachée",
            price: 13.00,
            category: "Pâtes"
          },
          {
            id: "item-040",
            name: "Risotto aux légumes",
            description: "Riz crémeux aux légumes croquants",
            price: 14.00,
            category: "Pâtes"
          },
          {
            id: "item-041",
            name: "Gnocchis sauce tomate",
            description: "Gnocchis moelleux, sauce tomate maison",
            price: 12.50,
            category: "Pâtes"
          },
          // Salades
          {
            id: "item-042",
            name: "Salade César",
            description: "Poulet grillé, croûtons, parmesan, sauce César",
            price: 12.00,
            category: "Salades"
          },
          {
            id: "item-043",
            name: "Salade chèvre chaud",
            description: "Toasts de chèvre chaud, noix et miel",
            price: 11.50,
            category: "Salades"
          },
          {
            id: "item-044",
            name: "Salade Périgourdine",
            description: "Gésiers, magret fumé, œuf poché, noix",
            price: 14.00,
            category: "Salades"
          },
          {
            id: "item-045",
            name: "Salade de quinoa",
            description: "Quinoa, légumes grillés, herbes fraîches",
            price: 11.00,
            category: "Salades"
          },
          // Plats Rapides
          {
            id: "item-046",
            name: "Club Sandwich",
            description: "Poulet, bacon, tomate, laitue, mayonnaise",
            price: 11.50,
            category: "Plats Rapides"
          },
          {
            id: "item-047",
            name: "Sandwich jambon-beurre",
            description: "Pain baguette, beurre doux, jambon",
            price: 6.00,
            category: "Plats Rapides"
          },
          {
            id: "item-048",
            name: "Hot dog maison",
            description: "Saucisse fumée, moutarde, oignons",
            price: 7.50,
            category: "Plats Rapides"
          },
          {
            id: "item-049",
            name: "Wrap poulet-avocat",
            description: "Poulet grillé, avocat, salade, sauce yaourt",
            price: 9.50,
            category: "Plats Rapides"
          },
          // Végétarien
          {
            id: "item-050",
            name: "Gratin de courgettes",
            description: "Courgettes gratinées au fromage et à la crème",
            price: 11.00,
            category: "Végétarien"
          },
          {
            id: "item-051",
            name: "Omelette aux champignons",
            description: "Omelette moelleuse, champignons frais",
            price: 10.00,
            category: "Végétarien"
          },
          {
            id: "item-052",
            name: "Buddha bowl",
            description: "Légumes, pois chiches, avocat, riz, sauce sésame",
            price: 12.00,
            category: "Végétarien"
          },
          {
            id: "item-053",
            name: "Tofu grillé et légumes",
            description: "Tofu mariné, légumes sautés à l'asiatique",
            price: 11.50,
            category: "Végétarien"
          },
          // Desserts additionnels
          {
            id: "item-054",
            name: "Moelleux au chocolat",
            description: "Gâteau au chocolat fondant, cœur coulant",
            price: 6.50,
            category: "Desserts"
          },
          {
            id: "item-055",
            name: "Fondant au chocolat",
            description: "Fondant noir 70% cacao",
            price: 6.50,
            category: "Desserts"
          },
          {
            id: "item-056",
            name: "Panna cotta fruits rouges",
            description: "Crème gélifiée, coulis de fruits rouges",
            price: 6.00,
            category: "Desserts"
          },
          {
            id: "item-057",
            name: "Tiramisu",
            description: "Dessert italien au café et mascarpone",
            price: 6.00,
            category: "Desserts"
          },
          {
            id: "item-058",
            name: "Clafoutis aux cerises",
            description: "Gâteau moelleux aux cerises",
            price: 5.50,
            category: "Desserts"
          }
        ];
        setMenuItems(mockMenuItems);
      } catch (error) {
        console.error("Erreur lors du chargement du menu:", error);
        toast.error("Impossible de charger les articles du menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === "price") {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value as MenuItem["category"]
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "Plats Traditionnels"
    });
  };

  const handleAddItem = () => {
    if (!formData.name || !formData.description || formData.price === undefined || !formData.category) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category as MenuItem["category"]
    };

    setMenuItems([...menuItems, newItem]);
    toast.success("Article ajouté au menu");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!formData.name || !formData.description || formData.price === undefined || !formData.category) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === currentItemId 
          ? { 
              ...item, 
              name: formData.name!, 
              description: formData.description!, 
              price: formData.price!, 
              category: formData.category as MenuItem["category"] 
            } 
          : item
      )
    );
    
    toast.success("Article mis à jour");
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteItem = () => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== currentItemId));
    toast.success("Article supprimé");
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (item: MenuItem) => {
    setCurrentItemId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (itemId: string) => {
    setCurrentItemId(itemId);
    setIsDeleteDialogOpen(true);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all-categories" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="card-dashboard">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-restaurant-primary">Menu</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-restaurant-primary hover:bg-restaurant-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un Article
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Article</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouvel article à votre menu. Cliquez sur sauvegarder lorsque vous avez terminé.
                </DialogDescription>
              </DialogHeader>
              <MenuItemForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleCategoryChange={handleCategoryChange}
                onSubmit={handleAddItem}
                onCancel={() => setIsAddDialogOpen(false)}
                submitLabel="Ajouter"
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <MenuFilters
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
          />

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-accent"></div>
              <p className="mt-2 text-restaurant-primary">Chargement du menu...</p>
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium text-lg text-restaurant-primary">Aucun article trouvé</h3>
              <p className="text-gray-500 mt-1">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          ) : (
            <MenuItemTable
              items={filteredMenuItems}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un Article</DialogTitle>
            <DialogDescription>
              Modifiez les détails de l'article de menu. Cliquez sur sauvegarder lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleCategoryChange={handleCategoryChange}
            onSubmit={handleEditItem}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Sauvegarder"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de Suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article du menu ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;

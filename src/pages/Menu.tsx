
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
    | "Desserts";
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

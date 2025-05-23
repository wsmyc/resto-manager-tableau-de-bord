import { 
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import MenuItemTable, { MenuItem } from "@/components/menu/MenuItemTable";
import MenuFilters from "@/components/menu/MenuFilters";
import { updateMenuItemInFirebase } from "@/services/menuServices";

// Map categories from CSV to our menu item categories
const categoryMapping: Record<string, MenuItem["category"]> = {
  "Entrée": "Entrées",
  "Plat": "Plats",
  "Dessert": "Desserts",
  "Accompagnement": "Accompagnements",
  "Boisson": "Boissons"
};

// Map sous-categories from CSV to our menu item subcategories
const subcategoryMapping: Record<string, MenuItem["subcategory"]> = {
  "Soupe": "Soupes et Potages",
  "Salade": "Salades et Crudités",
  "Feuilleté": "Spécialités Chaudes",
  "Couscous": "Cuisine Traditionnelle",
  "Tagine": "Cuisine Traditionnelle",
  "Viande": "Viandes",
  "Poisson": "Poissons et Fruits de Mer",
  "Végétarien": "Végétarien",
  "Gâteau": "Pâtisseries",
  "Pâtisserie": "Pâtisseries",
  "Glace": "Fruits et Sorbets",
  "Riz": "Féculents",
  "Légumes": "Légumes",
  "Pain": "Féculents",
  "Chaude": "Boissons Chaudes",
  "Froid": "Boissons Froides"
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPriceEditDialogOpen, setIsPriceEditDialogOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState("");
  const [currentItemName, setCurrentItemName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all-subcategories");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Updated mock menu items using the Algerian menu data
        const mockMenuItems: MenuItem[] = [
          // Entrées - Soupes
          {
            id: "101",
            name: "Chorba Frik",
            description: "Soupe de blé vert concassé et viande",
            price: 500,
            category: "Entrées",
            subcategory: "Soupes et Potages",
            ingredients: "frik (blé vert), agneau haché, oignon, tomates, coriandre, persil, huile d'olive, sel, poivre, piment"
          },
          {
            id: "102",
            name: "Lablabi",
            description: "Soupe de pois chiches épicée",
            price: 450,
            category: "Entrées",
            subcategory: "Soupes et Potages",
            ingredients: "pois chiches, ail, cumin, paprika, huile d'olive, pain rassis, œuf (optionnel), coriandre"
          },
          {
            id: "103",
            name: "Harira",
            description: "Soupe de lentilles et pois chiches",
            price: 500,
            category: "Entrées",
            subcategory: "Soupes et Potages",
            ingredients: "lentilles, pois chiches, viande de bœuf, oignon, céleri, tomates, coriandre, persil, épices"
          },
          {
            id: "104",
            name: "Chorba Beïda",
            description: "Soupe blanche au poulet et vermicelles",
            price: 450,
            category: "Entrées",
            subcategory: "Soupes et Potages",
            ingredients: "vermicelles, poulet, oignon, coriandre, persil, épices"
          },
          {
            id: "105",
            name: "Chorba Loubia",
            description: "Soupe de haricots blancs",
            price: 450,
            category: "Entrées",
            subcategory: "Soupes et Potages",
            ingredients: "haricots blancs, oignon, tomate, ail, cumin, coriandre"
          },
          {
            id: "106",
            name: "Chorba Poisson",
            description: "Soupe de poisson à l'algéroise",
            price: 500,
            category: "Entrées",
            subcategory: "Soupes et Potages",
            ingredients: "filet de poisson, tomates, oignon, ail, persil, épices"
          },
          
          // Entrées - Salades
          {
            id: "107",
            name: "Salade Mechouia",
            description: "Salade tiède de poivrons et tomates grillés",
            price: 350,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "poivrons, tomates, ail, coriandre, huile d'olive, sel"
          },
          {
            id: "108",
            name: "Salade Fattoush",
            description: "Salade croquante au sumac et pain grillé",
            price: 350,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "laitue, tomates, concombre, radis, menthe, persil, pain arabe, sumac, huile d'olive, citron"
          },
          {
            id: "109",
            name: "Zaalouk",
            description: "Caviar froid d'aubergines",
            price: 600,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "aubergines, tomates, ail, coriandre, paprika, huile d'olive"
          },
          {
            id: "110",
            name: "Salade d'Orange",
            description: "Tranches d'orange à la cannelle",
            price: 300,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "oranges, cannelle, sucre"
          },
          {
            id: "111",
            name: "Salade de Carottes",
            description: "Carottes râpées assaisonnées",
            price: 300,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "carottes, citron, huile d'olive, ail, persil"
          },
          {
            id: "112",
            name: "Salade de Betterave",
            description: "Betteraves marinées au citron",
            price: 300,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "betteraves, citron, huile d'olive, sel"
          },
          {
            id: "113",
            name: "Salade Tabbouleh",
            description: "Persil, menthe et boulgour",
            price: 350,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "persil, menthe, boulgour, tomate, oignon, citron, huile d'olive"
          },
          {
            id: "114",
            name: "Salade Raïta",
            description: "Yaourt, concombre et menthe",
            price: 300,
            category: "Entrées",
            subcategory: "Salades et Crudités",
            ingredients: "yaourt, concombre, menthe, sel"
          },
          
          // Entrées - Feuilletés
          {
            id: "115",
            name: "Bourek Viande",
            description: "Brick croustillant à la viande hachée",
            price: 400,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "feuille de brick, viande hachée, oignon, persil, œuf, épices"
          },
          {
            id: "116",
            name: "Bourek Fromage",
            description: "Brick au fromage fondu",
            price: 300,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "feuille de brick, fromage frais, œuf, beurre"
          },
          {
            id: "117",
            name: "Brik à l'Œuf",
            description: "Brik croustillant œuf et thon",
            price: 450,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "feuille de brick, œuf, thon, câpres, persil"
          },
          {
            id: "118",
            name: "Mhadjeb",
            description: "Galette semoule farcie légumes",
            price: 250,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "semoule fine, oignon, poivron, tomate, épices"
          },
          {
            id: "119",
            name: "Bourek Épinards",
            description: "Brick aux épinards et fromage",
            price: 350,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "feuille de brick, épinards, fromage, ail, huile"
          },
          {
            id: "120",
            name: "Bourek Pommes de Terre",
            description: "Brick pommes de terre épicées",
            price: 350,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "feuille de brick, pommes de terre, cumin, sel, huile"
          },
          {
            id: "121",
            name: "Dolma Légumes",
            description: "Légumes farcis sauce tomate",
            price: 400,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "poivron, aubergine, courgette, riz, tomates, herbes"
          },
          {
            id: "122",
            name: "Makroud Sésame",
            description: "Gâteau semoule-sésame salé",
            price: 400,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "semoule, tahini (purée de sésame), eau, sel"
          },
          {
            id: "123",
            name: "Baghrir",
            description: "Crêpe mille trous servie sucrée",
            price: 400,
            category: "Entrées",
            subcategory: "Spécialités Chaudes",
            ingredients: "semoule, farine, levure, eau, sucre, sel"
          },
          
          // Plats - Couscous
          {
            id: "201",
            name: "Couscous Poulet",
            description: "Semoule et morceaux de poulet",
            price: 750,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "semoule, poulet fermier, carottes, navets, courgettes, pois chiches, épices"
          },
          {
            id: "202",
            name: "Couscous Agneau",
            description: "Semoule et morceaux d'agneau",
            price: 1000,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "semoule, agneau, carottes, navets, pois chiches, épices"
          },
          {
            id: "203",
            name: "Couscous Merguez",
            description: "Semoule et saucisses merguez",
            price: 900,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "semoule, merguez, pois chiches, légumes, épices"
          },
          {
            id: "204",
            name: "Couscous Poisson",
            description: "Semoule et poisson en sauce",
            price: 850,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "semoule, filets de poisson, légumes, épices"
          },
          {
            id: "205",
            name: "Couscous Végétarien",
            description: "Semoule et légumes variés",
            price: 700,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "semoule, carottes, courgettes, navets, pois chiches, épices"
          },
          
          // Plats - Tagines
          {
            id: "206",
            name: "Tagine Poulet Citron",
            description: "Poulet, citron confit et olives",
            price: 3200,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "poulet, citron confit, olives, ail, oignon, coriandre, épices"
          },
          {
            id: "207",
            name: "Tagine Agneau Pruneaux",
            description: "Agneau aux pruneaux et amandes",
            price: 3400,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "agneau, pruneaux, amandes, miel, épices"
          },
          {
            id: "208",
            name: "Tagine Kefta",
            description: "Boulettes de viande en sauce tomate",
            price: 2900,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "bœuf haché, oignon, ail, tomates, coriandre, épices"
          },
          {
            id: "209",
            name: "Tagine Poisson",
            description: "Poisson aux légumes",
            price: 3100,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "filet de poisson, tomates, poivrons, oignon, ail, coriandre, épices"
          },
          {
            id: "210",
            name: "Tagine Légumes",
            description: "Gratin de légumes aux épices",
            price: 2500,
            category: "Plats",
            subcategory: "Cuisine Traditionnelle",
            ingredients: "aubergines, courgettes, carottes, tomates, oignon, épices"
          },
          
          // Plats - Viandes
          {
            id: "211",
            name: "Steak Haché",
            description: "Steak de bœuf grillé, sauce au poivre",
            price: 2200,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "bœuf haché, œuf, chapelure, poivre, crème, beurre"
          },
          {
            id: "212",
            name: "Côtelettes d'Agneau",
            description: "Côtelettes marinées",
            price: 2800,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "côtelettes d'agneau, ail, romarin, huile d'olive, sel, poivre"
          },
          {
            id: "213",
            name: "Brochette de Poulet",
            description: "Poulet mariné yaourt-épicé",
            price: 2000,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "blanc de poulet, yaourt, paprika, cumin, ail, huile"
          },
          {
            id: "214",
            name: "Brochette de Kefta",
            description: "Boulettes merguez maison",
            price: 2200,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "viande hachée, paprika, cumin, coriandre, piment"
          },
          {
            id: "215",
            name: "Brochette d'Agneau",
            description: "Morceaux d'agneau grillés",
            price: 2400,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "agneau, ail, herbes, huile d'olive"
          },
          {
            id: "216",
            name: "Brochette de Dinde",
            description: "Dinde marinée aux herbes",
            price: 1800,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "dinde, ail, thym, huile d'olive"
          },
          {
            id: "217",
            name: "Assiette Mixte",
            description: "Sélection de grillades variées",
            price: 3000,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "agneau, poulet, merguez, épices"
          },
          {
            id: "218",
            name: "Merguez Grillée",
            description: "Saucisse piquante",
            price: 1200,
            category: "Plats",
            subcategory: "Viandes",
            ingredients: "merguez, épices"
          },
          
          // Plats - Poissons
          {
            id: "219",
            name: "Filet de Dorade",
            description: "Dorade au four, citron et herbes",
            price: 1500,
            category: "Plats",
            subcategory: "Poissons et Fruits de Mer",
            ingredients: "filet de dorade, citron, thym, ail, huile d'olive"
          },
          {
            id: "220",
            name: "Calamars Grillés",
            description: "Calamars à l'ail et persil",
            price: 2500,
            category: "Plats",
            subcategory: "Poissons et Fruits de Mer",
            ingredients: "calamars, ail, persil, huile d'olive, citron"
          },
          {
            id: "221",
            name: "Crevettes Chermoula",
            description: "Crevettes marinées et grillées",
            price: 3200,
            category: "Plats",
            subcategory: "Poissons et Fruits de Mer",
            ingredients: "crevettes, coriandre, persil, cumin, paprika, ail, huile"
          },
          {
            id: "222",
            name: "Saumon Grillé",
            description: "Saumon au four, citron et aneth",
            price: 1800,
            category: "Plats",
            subcategory: "Poissons et Fruits de Mer",
            ingredients: "saumon, citron, aneth, sel, poivre"
          },
          {
            id: "223",
            name: "Tilapia Rôti",
            description: "Tilapia et légumes",
            price: 1400,
            category: "Plats",
            subcategory: "Poissons et Fruits de Mer",
            ingredients: "tilapia, tomates, oignon, herbes, épices"
          },
          
          // Plats - Végétariens
          {
            id: "224",
            name: "Moussaka",
            description: "Gratin d'aubergines et pommes de terre",
            price: 1000,
            category: "Plats",
            subcategory: "Végétarien",
            ingredients: "aubergines, pommes de terre, tomates, oignon, ail, épices"
          },
          {
            id: "225",
            name: "Shakshouka",
            description: "Tomates, poivrons et œufs pochés",
            price: 400,
            category: "Plats",
            subcategory: "Végétarien",
            ingredients: "tomates, poivrons, œufs, oignon, ail, cumin, paprika"
          },
          {
            id: "226",
            name: "Falafel",
            description: "Boulettes de pois chiches frites",
            price: 700,
            category: "Plats",
            subcategory: "Végétarien",
            ingredients: "pois chiches, oignon, ail, coriandre, persil, épices"
          },
          {
            id: "227",
            name: "Couscous Sec",
            description: "Semoule nature",
            price: 300,
            category: "Plats",
            subcategory: "Végétarien",
            ingredients: "semoule, sel"
          },
          {
            id: "228",
            name: "Gratin Courgettes",
            description: "Courgettes gratinées",
            price: 600,
            category: "Plats",
            subcategory: "Végétarien",
            ingredients: "courgettes, fromage, crème, herbes"
          },
          
          // Desserts
          {
            id: "301",
            name: "Flan à la Vanille",
            description: "Flan maison onctueux",
            price: 450,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "lait, œufs, sucre, vanille"
          },
          {
            id: "302",
            name: "Kalb el Louz",
            description: "Gâteau aux amandes et semoule",
            price: 300,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "semoule, amandes, miel, eau de fleur d'oranger"
          },
          {
            id: "303",
            name: "Mhalbi",
            description: "Crème de riz à l'eau de rose",
            price: 500,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "riz, eau, sucre, eau de rose, pistaches"
          },
          {
            id: "304",
            name: "Ghribia",
            description: "Sablés fondants aux amandes",
            price: 400,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "farine, sucre, beurre, amandes"
          },
          {
            id: "305",
            name: "Baklava",
            description: "Feuilleté aux noix et miel",
            price: 600,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "pâte filo, noix, beurre, miel"
          },
          {
            id: "306",
            name: "Makroud",
            description: "Gâteau semoule et dattes",
            price: 300,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "semoule, pâte de dattes, huile, fleur d'oranger"
          },
          {
            id: "307",
            name: "Zlabia",
            description: "Beignet au miel",
            price: 300,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "farine, levure, sucre, miel"
          },
          {
            id: "308",
            name: "Baghrir",
            description: "Crêpe mille trous sucrée",
            price: 400,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "semoule, farine, levure, eau, sucre, sel"
          },
          {
            id: "309",
            name: "Makroud Sésame",
            description: "Gâteau semoule-sésame",
            price: 400,
            category: "Desserts",
            subcategory: "Pâtisseries",
            ingredients: "semoule, tahini, eau, sel"
          },
          {
            id: "310",
            name: "Glace Maison",
            description: "Glace artisanale selon l'offre",
            price: 500,
            category: "Desserts",
            subcategory: "Fruits et Sorbets",
            ingredients: "lait, crème, sucre, arômes saisonniers"
          },
          
          // Accompagnements
          {
            id: "401",
            name: "Riz Pilaf",
            description: "Riz basmati sauté aux oignons",
            price: 350,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "riz basmati, oignon, beurre, sel"
          },
          {
            id: "402",
            name: "Riz aux Vermicelles",
            description: "Riz et vermicelles grillés",
            price: 400,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "riz, vermicelles, beurre, sel"
          },
          {
            id: "403",
            name: "Légumes Grillés",
            description: "Poivrons, courgettes et aubergines",
            price: 500,
            category: "Accompagnements",
            subcategory: "Légumes",
            ingredients: "poivrons, courgettes, aubergines, huile d'olive, sel"
          },
          {
            id: "404",
            name: "Ratatouille",
            description: "Mélange mijoté de légumes",
            price: 650,
            category: "Accompagnements",
            subcategory: "Légumes",
            ingredients: "aubergine, courgette, tomate, poivron, oignon, ail, thym"
          },
          {
            id: "405",
            name: "Pommes de Terre Sautées",
            description: "Pommes de terre dorées",
            price: 400,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "pommes de terre, ail, persil, huile"
          },
          {
            id: "406",
            name: "Purée de Pommes de Terre",
            description: "Purée onctueuse",
            price: 500,
            category: "Accompagnements",
            subcategory: "Légumes",
            ingredients: "pommes de terre, beurre, lait, sel"
          },
          {
            id: "407",
            name: "Pain Maison",
            description: "Pain traditionnel cuit au four",
            price: 0,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "farine, eau, levure, sel"
          },
          {
            id: "408",
            name: "Msemen",
            description: "Galette feuilletée maison",
            price: 300,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "farine, semoule, eau, sel, huile"
          },
          {
            id: "409",
            name: "Chapati",
            description: "Pain plat nature",
            price: 200,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "farine, eau, sel"
          },
          {
            id: "410",
            name: "Frites Maison",
            description: "Frites croustillantes",
            price: 400,
            category: "Accompagnements",
            subcategory: "Féculents",
            ingredients: "pommes de terre, huile, sel"
          },
          
          // Boissons Chaudes
          {
            id: "501",
            name: "Thé à la Menthe",
            description: "Thé vert infusé à la menthe",
            price: 300,
            category: "Boissons",
            subcategory: "Boissons Chaudes",
            ingredients: "thé vert, menthe fraîche, sucre, eau"
          },
          {
            id: "502",
            name: "Café Turc",
            description: "Café moulu à la turque",
            price: 350,
            category: "Boissons",
            subcategory: "Boissons Chaudes",
            ingredients: "café turc, eau, sucre (optionnel)"
          },
          {
            id: "503",
            name: "Café Algérien",
            description: "Café court à l'algérienne",
            price: 300,
            category: "Boissons",
            subcategory: "Boissons Chaudes",
            ingredients: "café, eau, sucre (optionnel)"
          },
          {
            id: "504",
            name: "Thé Vert Nature",
            description: "Thé infusé nature",
            price: 250,
            category: "Boissons",
            subcategory: "Boissons Chaudes",
            ingredients: "thé vert, eau"
          },
          {
            id: "505",
            name: "Thé à l'Hibiscus",
            description: "Thé rouge parfumé",
            price: 300,
            category: "Boissons",
            subcategory: "Boissons Chaudes",
            ingredients: "hibiscus séché, sucre, eau"
          },
          {
            id: "506",
            name: "Café au Lait",
            description: "Café au lait chaud",
            price: 400,
            category: "Boissons",
            subcategory: "Boissons Chaudes",
            ingredients: "café, lait, sucre (optionnel)"
          },
          
          // Boissons Froides
          {
            id: "507",
            name: "Jus d'Orange Frais",
            description: "Jus pressé minute",
            price: 400,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "oranges fraîches"
          },
          {
            id: "508",
            name: "Jus de Pomme",
            description: "Jus naturel de pomme",
            price: 400,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "pommes"
          },
          {
            id: "509",
            name: "Jus de Carotte",
            description: "Jus pressé de carotte",
            price: 450,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "carottes"
          },
          {
            id: "510",
            name: "Jus de Grenade",
            description: "Jus naturel de grenade",
            price: 450,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "grenades"
          },
          {
            id: "511",
            name: "Jus de Pastèque",
            description: "Jus frais de pastèque",
            price: 450,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "pastèque"
          },
          {
            id: "512",
            name: "Limonade Maison",
            description: "Limonade citron-menthe",
            price: 350,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "citron, sucre, menthe, eau"
          },
          {
            id: "513",
            name: "Eau Minérale",
            description: "Bouteille 50 cl",
            price: 100,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "eau minérale"
          },
          {
            id: "514",
            name: "Eau Gazeuse",
            description: "Bouteille 50 cl",
            price: 150,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "eau gazeuse"
          },
          {
            id: "515",
            name: "Soda",
            description: "Assortiment de sodas",
            price: 150,
            category: "Boissons",
            subcategory: "Boissons Froides",
            ingredients: "eau gazeuse, arômes, sucre"
          },
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

  const handlePriceEdit = async () => {
    if (newPrice <= 0) {
      toast.error("Veuillez entrer un prix valide");
      return;
    }

    try {
      // Update in Firebase if it's a Firebase item (has numeric ID)
      if (currentItemId && !currentItemId.startsWith('item-')) {
        const currentItem = menuItems.find(item => item.id === currentItemId);
        if (currentItem) {
          await updateMenuItemInFirebase(currentItemId, {
            ...currentItem,
            price: newPrice
          });
        }
      }
      
      // Update local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === currentItemId 
            ? { ...item, price: newPrice } 
            : item
        )
      );
      
      toast.success("Prix mis à jour avec succès");
      setIsPriceEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Erreur lors de la mise à jour du prix");
    }
  };

  const openPriceEditDialog = (item: MenuItem) => {
    setCurrentItemId(item.id);
    setCurrentItemName(item.name);
    setNewPrice(item.price);
    setIsPriceEditDialogOpen(true);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all-categories" || item.category === categoryFilter;
    const matchesSubcategory = subcategoryFilter === "all-subcategories" || item.subcategory === subcategoryFilter;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="card-dashboard">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-restaurant-primary">Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuFilters
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            subcategoryFilter={subcategoryFilter}
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
            onSubcategoryChange={setSubcategoryFilter}
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
              onEdit={openPriceEditDialog}
              onDelete={() => {}} // Fonction vide pour désactiver la suppression
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isPriceEditDialogOpen} onOpenChange={setIsPriceEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Prix</DialogTitle>
            <DialogDescription>
              Modifiez le prix de vente de l'article "{currentItemName}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Nouveau Prix (DZD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                className="input-field"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPriceEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-restaurant-primary hover:bg-restaurant-primary/90" 
              onClick={handlePriceEdit}
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;

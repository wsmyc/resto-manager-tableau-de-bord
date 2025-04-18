import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface MenuItem {
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
    | "Spécialités Froides"
    | "Spécialités Chaudes"
    | "Sandwichs et Burgers"
    | "Cuisine Traditionnelle"
    | "Poissons et Fruits de Mer"
    | "Viandes"
    | "Végétarien"
    | "Féculents"
    | "Légumes"
    | "Boissons Chaudes"
    | "Boissons Froides"
    | "Crèmes et Mousses"
    | "Pâtisseries"
    | "Fruits et Sorbets";
  ingredients?: string;
}

interface MenuItemFormProps {
  formData: Partial<MenuItem>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: string) => void;
  handleSubcategoryChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

const MenuItemForm = ({
  formData,
  handleInputChange,
  handleCategoryChange,
  handleSubcategoryChange,
  onSubmit,
  onCancel,
  submitLabel
}: MenuItemFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      
      <div className="grid gap-2">
        <Label htmlFor="name">Nom de l'Article</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ingredients">Ingrédients</Label>
        <Textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients || ""}
          onChange={handleInputChange}
          className="input-field"
          rows={3}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Prix (€)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price !== undefined ? formData.price : ""}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select 
          value={formData.category || ""} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entrées">Entrées</SelectItem>
            <SelectItem value="Plats">Plats</SelectItem>
            <SelectItem value="Accompagnements">Accompagnements</SelectItem>
            <SelectItem value="Boissons">Boissons</SelectItem>
            <SelectItem value="Desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subcategory">Sous-Catégorie</Label>
        <Select 
          value={formData.subcategory || ""} 
          onValueChange={handleSubcategoryChange}
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Sélectionner une sous-catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Soupes et Potages">Soupes et Potages</SelectItem>
            <SelectItem value="Salades et Crudités">Salades et Crudités</SelectItem>
            <SelectItem value="Spécialités Froides">Spécialités Froides</SelectItem>
            <SelectItem value="Spécialités Chaudes">Spécialités Chaudes</SelectItem>
            <SelectItem value="Sandwichs et Burgers">Sandwichs et Burgers</SelectItem>
            <SelectItem value="Cuisine Traditionnelle">Cuisine Traditionnelle</SelectItem>
            <SelectItem value="Poissons et Fruits de Mer">Poissons et Fruits de Mer</SelectItem>
            <SelectItem value="Viandes">Viandes</SelectItem>
            <SelectItem value="Végétarien">Végétarien</SelectItem>
            <SelectItem value="Féculents">Féculents</SelectItem>
            <SelectItem value="Légumes">Légumes</SelectItem>
            <SelectItem value="Boissons Chaudes">Boissons Chaudes</SelectItem>
            <SelectItem value="Boissons Froides">Boissons Froides</SelectItem>
            <SelectItem value="Crèmes et Mousses">Crèmes et Mousses</SelectItem>
            <SelectItem value="Pâtisseries">Pâtisseries</SelectItem>
            <SelectItem value="Fruits et Sorbets">Fruits et Sorbets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button className="bg-restaurant-primary hover:bg-restaurant-primary/90" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MenuItemForm;

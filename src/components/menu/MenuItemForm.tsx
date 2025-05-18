
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from './MenuItemTable';

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
        <Label htmlFor="ingredients">Ingrédients (séparés par des virgules)</Label>
        <Textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients || ""}
          onChange={handleInputChange}
          className="input-field"
          rows={3}
          placeholder="Exemple: poulet, tomate, oignon, épices"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Prix (DZD)</Label>
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
            <SelectItem value="Soupe">Soupe</SelectItem>
            <SelectItem value="Salade">Salade</SelectItem>
            <SelectItem value="Feuilleté">Feuilleté</SelectItem>
            <SelectItem value="Couscous">Couscous</SelectItem>
            <SelectItem value="Tagine">Tagine</SelectItem>
            <SelectItem value="Viande">Viande</SelectItem>
            <SelectItem value="Poisson">Poisson</SelectItem>
            <SelectItem value="Végétarien">Végétarien</SelectItem>
            <SelectItem value="Riz">Riz</SelectItem>
            <SelectItem value="Légumes">Légumes</SelectItem>
            <SelectItem value="Pain">Pain</SelectItem>
            <SelectItem value="Chaude">Boissons Chaudes</SelectItem>
            <SelectItem value="Froid">Boissons Froides</SelectItem>
            <SelectItem value="Gâteau">Gâteaux</SelectItem>
            <SelectItem value="Pâtisserie">Pâtisseries</SelectItem>
            <SelectItem value="Glace">Glaces</SelectItem>
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

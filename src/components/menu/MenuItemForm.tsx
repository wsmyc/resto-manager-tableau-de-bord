
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
  isSubmitting?: boolean;
}

const MenuItemForm = ({
  formData,
  handleInputChange,
  handleCategoryChange,
  handleSubcategoryChange,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false
}: MenuItemFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      
      <div className="grid gap-2">
        <Label htmlFor="name">Nom de l'Article <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="input-field"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Input
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="input-field"
          required
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
        <Label htmlFor="price">Prix (DZD) <span className="text-red-500">*</span></Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price !== undefined ? formData.price : ""}
          onChange={handleInputChange}
          className="input-field"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.category || ""} 
          onValueChange={handleCategoryChange}
          required
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
        <Label htmlFor="subcategory">Sous-Catégorie <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.subcategory || ""} 
          onValueChange={handleSubcategoryChange}
          required
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Sélectionner une sous-catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Soupes et Potages">Soupes et Potages</SelectItem>
            <SelectItem value="Salades et Crudités">Salades et Crudités</SelectItem>
            <SelectItem value="Spécialités Chaudes">Spécialités Chaudes</SelectItem>
            <SelectItem value="Cuisine Traditionnelle">Cuisine Traditionnelle</SelectItem>
            <SelectItem value="Viandes">Viandes</SelectItem>
            <SelectItem value="Poissons et Fruits de Mer">Poissons et Fruits de Mer</SelectItem>
            <SelectItem value="Végétarien">Végétarien</SelectItem>
            <SelectItem value="Féculents">Féculents</SelectItem>
            <SelectItem value="Légumes">Légumes</SelectItem>
            <SelectItem value="Pâtisseries">Pâtisseries</SelectItem>
            <SelectItem value="Fruits et Sorbets">Fruits et Sorbets</SelectItem>
            <SelectItem value="Boissons Chaudes">Boissons Chaudes</SelectItem>
            <SelectItem value="Boissons Froides">Boissons Froides</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Annuler</Button>
        <Button 
          className="bg-restaurant-primary hover:bg-restaurant-primary/90" 
          onClick={onSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Traitement...' : submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MenuItemForm;

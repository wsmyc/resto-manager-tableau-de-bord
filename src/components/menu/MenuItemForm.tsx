
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from './MenuItemTable';
import { Loader2 } from 'lucide-react';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Le nom est requis";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "La description est requise";
    }
    
    if (formData.price === undefined || formData.price <= 0) {
      newErrors.price = "Un prix valide est requis";
    }
    
    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
    }
    
    if (!formData.subcategory) {
      newErrors.subcategory = "La sous-catégorie est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    } else {
      console.log("Formulaire invalide:", errors);
    }
  };
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom de l'Article <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className={`input-field ${errors.name ? "border-red-500" : ""}`}
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Input
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className={`input-field ${errors.description ? "border-red-500" : ""}`}
          required
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
          className={`input-field ${errors.price ? "border-red-500" : ""}`}
          required
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.category || ""} 
          onValueChange={handleCategoryChange}
          required
        >
          <SelectTrigger className={`input-field ${errors.category ? "border-red-500" : ""}`}>
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
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subcategory">Sous-Catégorie <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.subcategory || ""} 
          onValueChange={handleSubcategoryChange}
          required
        >
          <SelectTrigger className={`input-field ${errors.subcategory ? "border-red-500" : ""}`}>
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
        {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Annuler</Button>
        <Button 
          className="bg-restaurant-primary hover:bg-restaurant-primary/90" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MenuItemForm;

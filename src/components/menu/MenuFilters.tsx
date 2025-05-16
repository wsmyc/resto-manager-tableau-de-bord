
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  subcategoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

const MenuFilters = ({
  searchQuery,
  categoryFilter,
  subcategoryFilter,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange
}: MenuFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher un article..."
          className="input-field"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">Toutes les catégories</SelectItem>
            <SelectItem value="Entrées">Entrées</SelectItem>
            <SelectItem value="Plats">Plats</SelectItem>
            <SelectItem value="Accompagnements">Accompagnements</SelectItem>
            <SelectItem value="Boissons">Boissons</SelectItem>
            <SelectItem value="Desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-48">
        <Select value={subcategoryFilter} onValueChange={onSubcategoryChange}>
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Toutes les sous-catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-subcategories">Toutes les sous-catégories</SelectItem>
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
    </div>
  );
};

export default MenuFilters;

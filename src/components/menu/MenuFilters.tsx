
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const MenuFilters = ({
  searchQuery,
  categoryFilter,
  onSearchChange,
  onCategoryChange
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
      <div className="w-full sm:w-64">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Entrées">Entrées</SelectItem>
            <SelectItem value="Plats">Plats</SelectItem>
            <SelectItem value="Desserts">Desserts</SelectItem>
            <SelectItem value="Boissons">Boissons</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MenuFilters;

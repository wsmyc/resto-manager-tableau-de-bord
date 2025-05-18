
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
  counts: {
    all: number;
    stock: number;
    commande: number;
    reservation: number;
  };
}

export const NotificationFilters = ({ activeFilter, onFilterChange, counts }: NotificationFiltersProps) => {
  return (
    <div className="border-b">
      <Tabs value={activeFilter} onValueChange={onFilterChange}>
        <TabsList className="w-full justify-start rounded-none h-12 bg-gray-50">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">
            Toutes ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="stock" className="data-[state=active]:bg-white">
            Stock ({counts.stock})
          </TabsTrigger>
          <TabsTrigger value="commande" className="data-[state=active]:bg-white">
            Commandes ({counts.commande})
          </TabsTrigger>
          <TabsTrigger value="reservation" className="data-[state=active]:bg-white">
            Réservations ({counts.reservation})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, CircleDollarSign, PieChart } from "lucide-react";

interface CustomReportsSectionProps {
  onGeneratePDF: () => void;
}

export const CustomReportsSection = ({ onGeneratePDF }: CustomReportsSectionProps) => {
  return (
    <Card className="card-dashboard">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5 text-restaurant-accent" />
          Rapports Personnalisés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2" 
            onClick={onGeneratePDF}
          >
            <FileText className="h-10 w-10 text-restaurant-primary" />
            <span className="text-restaurant-primary font-medium">Rapport de Ventes</span>
            <span className="text-xs text-muted-foreground">Ventes détaillées par période</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2" 
            onClick={onGeneratePDF}
          >
            <CircleDollarSign className="h-10 w-10 text-restaurant-primary" />
            <span className="text-restaurant-primary font-medium">Rapport Financier</span>
            <span className="text-xs text-muted-foreground">Revenus et dépenses</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2" 
            onClick={onGeneratePDF}
          >
            <PieChart className="h-10 w-10 text-restaurant-primary" />
            <span className="text-restaurant-primary font-medium">Analyse des Plats</span>
            <span className="text-xs text-muted-foreground">Popularité et rentabilité</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

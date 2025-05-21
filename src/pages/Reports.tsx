
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, FileText, CircleDollarSign, PieChart as PieChartIcon } from "lucide-react";
import { toast } from "sonner";

// Import refactored components
import { RevenueReport } from "@/components/reports/RevenueReport";
import { PopularDishesReport } from "@/components/reports/PopularDishesReport";
import { CategorySalesReport } from "@/components/reports/CategorySalesReport";
import { CustomReportsSection } from "@/components/reports/CustomReportsSection";

// Import utilities
import { generateReportPDF } from "@/utils/pdfGenerator";

// Import data
import { 
  weeklyRevenueData, 
  monthlyRevenueData, 
  salesByCategoryData,
  COLORS,
  popularDishesData
} from "@/data/reportsData";

const Reports = () => {
  const [reportType, setReportType] = useState("weekly");
  const [reportCategory, setReportCategory] = useState("revenue");
  
  const handleGeneratePDF = () => {
    toast.success("Génération du PDF en cours...");
    
    const result = generateReportPDF({
      reportType,
      reportCategory,
      weeklyRevenueData,
      monthlyRevenueData,
      popularDishesData,
      salesByCategoryData
    });
    
    if (result) {
      toast.success("PDF généré avec succès");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-restaurant-primary">Rapports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Tabs defaultValue="revenue" onValueChange={setReportCategory}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="revenue">
                    <CircleDollarSign className="mr-2 h-4 w-4" />
                    Revenus
                  </TabsTrigger>
                  <TabsTrigger value="dishes">
                    <PieChartIcon className="mr-2 h-4 w-4" />
                    Plats
                  </TabsTrigger>
                  <TabsTrigger value="categories">
                    <FileText className="mr-2 h-4 w-4" />
                    Catégories
                  </TabsTrigger>
                </TabsList>
              
                <TabsContent value="revenue">
                  <RevenueReport 
                    reportType={reportType} 
                    data={reportType === "weekly" ? weeklyRevenueData : monthlyRevenueData} 
                  />
                </TabsContent>

                <TabsContent value="dishes">
                  <PopularDishesReport data={popularDishesData} />
                </TabsContent>

                <TabsContent value="categories">
                  <CategorySalesReport data={salesByCategoryData} colors={COLORS} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-row gap-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full sm:w-40 input-field">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="annual">Annuel</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                className="bg-restaurant-primary hover:bg-restaurant-primary/90"
                onClick={handleGeneratePDF}
              >
                <FileDown className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomReportsSection onGeneratePDF={handleGeneratePDF} />
    </div>
  );
};

export default Reports;

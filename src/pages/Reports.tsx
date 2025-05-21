
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileDown, FileText, Calendar, CircleDollarSign, PieChart as PieChartIcon } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
// Import jspdf-autotable with require to avoid TypeScript errors
import 'jspdf-autotable';

// Extend jsPDF types to include autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    internal: {
      getNumberOfPages: () => number;
      [key: string]: any;
    };
  }
}

// Sample data for reports - updated to DZD
const weeklyRevenueData = [
  { name: 'Lun', revenue: 13800 },
  { name: 'Mar', revenue: 15200 },
  { name: 'Mer', revenue: 16500 },
  { name: 'Jeu', revenue: 18000 },
  { name: 'Ven', revenue: 25400 },
  { name: 'Sam', revenue: 28200 },
  { name: 'Dim', revenue: 18700 }
];

const monthlyRevenueData = [
  { name: 'Jan', revenue: 420000 },
  { name: 'Fév', revenue: 380000 },
  { name: 'Mar', revenue: 450000 },
  { name: 'Avr', revenue: 400000 },
  { name: 'Mai', revenue: 520000 },
  { name: 'Juin', revenue: 580000 },
  { name: 'Juil', revenue: 650000 },
  { name: 'Aoû', revenue: 680000 },
  { name: 'Sep', revenue: 560000 },
  { name: 'Oct', revenue: 490000 },
  { name: 'Nov', revenue: 470000 },
  { name: 'Déc', revenue: 550000 }
];

const salesByCategoryData = [
  { name: 'Entrées', value: 10 },
  { name: 'Couscous', value: 15 },
  { name: 'Tagines', value: 25 },
  { name: 'Brochettes', value: 12 },
  { name: 'Boissons', value: 8 },
  { name: 'Desserts', value: 7 },
  { name: 'Accompagnements', value: 13 },
  { name: 'Poissons', value: 10 }
];

const COLORS = [
  '#245536', '#ba3400', '#db9051', '#e9b975', 
  '#5c8d76', '#f06e28', '#94c6ac', '#ffd166'
];

const popularDishesData = [
  { name: 'Chorba Frik', orders: 68 },
  { name: 'Couscous Agneau', orders: 52 },
  { name: 'Tagine Agneau Pruneaux', orders: 45 },
  { name: 'Brochette de Kefta', orders: 40 },
  { name: 'Thé à la Menthe', orders: 38 }
];

const Reports = () => {
  const [reportType, setReportType] = useState("weekly");
  const [reportCategory, setReportCategory] = useState("revenue");
  
  const handleGeneratePDF = () => {
    toast.success("Génération du PDF en cours...");
    
    // Create a new PDF instance
    const doc = new jsPDF();
    
    // Add title
    const title = reportCategory === "revenue" 
      ? `Rapport de revenus ${reportType === "weekly" ? "hebdomadaires" : "mensuels"}`
      : reportCategory === "dishes" 
      ? "Rapport des plats populaires"
      : "Rapport de ventes par catégorie";
    
    doc.setFontSize(18);
    doc.text(title, 105, 20, { align: "center" });
    doc.setFontSize(12);
    
    // Add date
    const today = new Date().toLocaleDateString('fr-FR');
    doc.text(`Date: ${today}`, 20, 30);
    
    // Add content based on current report type
    if (reportCategory === "revenue") {
      const data = reportType === "weekly" ? weeklyRevenueData : monthlyRevenueData;
      
      // Add total
      const total = calculateTotalRevenue(data);
      doc.text(`Total: ${total.toLocaleString()} DZD`, 20, 40);
      
      // Create table
      const tableData = data.map(item => [item.name, `${item.revenue.toLocaleString()} DZD`]);
      doc.autoTable({
        startY: 50,
        head: [['Période', 'Revenu']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [36, 85, 54] }
      });
      
    } else if (reportCategory === "dishes") {
      doc.text("Les plats les plus populaires", 20, 40);
      
      const tableData = popularDishesData.map(item => [item.name, item.orders.toString()]);
      doc.autoTable({
        startY: 50,
        head: [['Plat', 'Nombre de commandes']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [186, 52, 0] }
      });
      
    } else if (reportCategory === "categories") {
      doc.text("Ventes par catégorie", 20, 40);
      
      const tableData = salesByCategoryData.map(item => [item.name, `${item.value}%`]);
      doc.autoTable({
        startY: 50,
        head: [['Catégorie', 'Pourcentage']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [36, 85, 54] }
      });
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('Restaurant Algérien - Rapport généré automatiquement', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`rapport-${reportCategory}-${today.replace(/\//g, '-')}.pdf`);
    
    toast.success("PDF généré avec succès");
  };

  const calculateTotalRevenue = (data: any[]) => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
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
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-restaurant-accent" />
                        {reportType === "weekly" 
                          ? "Revenus Hebdomadaires" 
                          : reportType === "monthly" 
                          ? "Revenus Mensuels" 
                          : "Revenus Annuels"}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Total: {calculateTotalRevenue(reportType === "weekly" ? weeklyRevenueData : monthlyRevenueData).toLocaleString()} DZD
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={reportType === "weekly" ? weeklyRevenueData : monthlyRevenueData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value} DZD`, 'Revenus']}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Bar dataKey="revenue" fill="#245536" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="dishes">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-restaurant-accent" />
                        Plats les Plus Populaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={popularDishesData}
                            margin={{ top: 10, right: 30, left: 80, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip 
                              formatter={(value) => [`${value}`, 'Commandes']}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Bar dataKey="orders" fill="#ba3400" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="categories">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <FileText className="h-5 w-5 text-restaurant-accent" />
                        Ventes par Catégorie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={salesByCategoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {salesByCategoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Pourcentage']}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
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

      <Card className="card-dashboard">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5 text-restaurant-accent" />
            Rapports Personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2" onClick={handleGeneratePDF}>
              <FileText className="h-10 w-10 text-restaurant-primary" />
              <span className="text-restaurant-primary font-medium">Rapport de Ventes</span>
              <span className="text-xs text-muted-foreground">Ventes détaillées par période</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2" onClick={handleGeneratePDF}>
              <CircleDollarSign className="h-10 w-10 text-restaurant-primary" />
              <span className="text-restaurant-primary font-medium">Rapport Financier</span>
              <span className="text-xs text-muted-foreground">Revenus et dépenses</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2" onClick={handleGeneratePDF}>
              <PieChartIcon className="h-10 w-10 text-restaurant-primary" />
              <span className="text-restaurant-primary font-medium">Analyse des Plats</span>
              <span className="text-xs text-muted-foreground">Popularité et rentabilité</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;


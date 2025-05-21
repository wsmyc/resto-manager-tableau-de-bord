
import jsPDF from "jspdf";
import 'jspdf-autotable';

// Extend jsPDF types to include autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    internal: {
      getNumberOfPages: () => number;
      pageSize: { 
        width: number; 
        height: number;
        getWidth: () => number;
        getHeight: () => number;
      };
      events: any;
      scaleFactor: number;
      pages: number[];
      getEncryptor: (objectId: number) => (data: string) => string;
      [key: string]: any;
    };
  }
}

export interface ReportData {
  reportType: string;
  reportCategory: string;
  weeklyRevenueData: Array<{ name: string; revenue: number }>;
  monthlyRevenueData: Array<{ name: string; revenue: number }>;
  popularDishesData: Array<{ name: string; orders: number }>;
  salesByCategoryData: Array<{ name: string; value: number }>;
}

export const generateReportPDF = (reportData: ReportData) => {
  const { reportType, reportCategory, weeklyRevenueData, monthlyRevenueData, popularDishesData, salesByCategoryData } = reportData;
  
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
  
  return true;
};

export const calculateTotalRevenue = (data: any[]) => {
  return data.reduce((sum, item) => sum + item.revenue, 0);
};


// src/utils/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Ingredient, Plat } from "@/services/types";
import { monthlyRevenueData, weeklyRevenueData, salesByCategoryData, popularDishesData } from "@/data/reportsData";

// Fix the type declaration to avoid TypeScript errors
declare module "jspdf" {
  interface jsPDF {
    internal: {
      events: any;
      scaleFactor: number;
      pageSize: {
        width: number;
        height: number;
        getWidth: () => number;
        getHeight: () => number;
      };
      pages: number[];
      getNumberOfPages: () => number;
      getEncryptor: (objectId: number) => (data: string) => string;
      [key: string]: any;
    };
    addHTML: (
      element: HTMLElement,
      x: number,
      y: number,
      options: any,
      callback: (doc: jsPDF) => void
    ) => jsPDF;
    addPage: (format?: string | number[], orientation?: "p" | "portrait" | "l" | "landscape") => jsPDF;
    setFont: (fontName: string, fontStyle?: string, fontWeight?: string | number) => jsPDF;
    setLineWidth: (width: number) => jsPDF;
    line: (x1: number, y1: number, x2: number, y2: number, style?: string) => jsPDF;
    splitTextToSize: (text: string, maxlen: number, options?: any) => any;
  }
}

/**
 * Génère un rapport PDF générique pour les rapports
 */
export const generateReportPDF = (config: { 
  reportType: string; 
  reportCategory: string;
  weeklyRevenueData: any[];
  monthlyRevenueData: any[];
  popularDishesData: any[];
  salesByCategoryData: any[];
}) => {
  const { reportType, reportCategory } = config;
  
  // Choose appropriate title based on selection
  let title = "Rapport";
  if (reportCategory === "revenue") {
    title = "Rapport de Revenus";
    if (reportType === "weekly") {
      generateRevenuePDF(weeklyRevenueData, "Hebdomadaire");
    } else if (reportType === "monthly") {
      generateRevenuePDF(monthlyRevenueData, "Mensuel");
    } else {
      generateRevenuePDF(monthlyRevenueData, "Annuel");
    }
  } else if (reportCategory === "dishes") {
    generatePopularDishesPDF(popularDishesData);
  } else if (reportCategory === "categories") {
    generateCategorySalesPDF(salesByCategoryData);
  } else {
    // Default to revenue report if category is unknown
    generateRevenuePDF(monthlyRevenueData, "Mensuel");
  }
  
  return true; // Return success
};

/**
 * Génère un rapport PDF pour les revenus
 */
export const generateRevenuePDF = (data = monthlyRevenueData, period = "Mensuel") => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text(`Rapport de Revenus ${period}`, 105, 20, { align: "center" });
  
  // Sous-titre et date
  doc.setFontSize(12);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Généré le ${dateStr}`, 105, 30, { align: "center" });
  
  // Tableau de données
  const tableColumn = ["Période", "Revenus (DZD)"];
  const tableRows = data.map(item => {
    return [item.name, item.revenue.toLocaleString("fr-FR") + " DZD"];
  });
  
  // Générer le tableau
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
    foot: [["Total", data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString("fr-FR") + " DZD"]],
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
  });
  
  // Sauvegarde
  doc.save(`rapport-revenus-${period.toLowerCase()}.pdf`);
};

/**
 * Génère un rapport PDF pour les plats populaires
 */
export const generatePopularDishesPDF = (data = popularDishesData) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text("Rapport des Plats Populaires", 105, 20, { align: "center" });
  
  // Sous-titre et date
  doc.setFontSize(12);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Généré le ${dateStr}`, 105, 30, { align: "center" });
  
  // Tableau de données
  const tableColumn = ["Nom du Plat", "Nombre de Commandes"];
  const tableRows = data.map(item => {
    return [item.name, item.orders.toString()];
  });
  
  // Générer le tableau
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
  });
  
  // Pagination
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${totalPages}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    });
  }
  
  // Sauvegarde
  doc.save("rapport-plats-populaires.pdf");
};

/**
 * Génère un rapport PDF pour les ventes par catégorie
 */
export const generateCategorySalesPDF = (data = salesByCategoryData) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text("Rapport des Ventes par Catégorie", 105, 20, { align: "center" });
  
  // Sous-titre et date
  doc.setFontSize(12);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Généré le ${dateStr}`, 105, 30, { align: "center" });
  
  // Tableau de données
  const tableColumn = ["Catégorie", "Pourcentage des Ventes (%)"];
  const tableRows = data.map(item => {
    return [item.name, `${item.value}%`];
  });
  
  // Générer le tableau
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
  });
  
  // Pagination
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${totalPages}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    });
  }
  
  // Sauvegarde
  doc.save("rapport-categories.pdf");
};

/**
 * Génère un rapport PDF pour les plats
 */
export const generateMenuItemsPDF = (items: Plat[]) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text("Catalogue des Plats", 105, 20, { align: "center" });
  
  // Sous-titre et date
  doc.setFontSize(12);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Généré le ${dateStr}`, 105, 30, { align: "center" });
  
  // Tableau de données
  const tableColumn = ["Nom", "Catégorie", "Prix", "Note"];
  const tableRows = items.map(item => {
    return [
      item.nom_du_plat,
      typeof item.idCat === 'string' ? item.idCat : `Catégorie ${item.idCat}`,
      (item.prix || 0).toLocaleString("fr-FR") + " DZD",
      `${item.note}/5`
    ];
  });
  
  // Générer le tableau
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
  });
  
  // Pagination
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${totalPages}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    });
  }
  
  // Sauvegarde
  doc.save("catalogue-plats.pdf");
};

/**
 * Génère un rapport PDF pour l'inventaire
 */
export const generateInventoryPDF = (items: Ingredient[]) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text("Rapport d'Inventaire", 105, 20, { align: "center" });
  
  // Sous-titre et date
  doc.setFontSize(12);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Généré le ${dateStr}`, 105, 30, { align: "center" });
  
  // Tableau de données
  const tableColumn = ["Ingrédient", "Quantité", "Unité", "Seuil d'Alerte"];
  const tableRows = items.map(item => {
    return [
      item.nom, 
      item.quantite.toString(),
      item.unite,
      item.seuil_alerte.toString()
    ];
  });
  
  // Générer le tableau
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
  });
  
  // Pagination
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${totalPages}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    });
  }
  
  // Sauvegarde
  doc.save("rapport-inventaire.pdf");
};

/**
 * Génère un rapport PDF personnalisé
 */
export const generateCustomPDF = (title: string, columns: string[], data: any[][]) => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text(title, 105, 20, { align: "center" });
  
  // Sous-titre et date
  doc.setFontSize(12);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Généré le ${dateStr}`, 105, 30, { align: "center" });
  
  // Générer le tableau
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
  });
  
  // Pagination
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${totalPages}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    });
  }
  
  // Sauvegarde
  doc.save(`rapport-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

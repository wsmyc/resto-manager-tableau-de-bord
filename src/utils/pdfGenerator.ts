// src/utils/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Ingredient, Plat } from "@/services/types";
import { monthlyRevenueData } from "@/data/reportsData";

// Étendre le type de jsPDF pour éviter les problèmes TypeScript
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
    addPage: () => jsPDF;
    setFont: (fontName: string, fontStyle: string) => jsPDF;
    setLineWidth: (width: number) => jsPDF;
    line: (x1: number, y1: number, x2: number, y2: number) => jsPDF;
    splitTextToSize: (text: string, maxLineWidth: number) => string[];
  }
}

/**
 * Génère un rapport PDF pour les revenus
 */
export const generateRevenuePDF = () => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(22);
  doc.setTextColor(35, 85, 54); // Restaurant green
  doc.text("Rapport de Revenus", 105, 20, { align: "center" });
  
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
  const tableColumn = ["Mois", "Revenus (DZD)"];
  const tableRows = monthlyRevenueData.map(item => {
    return [item.name, item.revenue.toLocaleString("fr-FR") + " DZD"];
  });
  
  // Générer le tableau
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [35, 85, 54] },
    foot: [["Total", monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString("fr-FR") + " DZD"]],
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
  });
  
  // Sauvegarde
  doc.save("rapport-revenus.pdf");
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";

export interface ExportColumn {
  header: string;
  key: string;   // supports dot-notation: "account.name"
  width?: number;
}

interface ExportButtonProps {
  label?: string;
  filename?: string;
  month?: string;
  title?: string;
  columns: ExportColumn[];
  data: Record<string, any>[];
  summaryRows?: Record<string, any>[];
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

/** Resolve dot-notation key: "account.name" → row.account?.name */
function get(row: Record<string, any>, key: string): any {
  return key.split(".").reduce((obj, k) => obj?.[k], row) ?? "";
}

async function exportExcel(
  filename: string,
  title: string,
  month: string,
  columns: ExportColumn[],
  data: Record<string, any>[],
  summaryRows?: Record<string, any>[]
) {
  const XLSX = await import("xlsx");

  const sheetData: any[][] = [
    [title],
    [`Month: ${month}`],
    [],
    columns.map((c) => c.header),
    ...data.map((row) => columns.map((col) => get(row, col.key))),
    ...(summaryRows?.length
      ? [[], ...summaryRows.map((row) => columns.map((col) => get(row, col.key)))]
      : []),
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!cols"] = columns.map((col) => ({ wch: col.width ?? 18 }));
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

async function exportPDF(
  filename: string,
  title: string,
  month: string,
  columns: ExportColumn[],
  data: Record<string, any>[],
  summaryRows?: Record<string, any>[]
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Month: ${month}`, 14, 23);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 29);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 34,
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((col) => get(row, col.key))),
    foot: summaryRows?.length
      ? summaryRows.map((row) => columns.map((col) => get(row, col.key)))
      : undefined,
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9 },
    footStyles: {
      fillColor: [245, 245, 245],
      textColor: [30, 30, 30],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    styles: { cellPadding: 3 },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}

export function ExportButton({
  label = "Export",
  filename = "export",
  month = "",
  title = "Export",
  columns,
  data,
  summaryRows,
  variant = "outline",
  size = "default",
}: ExportButtonProps) {
  const [loading, setLoading] = useState<"excel" | "pdf" | null>(null);

  const handle = async (type: "excel" | "pdf") => {
    if (loading) return;
    setLoading(type);
    try {
      if (type === "excel") {
        await exportExcel(filename, title, month, columns, data, summaryRows);
      } else {
        await exportPDF(filename, title, month, columns, data, summaryRows);
      }
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={!!loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handle("excel")}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          Download Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle("pdf")}>
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
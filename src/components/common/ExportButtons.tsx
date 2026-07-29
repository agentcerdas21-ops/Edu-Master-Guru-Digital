import React from 'react';
import { FileText, FileSpreadsheet, FileCode } from 'lucide-react';

interface ExportButtonsProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onExportWord?: () => void;
  label?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportPDF,
  onExportExcel,
  onExportWord,
  label = 'Ekspor'
}) => {
  return (
    <div className="flex items-center gap-1.5">
      {onExportPDF && (
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-medium transition-colors"
          title="Ekspor ke PDF"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF</span>
        </button>
      )}

      {onExportExcel && (
        <button
          onClick={onExportExcel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-medium transition-colors"
          title="Ekspor ke Excel"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Excel</span>
        </button>
      )}

      {onExportWord && (
        <button
          onClick={onExportWord}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-medium transition-colors"
          title="Ekspor ke Word"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Word</span>
        </button>
      )}
    </div>
  );
};

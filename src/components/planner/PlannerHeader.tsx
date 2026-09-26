import React from 'react';
import { Download, Sparkles, RotateCcw, Calendar, Building2, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlannerHeaderProps {
  companyName: string;
  responsibleName: string;
  planningPeriod: string;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onReset: () => void;
  percentAchieved: number;
}

export const PlannerHeader: React.FC<PlannerHeaderProps> = ({
  companyName,
  responsibleName,
  planningPeriod,
  onExportPdf,
  isExportingPdf,
  onReset,
  percentAchieved,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#0ea5e9', '#38bdf8', '#10b981', '#f59e0b'],
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Context */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500 text-white font-bold text-sm shadow-xs">
                PR
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Planner de Metas</span>
                  <span className="text-slate-300 font-normal">|</span>
                  <span className="text-sky-600 font-semibold text-lg">{companyName}</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Responsável: <strong className="text-slate-700">{responsibleName}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ciclo: <strong className="text-slate-700">{planningPeriod}</strong></span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={triggerConfetti}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
              title="Celebrar conquista de metas com confetes"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Bater Meta! 🎉</span>
            </button>

            <button
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? 'Gerando PDF...' : 'Exportar Plano em PDF'}</span>
            </button>

            <button
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Restaurar valores padrão"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

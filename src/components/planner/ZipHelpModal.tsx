import React, { useState } from 'react';
import { FileArchive, CheckCircle2, FileCode, ArrowRight, HelpCircle, X, Info } from 'lucide-react';

interface ZipHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipHelpModal: React.FC<ZipHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
            <FileArchive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Projeto Recuperado da sua Pasta ZIP!
            </h3>
            <p className="text-xs text-slate-500">
              Planner de Metas - Planejamento Estratégico Comercial • Gestão PR Negócios
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p>
            Os arquivos que você colou mostraram a estrutura de um projeto <strong>React + Vite</strong> exportado do AI Studio (com <code>package.json</code>, <code>canvas-confetti</code>, <code>jspdf</code>, <code>html2canvas</code>, etc).
          </p>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-start gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>O aplicativo foi reconstruído e já está rodando 100% interativo aqui!</span>
            </div>
            <div className="flex items-start gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Todas as dependências foram instaladas e configuradas.</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 text-xs text-sky-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Dica de ouro:</strong> Se dentro da pasta <code>src/</code> do seu ZIP você tiver um <code>App.tsx</code> ou componente específico já customizado, basta colar aqui na conversa que aplicamos imediatamente!
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-xs"
          >
            Entendido, usar o Planner!
          </button>
        </div>
      </div>
    </div>
  );
};

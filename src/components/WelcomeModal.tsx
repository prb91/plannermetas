import React, { useState, useEffect } from 'react';
import { User, Sparkles, ArrowRight, Check } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [nameInput, setNameInput] = useState<string>(currentName);

  useEffect(() => {
    setNameInput(currentName ? currentName.toUpperCase() : '');
  }, [currentName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim().toUpperCase();
    if (clean) {
      onSaveName(clean);
    }
    onClose();
  };

  const handleSkip = () => {
    if (!currentName) {
      onSaveName('CONSULTOR');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200/90 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-100 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5e36] to-[#e04520] text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff5e36] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Planejamento B91</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentName ? 'Editar Seu Nome' : 'Bem-vindo ao Planner'}
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {currentName
              ? 'Atualize seu nome para que suas metas, saudações e relatórios oficiais saiam personalizados.'
              : 'Como podemos te chamar? Seu nome será usado para personalizar o painel de metas e seus relatórios executivos.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="consultor-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Seu Nome ou Apelido Profissional
              </label>
              <div className="relative">
                <input
                  id="consultor-name"
                  type="text"
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                  placeholder="EX.: PAULO RICARDO"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-base uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5e36] focus:border-transparent transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:normal-case"
                />
                {nameInput.trim() && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                className="flex-1 py-3.5 px-5 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{currentName ? 'Salvar Alteração' : 'Acessar o Planner'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!currentName && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-colors text-sm cursor-pointer"
                >
                  Pular por enquanto
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

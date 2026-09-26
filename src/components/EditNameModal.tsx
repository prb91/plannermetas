import React, { useState, useEffect } from 'react';
import { User, X, Check } from 'lucide-react';

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const EditNameModal: React.FC<EditNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName ? currentName.toUpperCase() : '');
  }, [currentName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim().toUpperCase();
    if (clean) {
      onSaveName(clean);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200/90 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-100 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff5e36]/10 text-[#ff5e36] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Nome do Consultor</h3>
                <p className="text-xs text-slate-500">Personalize seu painel e relatórios</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Seu Nome ou Apelido Profissional
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="Ex: PAULO RICARDO"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all uppercase"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Nome</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

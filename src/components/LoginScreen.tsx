import React, { useState } from 'react';
import {
  BarChart3,
  ShieldCheck,
  Sparkles,
  User,
  ArrowRight,
  TrendingUp,
  Trophy,
  Palmtree,
  LayoutGrid,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
  savedName?: string;
  onClearData?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  savedName = '',
  onClearData,
}) => {
  const [name, setName] = useState(savedName.toUpperCase());
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim().toUpperCase();
    if (!clean) {
      setError('Por favor, informe seu nome ou apelido profissional.');
      return;
    }
    setError('');
    onLogin(clean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071320] via-[#0b1c2d] to-[#0e2439] text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#071320]/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5e36] to-[#e04520] text-white flex items-center justify-center shadow-lg shadow-orange-500/20 font-black">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Planner de Metas</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-orange-500/20 text-[#ff5e36] border border-orange-500/30 px-2 py-0.5 rounded-full">
                  Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">Planejamento Estratégico Comercial</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Gestão PR Negócios</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full my-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-orange-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5e36]" />
            <span>Sistema Exclusivo para Consultores B91</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Projete seu crescimento e alcance seus objetivos com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5e36] to-[#ffa387]">
              inteligência
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Planejamento inteligente de TPV, simulação de receita com TAC e Recorrência, e cronogramas para atingir todas as grandes premiações corporativas.
          </p>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-xl mx-auto text-xs sm:text-sm text-slate-300 italic shadow-lg">
            &ldquo;Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?&rdquo;
            <div className="not-italic font-semibold text-[#ff5e36] mt-1 text-xs">
              — Lucas 14:28
            </div>
          </div>
        </div>

        {/* Card de Entrada */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200 text-slate-900 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-100 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ff5e36]/10 text-[#ff5e36] flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Identificação do Consultor
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Acesse seu painel personalizado
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Digite seu nome ou apelido para personalizar seus relatórios oficiais e cronogramas de comissão.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seu Nome ou Apelido Profissional
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Ex: PAULO RICARDO"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all uppercase"
                  />
                  {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-lg shadow-orange-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Acessar Planner de Metas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#ff5e36] flex items-center justify-center font-bold text-lg">
              🏖️
            </div>
            <strong className="text-sm font-bold text-white block">Convenção RJ</strong>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cálculo exato de meses até Julho e regra de validação de 3 meses.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              🏆
            </div>
            <strong className="text-sm font-bold text-white block">Todas as Premiações</strong>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cronograma mês a mês dos 6 prêmios e remuneração TAC de R$ 49,90.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
              📈
            </div>
            <strong className="text-sm font-bold text-white block">Remuneração & TAC</strong>
            <p className="text-xs text-slate-400 leading-relaxed">
              Projeção patrimonial da comissão mensal da carteira ativa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
              📊
            </div>
            <strong className="text-sm font-bold text-white block">Quadro Comparativo</strong>
            <p className="text-xs text-slate-400 leading-relaxed">
              As 6 campanhas simultaneamente lado a lado em um só painel.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-400">
              Planner de Metas • Gestão PR Negócios
            </span>
          </div>
          <div>© 2026 PR Negócios Gestão Comercial • Todos os direitos reservados</div>
        </div>
      </footer>
    </div>
  );
};

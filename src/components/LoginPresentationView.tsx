import React, { useState } from 'react';
import { 
  BarChart3, 
  User, 
  ArrowRight, 
  Sparkles, 
  Palmtree, 
  Trophy, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface LoginPresentationViewProps {
  onLogin: (name: string) => void;
  savedName?: string;
  onClearData?: () => void;
}

export const LoginPresentationView: React.FC<LoginPresentationViewProps> = ({
  onLogin,
  savedName = '',
  onClearData,
}) => {
  const [nameInput, setNameInput] = useState<string>(savedName.toUpperCase());
  const [error, setError] = useState<string>('');

  const handleClear = () => {
    setNameInput('');
    setError('');
    if (onClearData) {
      onClearData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim().toUpperCase();
    if (!clean) {
      setError('Por favor, informe seu nome ou apelido profissional.');
      return;
    }
    setError('');
    onLogin(clean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071320] via-[#0b1c2d] to-[#0e2439] text-white flex flex-col justify-between">
      {/* Top Brand Header */}
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

      {/* Main Presentation & Login Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full my-auto space-y-12">
        {/* Hero Section */}
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
            Planejamento inteligente de TPV, simulação de receita com TAC e Recorrência, 
            e cronogramas para atingir todas as grandes premiações corporativas.
          </p>

          {/* Biblical Quote Card */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-xl mx-auto text-xs sm:text-sm text-slate-300 italic shadow-lg">
            &ldquo;Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?&rdquo;
            <div className="not-italic font-semibold text-[#ff5e36] mt-1 text-xs">— Lucas 14:28</div>
          </div>
        </div>

        {/* Consultant Access Card */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200 text-slate-900 relative overflow-hidden">
            {/* Subtle glow */}
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
                Digite seu nome ou apelido profissional para ingressar. Ele será usado para personalizar 
                todas as metas, saudações e seus <strong>relatórios oficiais em PDF</strong>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="input-login-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seu Nome ou Apelido
                  </label>
                  <div className="relative">
                    <input
                      id="input-login-name"
                      type="text"
                      autoFocus
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value.toUpperCase());
                        if (error) setError('');
                      }}
                      placeholder="EX.: PAULO RICARDO"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-base uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5e36] focus:border-transparent transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:normal-case"
                    />
                    {nameInput.trim() && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-xs text-rose-600 font-semibold mt-1.5">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Entrar no Planner de Metas</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="pt-2 flex flex-col items-center gap-1.5 text-[11px] text-slate-400">
                <span>Os dados e cálculos desta sessão são utilizados apenas para personalizar sua simulação e seus relatórios.</span>
                {(savedName || nameInput) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-slate-500 hover:text-amber-600 transition-colors underline underline-offset-2 cursor-pointer text-[11px]"
                  >
                    Limpar preenchimento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Features Presentation */}
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              O que você encontra dentro do Planner B91
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2.5 hover:border-slate-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-[#ff5e36] flex items-center justify-center">
                <Palmtree className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Convenção Rio de Janeiro</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cronograma exclusivo até a convenção com cálculo de viabilidade e ritmo mensal de credenciamento.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2.5 hover:border-slate-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Todas as Premiações</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Projeção completa das 6 campanhas oficiais: iPhones, Cruzeiro, Montblanc, Viagem Internacional e Carros.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2.5 hover:border-slate-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Remuneração & Crescimento</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evolução patrimonial da carteira com receita imediata (TAC) e comissão recorrente mês a mês.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2.5 hover:border-slate-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Quadro Comparador</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comparativo simultâneo de ritmo comercial e prazos de conquista entre todas as metas da B91.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 bg-[#071320]/60">
        <p>Planejamento e Estratégia • Gestão PR Negócios</p>
      </footer>
    </div>
  );
};

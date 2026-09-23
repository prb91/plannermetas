import React from 'react';
import { BookOpen, CheckCircle2, Lightbulb, RotateCcw, ArrowLeft, Calculator, FileText, Target, Trophy, TrendingUp, GitCompare } from 'lucide-react';

interface ComoUsarViewProps {
  activeSection: string;
  onBack: () => void;
}

const tutorials: Record<string, { title: string; subtitle: string; icon: React.ElementType; steps: { icon: React.ElementType; title: string; text: string }[]; tip: string }> = {
  home: {
    title: 'Como usar o sistema',
    subtitle: 'Visão geral para começar suas projeções.',
    icon: BookOpen,
    steps: [
      { icon: Target, title: 'Escolha a ferramenta', text: 'Na página inicial, selecione a projeção que deseja realizar: Convenção RJ, Todas as Premiações, Remuneração e Crescimento ou Quadro Comparativo.' },
      { icon: Calculator, title: 'Preencha os dados', text: 'Informe os valores solicitados. Os campos são editáveis e você pode alterar as premissas sempre que quiser.' },
      { icon: TrendingUp, title: 'Simule cenários', text: 'Teste diferentes valores para entender como mudanças nas premissas alteram suas projeções.' },
      { icon: FileText, title: 'Analise e gere seu relatório', text: 'Confira os resultados calculados e, quando disponível, utilize a opção de relatório para registrar sua simulação.' },
    ],
    tip: 'Use o sistema como uma ferramenta de simulação: altere as premissas e compare diferentes possibilidades antes de definir seu planejamento.'
  },
  convencaoRJ: {
    title: 'Como usar • Convenção RJ',
    subtitle: 'Entenda como projetar sua evolução para a Convenção RJ.',
    icon: Trophy,
    steps: [
      { icon: Calculator, title: 'Informe suas premissas', text: 'Preencha os campos de TPV e demais indicadores solicitados pela ferramenta.' },
      { icon: TrendingUp, title: 'Observe a projeção', text: 'O sistema calcula a evolução estimada e apresenta o caminho projetado até as metas da campanha.' },
      { icon: RotateCcw, title: 'Teste outros cenários', text: 'Altere os valores livremente para verificar como uma projeção diferente modifica o resultado.' },
      { icon: FileText, title: 'Gere o relatório', text: 'Use a opção de relatório quando quiser visualizar ou imprimir um resumo da projeção.' },
    ],
    tip: 'A projeção é uma simulação. Os valores podem ser ajustados a qualquer momento para testar novas estratégias.'
  },
  premiacoes: {
    title: 'Como usar • Todas as Premiações',
    subtitle: 'Compare suas projeções com as faixas de premiação disponíveis.',
    icon: Trophy,
    steps: [
      { icon: Calculator, title: 'Informe os dados da projeção', text: 'Preencha ou ajuste os indicadores utilizados para calcular sua evolução.' },
      { icon: Trophy, title: 'Consulte as premiações', text: 'Veja as diferentes faixas e acompanhe a projeção correspondente aos valores informados.' },
      { icon: TrendingUp, title: 'Faça ajustes', text: 'Mude TPV, recorrência ou outras premissas para testar diferentes caminhos de crescimento.' },
      { icon: FileText, title: 'Exporte o resultado', text: 'Quando disponível, utilize o relatório para registrar ou apresentar sua simulação.' },
    ],
    tip: 'Altere uma premissa por vez quando quiser entender com mais clareza o impacto de cada variável na projeção.'
  },
  crescimento: {
    title: 'Como usar • Remuneração e Crescimento',
    subtitle: 'Simule crescimento e visualize o impacto na remuneração projetada.',
    icon: TrendingUp,
    steps: [
      { icon: Calculator, title: 'Preencha os indicadores', text: 'Informe os valores solicitados pela ferramenta para estabelecer o cenário inicial.' },
      { icon: TrendingUp, title: 'Ajuste o crescimento', text: 'Modifique as premissas para testar diferentes ritmos de evolução e observar os resultados.' },
      { icon: Lightbulb, title: 'Interprete os números', text: 'Use os resultados como referência para entender a relação entre crescimento, TPV e remuneração projetada.' },
      { icon: FileText, title: 'Gere um resumo', text: 'Quando disponível, utilize o relatório para registrar a projeção calculada.' },
    ],
    tip: 'Faça mais de uma simulação. Comparar cenários ajuda a visualizar o impacto das premissas utilizadas.'
  },
  comparador: {
    title: 'Como usar • Quadro Comparativo',
    subtitle: 'Compare cenários de metas de forma rápida e visual.',
    icon: GitCompare,
    steps: [
      { icon: Calculator, title: 'Escolha a campanha', text: 'Selecione a campanha ou referência que deseja utilizar na comparação.' },
      { icon: GitCompare, title: 'Compare os cenários', text: 'Preencha os valores e observe lado a lado como cada cenário se comporta.' },
      { icon: TrendingUp, title: 'Ajuste as premissas', text: 'Altere os números para testar outras combinações e entender seus impactos.' },
      { icon: FileText, title: 'Registre o resultado', text: 'Quando disponível, utilize o relatório para apresentar ou guardar o resumo da comparação.' },
    ],
    tip: 'Use o comparador para testar alternativas antes de definir qual cenário será utilizado no seu planejamento.'
  },
};

export const ComoUsarView: React.FC<ComoUsarViewProps> = ({ activeSection, onBack }) => {
  const content = tutorials[activeSection] || tutorials.home;
  const Icon = content.icon;

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#0b1c2d] px-5 sm:px-8 py-7 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ff5e36] flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">{content.title}</h2>
              <p className="text-slate-300 text-sm sm:text-base mt-1">{content.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.steps.map(({ icon: StepIcon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff5e36] flex items-center justify-center shrink-0">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1.5">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-slate-900">💡 Dica para esta aba</h3>
                <p className="text-sm text-slate-700 leading-relaxed mt-1">{content.tip}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff5e36] hover:bg-[#e84f29] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Voltar para esta aba
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

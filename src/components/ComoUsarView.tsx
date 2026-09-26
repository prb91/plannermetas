import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Palmtree,
  Trophy,
  TrendingUp,
  LayoutGrid,
  Lightbulb,
  ArrowLeft,
  Sliders,
  FileText,
  BarChart3,
  Calendar,
  DollarSign,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface ComoUsarViewProps {
  activeSection: string;
  onBack: () => void;
}

interface StepItem {
  icon: any;
  title: string;
  text: string;
}

interface SectionHelp {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  icon: any;
  steps: StepItem[];
  tip: string;
  diferenciais?: string[];
}

const SECTIONS_CONFIG: SectionHelp[] = [
  {
    id: 'convencaoRJ',
    tabLabel: '🏖️ Convenção RJ',
    title: 'Como usar • Planner Convenção RJ',
    subtitle: 'Planeje sua aceleração de TPV com foco na qualificação oficial para a Convenção Regional B91.',
    icon: Palmtree,
    steps: [
      {
        icon: Sliders,
        title: '1. Informe seu TPV Atual e Recorrência',
        text: 'Insira o volume transacionado atual da sua carteira (R$) e a taxa de recorrência (padrão institucional B91 de 0,32%). Se você já atingiu a meta, o sistema reconhece sua elegibilidade imediata.',
      },
      {
        icon: Award,
        title: '2. Selecione a Premiação Alvo',
        text: 'Escolha qual das metas oficiais da Convenção deseja alcançar (ex: B91 RJ Meta R$ 1,5M, Copacabana R$ 3,0M, etc.). O sistema carrega as regras e metas específicas da premiação.',
      },
      {
        icon: Calendar,
        title: '3. Aceleração Calculada para Abril',
        text: 'O crescimento mensal necessário é calibrado estrategicamente para que a carteira atinja a meta em Abril do próximo ano com o status oficial de "Elegível".',
      },
      {
        icon: ShieldCheck,
        title: '4. Validação de 3 Meses Consecutivos até Julho',
        text: 'Acompanhe a manutenção e expansão contínua em Maio, Junho e no fechamento oficial de Julho ("Elegível Final"), garantindo o cumprimento integral do regulamento B91.',
      },
      {
        icon: DollarSign,
        title: '5. Remuneração e Comissões Mensais',
        text: 'A cada mês do cronograma, o TPV acumulado gera a remuneração proporcional na taxa cadastrada, exibindo exatamente quanto você receberá em comissões recorrentes.',
      },
      {
        icon: FileText,
        title: '6. Emissão do Relatório em PDF / Impressão',
        text: 'Clique no botão "Impressão" para visualizar o documento estratégico completo e baixá-lo em PDF com suas metas, prazos e comissões validadas.',
      },
    ],
    tip: 'Para garantir a premiação na Convenção RJ, mantenha o TPV no teto ou acima da meta durante todo o período de validação (Abril, Maio, Junho e Julho).',
    diferenciais: [
      'Meta atingida em Abril com status Elegível',
      'Manutenção contínua de 3 meses até Julho',
      'Cálculo dinâmico de comissão mensal recorrente',
    ],
  },
  {
    id: 'premiacoes',
    tabLabel: '🏆 Todas as Premiações',
    title: 'Como usar • Todas as Premiações',
    subtitle: 'Calcule o tempo estimado de conquista para cada uma das 6 faixas de premiações corporativas.',
    icon: Trophy,
    steps: [
      {
        icon: Sliders,
        title: '1. Defina o Ritmo de Credenciamento',
        text: 'Informe a quantidade de novos clientes credenciados por mês e o TPV médio estimado por cliente. Esses números determinam a velocidade de crescimento mensal da carteira.',
      },
      {
        icon: LayoutGrid,
        title: '2. Considere sua Carteira Atual',
        text: 'Marque a opção "Usar TPV Atual da Carteira" caso já possua clientes ativos transacionando. O sistema somará sua base existente para encurtar o tempo de conquista.',
      },
      {
        icon: Award,
        title: '3. Escolha a Campanha Desejada',
        text: 'Navegue entre as 6 campanhas oficiais: Programa Legendários, Macbook Pro, Convenção RJ, Moto Elétrica, Viagem a Jerusalém ou Novo Honda HR-V.',
      },
      {
        icon: DollarSign,
        title: '4. Ganho Duplo: Comissão + TAC',
        text: 'O cronograma projeta simultaneamente a comissão recorrente da carteira e a remuneração de ativação comercial (TAC de R$ 49,90 por cliente credenciado).',
      },
      {
        icon: BarChart3,
        title: '5. Índice de Viabilidade Estratégica',
        text: 'Consulte a análise de viabilidade (Alcançável, Desafiador ou Agressivo) para saber se a cadência mensal planejada é sustentável e competitiva.',
      },
      {
        icon: FileText,
        title: '6. Exportação em PDF',
        text: 'Gere a projeção detalhada pronta para impressão ou envio via WhatsApp para acompanhamento do seu plano de carreira comercial.',
      },
    ],
    tip: 'Caso sua taxa de recorrência seja inferior a 0,32%, o sistema aplica o fator de compensação proporcional no volume de TPV exigido.',
    diferenciais: [
      'Projeção contínua de 12 meses mesmo se já elegível',
      'Remuneração TAC de R$ 49,90 calculada mês a mês',
      'Índice de viabilidade baseado na cadência comercial',
    ],
  },
  {
    id: 'crescimento',
    tabLabel: '📈 Remuneração e Crescimento',
    title: 'Como usar • Remuneração e Crescimento',
    subtitle: 'Projete sua evolução financeira a partir da renda mensal desejada e ritmo de credenciamento.',
    icon: TrendingUp,
    steps: [
      {
        icon: DollarSign,
        title: '1. Estabeleça sua Renda Alvo Mensal',
        text: 'Digite quanto deseja receber por mês em comissão recorrente (ex: R$ 5.000, R$ 10.000, R$ 20.000) e informe sua taxa de recorrência média.',
      },
      {
        icon: Sliders,
        title: '2. Informe suas Premissas Operacionais',
        text: 'Preencha o TPV médio por cliente e o número de novos credenciamentos mensais para calcular o TPV total necessário em carteira.',
      },
      {
        icon: Calendar,
        title: '3. Simulação com Prazo Fixo ou Livre',
        text: 'Escolha se deseja atingir sua meta em um prazo específico (ex: 6, 12, 18 ou 24 meses) ou se prefere uma projeção contínua no ritmo natural.',
      },
      {
        icon: BarChart3,
        title: '4. Acompanhe a Tabela de Evolução',
        text: 'Visualize mês a mês o TPV acumulado, a comissão recorrente, o TAC mensal e a renda total gerada até e além do mês de superação da meta.',
      },
      {
        icon: ShieldCheck,
        title: '5. Validação da Viabilidade',
        text: 'O índice indica se o ritmo mensal de TPV é suficiente para bater o objetivo no prazo pretendido ou se é necessária aceleração comercial.',
      },
      {
        icon: FileText,
        title: '6. Emissão da Projeção em PDF',
        text: 'Utilize o botão de Impressão para gerar o documento oficial com a tabela completa de crescimento e métricas validadas.',
      },
    ],
    tip: 'A combinação de comissão recorrente com a remuneração TAC (R$ 49,90) acelera fortemente seus ganhos no primeiro ano de credenciamento.',
    diferenciais: [
      'Cálculo reverso de TPV total a partir da renda pretendida',
      'Tabela mês a mês com destaque visual no mês de conquista',
      'Relatório completo com gráfico evolutivo em PDF',
    ],
  },
  {
    id: 'comparador',
    tabLabel: '📊 Quadro Comparativo',
    title: 'Como usar • Quadro Executivo de Metas',
    subtitle: 'Compare simultaneamente prazos, progresso e receitas das 6 grandes campanhas B91.',
    icon: LayoutGrid,
    steps: [
      {
        icon: Sliders,
        title: '1. Centralize suas Premissas no Painel',
        text: 'Insira seu TPV atual, o TPV médio habitual por cliente, a quantidade de clientes novos por mês e a taxa de recorrência contratada.',
      },
      {
        icon: LayoutGrid,
        title: '2. Compare os 6 Cartões de Campanhas',
        text: 'O sistema analisa simultaneamente Legendários, Macbook, Convenção RJ, Moto Elétrica, Jerusalém e HR-V, indicando status e prazo individual.',
      },
      {
        icon: TrendingUp,
        title: '3. Progresso e Faltante em Tempo Real',
        text: 'Veja a barra de progresso percentual, o valor que ainda falta transacionar e a comissão recorrente correspondente a cada premiação.',
      },
      {
        icon: Award,
        title: '4. Identifique Premiações Já Elegíveis',
        text: 'Campanhas com metas já atingidas pelo seu TPV atual são destacadas automaticamente em verde com o selo "Já Elegível!".',
      },
      {
        icon: FileText,
        title: '5. Emissão do Relatório Comparativo',
        text: 'Gere o relatório oficial consolidado contendo a tabela comparativa com todas as metas, prazos, comissões e rendas em uma única folha A4.',
      },
    ],
    tip: 'Use o Quadro Comparativo em reuniões de acompanhamento comercial para definir qual a próxima meta executiva da sua carreira.',
    diferenciais: [
      'Visão simultânea das 6 campanhas em um único painel',
      'Coluna dedicada de comissão recorrente no relatório oficial',
      'Acesso com um clique para projeção individual detalhada',
    ],
  },
  {
    id: 'home',
    tabLabel: '🏠 Início (Visão Geral)',
    title: 'Como usar • Visão Geral do Sistema',
    subtitle: 'Navegação, personalização do consultor e boas práticas de planejamento.',
    icon: HelpCircle,
    steps: [
      {
        icon: LayoutGrid,
        title: '1. Escolha o Módulo de Planejamento',
        text: 'Na tela inicial, selecione entre Convenção RJ, Todas as Premiações, Remuneração e Crescimento ou Quadro Comparativo Executivo.',
      },
      {
        icon: Sliders,
        title: '2. Personalize com seu Nome',
        text: 'Seu nome ou apelido inserido na tela de login aparece automaticamente nos cabeçalhos, relatórios oficiais, assinaturas e impressões em PDF.',
      },
      {
        icon: TrendingUp,
        title: '3. Simule Livremente',
        text: 'Todos os campos de valores monetários e percentuais são interativos e recalculados instantaneamente sem necessidade de recarregar a página.',
      },
      {
        icon: FileText,
        title: '4. Exporte e Compartilhe Resultados',
        text: 'Utilize o botão de Impressão para baixar PDFs corporativos formatados com layout A4 institucional e botão direto para compartilhar no WhatsApp.',
      },
    ],
    tip: 'Para recomeçar um atendimento do zero ou limpar dados antigos, utilize a opção "Limpar Dados (Reset)" no rodapé ou no cabeçalho.',
    diferenciais: [
      'Ambiente corporativo de alta performance',
      'Validação matemática precisa de regras comerciais B91',
      'Geração de PDF nativo com alta resolução',
    ],
  },
];

export const ComoUsarView: React.FC<ComoUsarViewProps> = ({ activeSection, onBack }) => {
  // Inicializa com a aba ativa de onde o usuário veio
  const [selectedId, setSelectedId] = useState<string>(() => {
    const valid = SECTIONS_CONFIG.find((s) => s.id === activeSection);
    return valid ? activeSection : 'home';
  });

  // Atualiza se a activeSection mudar externamente
  useEffect(() => {
    if (activeSection && SECTIONS_CONFIG.some((s) => s.id === activeSection)) {
      setSelectedId(activeSection);
    }
  }, [activeSection]);

  const currentHelp = SECTIONS_CONFIG.find((s) => s.id === selectedId) || SECTIONS_CONFIG[0];
  const HeaderIcon = currentHelp.icon;

  const getNomeAbaOrigem = (sec: string) => {
    switch (sec) {
      case 'convencaoRJ':
        return 'Convenção RJ';
      case 'premiacoes':
        return 'Todas as Premiações';
      case 'crescimento':
        return 'Remuneração e Crescimento';
      case 'comparador':
        return 'Quadro Comparativo';
      default:
        return 'Início';
    }
  };

  return (
    <div className="py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
      {/* Barra de Navegação entre as Abas de Ajuda */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden md:inline">
            Guias:
          </span>
          {SECTIONS_CONFIG.map((sec) => {
            const isSelected = sec.id === selectedId;
            const isOriginalSource = sec.id === activeSection && activeSection !== 'home';

            return (
              <button
                key={sec.id}
                onClick={() => setSelectedId(sec.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#ff5e36] text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span>{sec.tabLabel}</span>
                {isOriginalSource && !isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#ff5e36]" title="Página em que você estava" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onBack}
          title={`Voltar para ${getNomeAbaOrigem(activeSection)}`}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para {getNomeAbaOrigem(activeSection)}</span>
        </button>
      </div>

      {/* Cartão Principal do Manual */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Topo Escuro com Ícone e Título */}
        <div className="bg-gradient-to-r from-[#071524] via-[#0b1c2d] to-[#12283e] px-6 sm:px-8 py-7 sm:py-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff5e36] flex items-center justify-center shadow-lg shrink-0 text-white">
              <HeaderIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">{currentHelp.title}</h2>
                {activeSection === currentHelp.id && activeSection !== 'home' && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Sua aba atual
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {currentHelp.subtitle}
              </p>
            </div>
          </div>

          {currentHelp.diferenciais && currentHelp.diferenciais.length > 0 && (
            <div className="hidden lg:flex flex-col gap-1 text-[11px] text-slate-300 bg-white/5 border border-white/10 p-3 rounded-xl max-w-xs">
              <strong className="text-white font-bold text-xs mb-0.5">Destaques desta ferramenta:</strong>
              {currentHelp.diferenciais.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo com os Passos */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {currentHelp.steps.map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-orange-200 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ff5e36]/10 text-[#ff5e36] flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {st.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
                      {st.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dica de Especialista */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs sm:text-sm font-bold block mb-1">
                Orientação Estratégica B91:
              </strong>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {currentHelp.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

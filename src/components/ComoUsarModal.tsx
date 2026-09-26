import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Palmtree,
  Trophy,
  TrendingUp,
  LayoutGrid,
  HelpCircle,
  Sliders,
  Award,
  Calendar,
  ShieldCheck,
  DollarSign,
  FileText,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ComoUsarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

interface StepItem {
  icon: any;
  title: string;
  text: string;
}

interface SectionHelp {
  id: string;
  tabLabel: string;
  shortName: string;
  title: string;
  subtitle: string;
  icon: any;
  steps: StepItem[];
  tableExplanation?: {
    col: string;
    desc: string;
  }[];
  tip: string;
  diferenciais: string[];
}

const SECTIONS_CONFIG: SectionHelp[] = [
  {
    id: 'convencaoRJ',
    tabLabel: '🏖️ Convenção RJ',
    shortName: 'Convenção RJ',
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
    tableExplanation: [
      { col: 'Mês', desc: 'Mês e ano da projeção cronológica (do mês atual até Julho do fechamento oficial).' },
      { col: 'Meta TPV', desc: 'Volume transacionado exigido pela campanha oficial selecionada.' },
      { col: 'Crescimento', desc: 'Aporte mensal de TPV necessário para atingir e expandir a meta. Continua sendo preenchido mês a mês.' },
      { col: 'TPV Atingido', desc: 'Volume total acumulado da carteira no respectivo mês (TPV anterior + Crescimento).' },
      { col: 'Remuneração', desc: 'Comissão mensal recorrente calculada aplicando a taxa sobre o TPV Atingido.' },
      { col: 'Status', desc: 'Evolução: "Construção", "Elegível" (Abril a Junho) e "Elegível (Final)" em Julho.' },
    ],
    tip: 'Para garantir a premiação na Convenção RJ, mantenha o TPV no teto ou acima da meta durante todo o período de validação (Abril, Maio, Junho e Julho).',
    diferenciais: [
      'Meta atingida em Abril com status Elegível',
      'Manutenção contínua de 3 meses até Julho',
      'Cálculo dinâmico de comissão mensal recorrente',
      'Tabela com projeção contínua mesmo se já elegível',
    ],
  },
  {
    id: 'premiacoes',
    tabLabel: '🏆 Todas as Premiações',
    shortName: 'Premiações',
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
    tableExplanation: [
      { col: 'Mês', desc: 'Mês projetado na sequência temporal.' },
      { col: 'TPV Novo / Mês', desc: 'Volume adicionado no mês (Clientes Novos × TPV Médio).' },
      { col: 'TPV Acumulado', desc: 'Volume acumulado total da sua carteira comercial.' },
      { col: 'Comissão Recorrência', desc: 'Ganhos mensais recorrentes (TPV Acumulado × Taxa de Recorrência).' },
      { col: 'Remuneração TAC', desc: 'Bônus de ativação de R$ 49,90 por novo cliente credenciado.' },
      { col: 'Total Mensal', desc: 'Comissão Recorrente + Remuneração TAC somadas no mês.' },
    ],
    tip: 'Caso sua taxa de recorrência seja inferior a 0,32%, o sistema aplica o fator de compensação proporcional no volume de TPV exigido.',
    diferenciais: [
      'Projeção contínua mesmo após atingir a meta',
      'Remuneração TAC de R$ 49,90 calculada mês a mês',
      'Índice de viabilidade baseado na cadência comercial',
    ],
  },
  {
    id: 'crescimento',
    tabLabel: '📈 Remuneração e Crescimento',
    shortName: 'Remuneração',
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
        text: 'Visualize mês a mês o crescimento contínuo do TPV acumulado, a comissão recorrente, o TAC mensal e a renda total gerada sem interrupções.',
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
    tableExplanation: [
      { col: 'Mês', desc: 'Mês correspondente na linha do tempo.' },
      { col: 'TPV Novo / Mês', desc: 'Volume incremental transacionado pelos novos credenciados.' },
      { col: 'TPV Acumulado', desc: 'Base total de TPV ativa sob sua gestão.' },
      { col: 'Comissão Recorrência', desc: 'Renda mensal proveniente da taxa de recorrência.' },
      { col: 'Remuneração TAC', desc: 'Bonificação de credenciamento (R$ 49,90 × clientes).' },
      { col: 'Total Mensal', desc: 'Renda líquida bruta combinada no período.' },
    ],
    tip: 'A combinação de comissão recorrente com a remuneração TAC (R$ 49,90) acelera fortemente seus ganhos no primeiro ano de credenciamento.',
    diferenciais: [
      'Cálculo reverso de TPV total a partir da renda pretendida',
      'Tabela mês a mês com projeção contínua de expansão',
      'Relatório completo com gráfico evolutivo em PDF',
    ],
  },
  {
    id: 'comparador',
    tabLabel: '📊 Quadro Comparativo',
    shortName: 'Comparador',
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
    tableExplanation: [
      { col: 'Campanha', desc: 'Nome oficial e benefício da premiação corporativa B91.' },
      { col: 'Meta TPV', desc: 'Volume mínimo necessário para conquista da premiação.' },
      { col: 'Progresso', desc: 'Percentual do objetivo já coberto pela sua carteira atual.' },
      { col: 'Prazo Estimado', desc: 'Meses necessários para atingir o volume na cadência atual.' },
      { col: 'Comissão Mensal', desc: 'Renda recorrente mensal garantida ao bater a meta.' },
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
    shortName: 'Início',
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

export const ComoUsarModal: React.FC<ComoUsarModalProps> = ({
  isOpen,
  onClose,
  activeSection,
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    const valid = SECTIONS_CONFIG.find((s) => s.id === activeSection);
    return valid ? activeSection : 'home';
  });

  useEffect(() => {
    if (activeSection && SECTIONS_CONFIG.some((s) => s.id === activeSection)) {
      setSelectedId(activeSection);
    }
  }, [activeSection, isOpen]);

  if (!isOpen) return null;

  const currentHelp =
    SECTIONS_CONFIG.find((s) => s.id === selectedId) || SECTIONS_CONFIG[0];
  const HeaderIcon = currentHelp.icon;
  const isCurrentActiveTab = activeSection === currentHelp.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-[#071524] via-[#0b1c2d] to-[#12283e] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            title="Fechar manual"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start sm:items-center gap-3.5 pr-10">
            <div className="w-11 h-11 rounded-2xl bg-[#ff5e36] text-white flex items-center justify-center shadow-lg shrink-0">
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#ff5e36]/20 text-[#ff8059] border border-[#ff5e36]/40 px-2 py-0.5 rounded-full">
                  Manual de Instruções
                </span>
                {isCurrentActiveTab && (
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Aba Selecionada Atual
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1 leading-tight">
                {currentHelp.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {currentHelp.subtitle}
              </p>
            </div>
          </div>

          {/* Abas no topo do modal para alternar entre as telas */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-700/60 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline shrink-0">
              Ver guia de:
            </span>
            {SECTIONS_CONFIG.map((sec) => {
              const isSelected = sec.id === selectedId;
              const isCurrent = sec.id === activeSection;

              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedId(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#ff5e36] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <span>{sec.tabLabel}</span>
                  {isCurrent && !isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      title="Sua aba ativa no sistema"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Passo a passo numerado */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5e36]" />
              Passo a Passo de Utilização
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentHelp.steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-orange-200 hover:shadow-xs transition-all space-y-1.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-[#ff5e36]/10 text-[#ff5e36] flex items-center justify-center font-black text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 leading-tight">
                          {step.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-9">
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explicação das Colunas da Tabela (se houver) */}
          {currentHelp.tableExplanation && currentHelp.tableExplanation.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                Significado das Colunas da Tabela
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentHelp.tableExplanation.map((colItem, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5"
                  >
                    <strong className="text-xs font-black text-slate-900 block">
                      {colItem.col}
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {colItem.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destaques / Diferenciais */}
          {currentHelp.diferenciais && currentHelp.diferenciais.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <strong className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
                ✓ Destaques e Funcionalidades Exclusivas:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentHelp.diferenciais.map((dif, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{dif}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dica Estratégica */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs font-bold block mb-1">
                Orientação Estratégica B91:
              </strong>
              <p className="text-xs text-amber-900 leading-relaxed">
                {currentHelp.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal com Ações */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Você está consultando o manual de <strong>{currentHelp.shortName}</strong>. Seus dados de simulação continuam preservados.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer ml-auto"
          >
            Entendi, Voltar à Simulação
          </button>
        </div>
      </div>
    </div>
  );
};

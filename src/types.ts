export interface Campanha {
  id: number;
  nome: string;
  premio: string;
  meta: number;
  descricao: string;
  imagemUrl: string;
  emoji: string;
}

export interface Viabilidade {
  label: string;
  tipo: 'alcancavel' | 'desafiador' | 'agressivo';
  cor: string;
}

export interface CronogramaRowRJ {
  mes: string;
  mesNumero: number;
  tpvMeta: number;
  crescimento: number;
  tpvAtingido: number;
  remuneracao: number;
  status: string;
  statusTipo: 'construcao' | 'pre_validacao' | 'validacao' | 'elegivel' | 'elegivel_final' | 'nao_elegivel';
  anoReferencia: number;
}

export interface ConvencaoRJData {
  tpvAtual: number;
  recorrencia: number;
  campanha: Campanha;
  mesesDisponiveis: number;
  anoConvencao: number;
  meta: number;
  faltam: number;
  crescimentoNecessario: number;
  percentualCrescimento: number;
  viabilidade: Viabilidade;
  cronograma: CronogramaRowRJ[];
  jaAtingida: boolean;
}

export interface ProjecaoPremiacaoRow {
  mesIndex: number;
  nomeMes: string;
  tpvPorMes: number;
  acumulado: number;
  comissao: number;
  remuneracaoTAC: number;
  comissaoMaisTAC: number;
  atingiuMeta: boolean;
}

export interface PremiacoesData {
  tpvAtual: number;
  tpvMedio: number;
  clientesMes: number;
  recorrencia: number;
  tpvPorMes: number;
  remuneracaoTAC: number;
  campanha: Campanha;
  meta: number;
  meses: number;
  atingiu: boolean;
  rows: ProjecaoPremiacaoRow[];
  usarTpvAtual: boolean;
}

export interface CrescimentoRow {
  mesIndex: number;
  nomeMes: string;
  tpvMensal: number;
  tpvAcumulado: number;
  comissao: number;
  remuneracaoTAC: number;
  comissaoMaisTAC: number;
  isMetaMonth: boolean;
}

export interface CrescimentoData {
  comissaoMeta: number;
  recorrencia: number;
  tpvMedio: number;
  clientesMes: number;
  tpvNecessario: number;
  tpvMensal: number;
  tpvAtualCrescimento: number;
  usarTpvAtual: boolean;
  usarTempoAtingimento: boolean;
  tempoAtingimentoMeses: number;
  tpvMensalNecessario: number | null;
  remuneracaoTAC: number;
  mesMetaAtingida: number | null;
  nomeMesAtingida: string | null;
  rows: CrescimentoRow[];
}

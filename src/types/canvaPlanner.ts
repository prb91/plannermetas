export interface Campanha {
  id: number;
  nome: string;
  meta: number;
  imagem: string;
  emoji: string;
}

export const CAMPANHAS_LISTA: Campanha[] = [
  { id: 0, nome: "1.5 MM - Ingresso Convenção RJ", meta: 1500000, imagem: "https://i.postimg.cc/V00b50JP/1-5.jpg", emoji: "🎪" },
  { id: 1, nome: "3 MM - Programa de Desenvolvimento Pessoal", meta: 3000000, imagem: "https://i.postimg.cc/8ffrsf7N/3.jpg", emoji: "📚" },
  { id: 2, nome: "5 MM - MacBook", meta: 5000000, imagem: "https://i.postimg.cc/9wwqzwD2/5.jpg", emoji: "💻" },
  { id: 3, nome: "7.5 MM - Moto Elétrica", meta: 7500000, imagem: "https://i.postimg.cc/N22rL2KY/7-5.jpg", emoji: "🏍️" },
  { id: 4, nome: "10 MM - Viagem Internacional", meta: 10000000, imagem: "https://i.postimg.cc/4HHHhnHYX/10.jpg", emoji: "✈️" },
  { id: 5, nome: "15 MM - Honda HR-V 0 KM", meta: 15000000, imagem: "https://i.postimg.cc/7b5zKdmC/15.jpg", emoji: "🚗" }
];

export interface ConvencaoRJRow {
  mes: string;
  meta: number;
  crescimento: number;
  tpvAtingido: number;
  remuneracao: number;
  status: string;
}

export interface ConvencaoRJResult {
  tpvAtual: number;
  recorrencia: number;
  campanha: Campanha;
  mesesDisponiveis: number;
  anoConvencao: number;
  viabilidade: string;
  viabilidadeCor: string;
  crescimentoNecessario: number;
  percentualCrescimento: number;
  jaAtingiu: boolean;
  rows: ConvencaoRJRow[];
}

export interface PremiacoesRow {
  mesNum: number;
  mesNome: string;
  acumulado: number;
  tpvPorMes: number;
  comissao: number;
}

export interface PremiacoesResult {
  tpvAtual: number;
  tpvMedio: number;
  clientesMes: number;
  recorrencia: number;
  remuneracaoTAC: number;
  campanha: Campanha;
  meses: number;
  tpvPorMes: number;
  atingiu: boolean;
  rows: PremiacoesRow[];
}

export interface CrescimentoRow {
  mes: string;
  tpvMensal: number;
  tpvAcumulado: number;
  comissao: number;
  remuneracaoTAC: number;
  comissaoMaisTAC: number;
}

export interface CrescimentoResult {
  comissaoProjetada: number;
  recorrencia: number;
  tpvMedio: number;
  clientesMes: number;
  remuneracaoTAC: number;
  tpvNecessario: number;
  tpvMensal: number;
  tpvAtual: number;
  usarTpvAtual: boolean;
  usarTempoAtingimento: boolean;
  tempoAtingimento: number;
  tpvMensalNecessario: number | null;
  metaAlcancavel: boolean;
  mesMetaAtingida: number | null;
  mesNomeAtingida: string | null;
  rows: CrescimentoRow[];
}

export interface CampanhaItem {
  id: number;
  nome: string;
  premio: string;
  meta: number;
  descricao: string;
  imagemUrl: string;
  emoji: string;
}

export const RECORRENCIA_MINIMA = 0.0032; // 0,32%
export const REMUNERACAO_TAC_UNITARIA = 49.90; // R$ 49,90 por cliente cadastrado

export const CAMPANHAS_OFICIAIS: CampanhaItem[] = [
  {
    id: 0,
    nome: "1.5 MM",
    premio: "Ingresso Convenção RJ",
    meta: 1500000,
    descricao: "Ingresso garantido para o evento mais esperado do ano no Rio de Janeiro!",
    imagemUrl: "/assets/convencao_rio_janeiro_1789845960631-ChzRc1qf.jpg",
    emoji: "🏖️",
  },
  {
    id: 1,
    nome: "3 MM",
    premio: "Programa de Desenvolvimento Pessoal",
    meta: 3000000,
    descricao: "Capacitação de alto impacto para impulsionar suas habilidades e carreira profissional.",
    imagemUrl: "/assets/programa_legendarios_1789845975377-B0qudCqg.jpg",
    emoji: "⛰️",
  },
  {
    id: 2,
    nome: "5 MM",
    premio: "MacBook",
    meta: 5000000,
    descricao: "Tecnologia de ponta Apple para máxima produtividade nas suas operações e negócios.",
    imagemUrl: "/assets/macbook_midnight_desk_1789846273810-kxPs6CLu.jpg",
    emoji: "💻",
  },
  {
    id: 3,
    nome: "7.5 MM",
    premio: "Moto Elétrica",
    meta: 7500000,
    descricao: "Mobilidade sustentável, tecnologia moderna e economia para o seu dia a dia.",
    imagemUrl: "/assets/moto_eletrica_urban_1789846357114-Dq0DMtlp.jpg",
    emoji: "🛵",
  },
  {
    id: 4,
    nome: "10 MM",
    premio: "Viagem Internacional",
    meta: 10000000,
    descricao: "Experiência global inesquecível e exclusiva para o consultor em um destino internacional memorável.",
    imagemUrl: "/assets/viagem_jerusalem_sunset_1789846006112-BlIr84tl.jpg",
    emoji: "✈️",
  },
  {
    id: 5,
    nome: "15 MM",
    premio: "Honda HR-V 0 KM",
    meta: 15000000,
    descricao: "O ápice do reconhecimento: um SUV novo na sua garagem premiando sua liderança!",
    imagemUrl: "/assets/honda_hrv_scenic_1789846372522-C0t6H-rZ.jpg",
    emoji: "🚗",
  },
];

export function formatCurrency(val: number): string {
  if (isNaN(val)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatPercent(val: number): string {
  return `${(val * 100).toFixed(2).replace(".", ",")}%`;
}

export function parseValue(val: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const clean = val.toString().replace(/[R$\s]/g, "").trim();
  if (!clean) return 0;

  if (clean.includes(",")) {
    const norm = clean.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(norm);
    return isNaN(num) ? 0 : num;
  }

  if (clean.includes(".")) {
    if ((clean.match(/\./g) || []).length > 1) {
      return parseFloat(clean.replace(/\./g, "")) || 0;
    }
    const parts = clean.split(".");
    if (parts[1].length === 3) {
      return parseFloat(parts.join("")) || 0;
    }
    return parseFloat(clean) || 0;
  }

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function parsePercentage(val: string | number): number {
  if (typeof val === "number") return val;
  if (!val && val !== "0" && val !== "0%") return 0.0032;
  const clean = val.toString().replace("%", "").replace(",", ".").trim();
  if (clean === "" || clean === ",") return 0.0032;
  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed < 0 ? 0.0032 : parsed / 100;
}

export function gerarMesesDinamicos(qtd: number): string[] {
  const lista: string[] = [];
  const hoje = new Date();
  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const y = String(d.getFullYear()).slice(-2);
    lista.push(`${m}/${y}`);
  }
  return lista;
}

export function exportCSV(filename: string, rows: (string | number)[][]) {
  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    rows
      .map((r) =>
        r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";")
      )
      .join("\r\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

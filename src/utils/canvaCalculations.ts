import { 
  CAMPANHAS_LISTA, 
  Campanha, 
  ConvencaoRJResult, 
  ConvencaoRJRow, 
  PremiacoesResult, 
  PremiacoesRow, 
  CrescimentoResult, 
  CrescimentoRow 
} from '../types/canvaPlanner';

export function formatMoneyNum(val: number): string {
  return (val || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseMoneyInput(val: string | number): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Remove R$, spaces, and convert 1.000,00 to 1000.00
  const clean = val.replace(/[R$\s.]/g, '').replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function parsePercentage(val: string | number): number {
  if (typeof val === 'number') return val > 1 ? val / 100 : val;
  if (!val) return 0.0032; // 0.32% default
  const clean = val.replace(/[%,\s]/g, (match) => (match === ',' ? '.' : ''));
  const parsed = parseFloat(clean);
  if (isNaN(parsed) || parsed <= 0) return 0.0032;
  return parsed > 1 ? parsed / 100 : parsed;
}

export function getMesesDisponiveisRJ(): { mesesDisponiveis: number; anoConvencao: number } {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1; // 1-12
  const anoAtual = hoje.getFullYear();

  let anoConvencao = mesAtual >= 7 ? anoAtual + 1 : anoAtual;
  const anoAlvoAbril = mesAtual >= 4 ? anoAtual + 1 : anoAtual;

  let meses = (anoAlvoAbril - anoAtual) * 12 + (4 - mesAtual);

  if (meses < 1) meses = 1;
  return { mesesDisponiveis: meses, anoConvencao };
}

export function gerarMesesDinamicos(qtdMeses: number): string[] {
  const meses: string[] = [];
  const hoje = new Date();

  for (let i = 0; i < qtdMeses; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    meses.push(`${mes}/${ano}`);
  }

  return meses;
}

export function calcularConvencaoRJData(
  tpvAtual: number,
  recorrencia: number,
  campanhaId: number
): ConvencaoRJResult {
  const campanha = CAMPANHAS_LISTA[campanhaId] || CAMPANHAS_LISTA[0];
  const { mesesDisponiveis, anoConvencao } = getMesesDisponiveisRJ();
  const meta = campanha.meta;
  const totalMeses = mesesDisponiveis + 3;
  const nomesMeses = gerarMesesDinamicos(totalMeses);

  if (tpvAtual >= meta) {
    const expansaoMensal = Math.max(50000, Math.round((tpvAtual * 0.05) / 10000) * 10000);
    const rowsJaAtingida: ConvencaoRJRow[] = [];
    let tpvCorrente = tpvAtual;
    for (let i = 0; i < totalMeses; i++) {
      tpvCorrente += expansaoMensal;
      const numMes = parseInt(nomesMeses[i].split('/')[0], 10);
      const isElegivel = numMes >= 4 && numMes <= 6;
      const isFinal = numMes === 7;
      rowsJaAtingida.push({
        mes: nomesMeses[i] || `Mês ${i + 1}`,
        meta: meta,
        crescimento: expansaoMensal,
        tpvAtingido: tpvCorrente,
        remuneracao: tpvCorrente * recorrencia,
        status: isFinal ? '🏆 Elegível (Final)' : isElegivel ? '🏆 Elegível' : '⚠️ Pré-validação',
      });
    }

    return {
      tpvAtual,
      recorrencia,
      campanha,
      mesesDisponiveis,
      anoConvencao,
      viabilidade: '🟢 Elegível (Meta Já Superada)',
      viabilidadeCor: 'text-green-700',
      crescimentoNecessario: expansaoMensal,
      percentualCrescimento: tpvAtual > 0 ? (expansaoMensal / tpvAtual) * 100 : 5,
      jaAtingiu: true,
      rows: rowsJaAtingida,
    };
  }

  const faltam = meta - tpvAtual;
  const crescimentoNecessario = faltam / mesesDisponiveis;
  const percentualCrescimento = tpvAtual > 0 ? (crescimentoNecessario / tpvAtual) * 100 : 100;

  let viabilidade = '🟢 Alcançável';
  let viabilidadeCor = 'text-green-700';

  if (percentualCrescimento > 30) {
    viabilidade = '🔴 Agressivo';
    viabilidadeCor = 'text-red-700';
  } else if (percentualCrescimento > 15) {
    viabilidade = '🟡 Desafiador';
    viabilidadeCor = 'text-yellow-700';
  }

  const rows: ConvencaoRJRow[] = [];
  let tpvCorrente = tpvAtual;

  // Fase 1: Crescimento até atingir a meta em Abril
  for (let i = 0; i < mesesDisponiveis; i++) {
    tpvCorrente += crescimentoNecessario;
    const numMes = parseInt(nomesMeses[i].split('/')[0], 10);
    const isElegivel = numMes >= 4 && numMes <= 6;
    rows.push({
      mes: nomesMeses[i] || `Mês ${i + 1}`,
      meta: meta,
      crescimento: crescimentoNecessario,
      tpvAtingido: tpvCorrente,
      remuneracao: tpvCorrente * recorrencia,
      status: isElegivel ? '🏆 Elegível' : 'Construção',
    });
  }

  // Fase 2: Manutenção e Expansão contínua exigida até o fechamento (Maio, Junho, Julho)
  for (let j = 0; j < 3; j++) {
    const idx = mesesDisponiveis + j;
    tpvCorrente += crescimentoNecessario;
    const numMes = parseInt((nomesMeses[idx] || '').split('/')[0], 10);
    const isFinal = numMes === 7 || j === 2;
    rows.push({
      mes: nomesMeses[idx] || `Manutenção ${j + 1}`,
      meta: meta,
      crescimento: crescimentoNecessario,
      tpvAtingido: tpvCorrente,
      remuneracao: tpvCorrente * recorrencia,
      status: isFinal ? '🏆 Elegível (Final)' : '🏆 Elegível',
    });
  }

  return {
    tpvAtual,
    recorrencia,
    campanha,
    mesesDisponiveis,
    anoConvencao,
    viabilidade,
    viabilidadeCor,
    crescimentoNecessario,
    percentualCrescimento,
    jaAtingiu: false,
    rows,
  };
}

export function calcularPremiacoesData(
  tpvAtualInput: number,
  tpvMedio: number,
  clientesMes: number,
  recorrencia: number,
  campanhaId: number,
  usarTpvAtual: boolean
): PremiacoesResult {
  const campanha = CAMPANHAS_LISTA[campanhaId] || CAMPANHAS_LISTA[0];
  const meta = campanha.meta;
  const tpvPorMes = tpvMedio * clientesMes;
  const tpvAtual = usarTpvAtual ? tpvAtualInput : 0;
  const remuneracaoTAC = clientesMes * 49.90;

  const nomesMeses = gerarMesesDinamicos(120);
  let meses = 0;
  let acumulado = tpvAtual;
  const rows: PremiacoesRow[] = [];
  const jaAtingiu = tpvAtual >= meta;

  if (jaAtingiu) {
    const mesesProjecao = 12;
    for (let m = 1; m <= mesesProjecao; m++) {
      acumulado = tpvAtual + tpvPorMes * m;
      rows.push({
        mesNum: m,
        mesNome: nomesMeses[m - 1] || `Mês ${m}`,
        acumulado,
        tpvPorMes,
        comissao: acumulado * recorrencia,
      });
    }
  } else {
    while (acumulado < meta && meses < 60) {
      meses++;
      acumulado = tpvAtual + (tpvPorMes * meses);
      const comissao = acumulado * recorrencia;
      rows.push({
        mesNum: meses,
        mesNome: nomesMeses[meses - 1] || `Mês ${meses}`,
        acumulado,
        tpvPorMes,
        comissao,
      });
    }
  }

  return {
    tpvAtual,
    tpvMedio,
    clientesMes,
    recorrencia,
    remuneracaoTAC,
    campanha,
    meses: jaAtingiu ? 0 : meses,
    tpvPorMes,
    atingiu: jaAtingiu || acumulado >= meta,
    rows,
  };
}

export function calcularCrescimentoData(
  comissaoProjetada: number,
  recorrencia: number,
  tpvMedio: number,
  clientesMes: number,
  usarTpvAtual: boolean,
  tpvAtualInput: number,
  usarTempoAtingimento: boolean,
  tempoAtingimentoInput: number
): CrescimentoResult | null {
  if (comissaoProjetada <= 0 || recorrencia <= 0 || tpvMedio <= 0 || clientesMes <= 0) {
    return null;
  }

  const tpvNecessario = comissaoProjetada / recorrencia;
  const tpvMensal = tpvMedio * clientesMes;
  const tpvAtual = usarTpvAtual ? tpvAtualInput : 0;
  const remuneracaoTAC = clientesMes * 49.90;

  let mesesProjecao = 24;
  let tpvMensalNecessario: number | null = null;

  if (usarTempoAtingimento) {
    mesesProjecao = tempoAtingimentoInput || 12;
    const tpvParaCrescer = Math.max(0, tpvNecessario - tpvAtual);
    tpvMensalNecessario = tpvParaCrescer / mesesProjecao;
  }

  const nomesMeses = gerarMesesDinamicos(60);
  let tpvAcumulado = tpvAtual;
  let mesMetaAtingida: number | null = null;
  const rows: CrescimentoRow[] = [];

  for (let mes = 1; mes <= mesesProjecao; mes++) {
    tpvAcumulado += tpvMensal;
    const comissaoMensal = tpvAcumulado * recorrencia;

    if (comissaoMensal >= comissaoProjetada && !mesMetaAtingida) {
      mesMetaAtingida = mes;
    }

    const nomeMes = nomesMeses[mes - 1] || `Mês ${mes}`;
    const comissaoMaisTAC = comissaoMensal + remuneracaoTAC;

    rows.push({
      mes: nomeMes,
      tpvMensal,
      tpvAcumulado,
      comissao: comissaoMensal,
      remuneracaoTAC,
      comissaoMaisTAC,
    });

    // If not locked to a specific timeframe, stop once the goal is reached
    if (!usarTempoAtingimento && comissaoMensal >= comissaoProjetada) {
      break;
    }
  }

  const mesNomeAtingida = mesMetaAtingida
    ? nomesMeses[mesMetaAtingida - 1] || `Mês ${mesMetaAtingida}`
    : null;

  const metaAlcancavel = tpvMensalNecessario !== null
    ? tpvMensal >= tpvMensalNecessario
    : true;

  return {
    comissaoProjetada,
    recorrencia,
    tpvMedio,
    clientesMes,
    remuneracaoTAC,
    tpvNecessario,
    tpvMensal,
    tpvAtual,
    usarTpvAtual,
    usarTempoAtingimento,
    tempoAtingimento: mesesProjecao,
    tpvMensalNecessario,
    metaAlcancavel,
    mesMetaAtingida,
    mesNomeAtingida,
    rows,
  };
}

import React, { useState } from 'react';
import {
  Palmtree,
  Printer,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import {
  CAMPANHAS_OFICIAIS,
  formatCurrency,
  formatPercent,
  parseValue,
  parsePercentage,
  gerarMesesDinamicos,
} from '../data/campaigns';
import confetti from 'canvas-confetti';

interface ConvencaoRJViewProps {
  initialTpv?: number;
  initialRecorrencia?: number;
  initialCampanhaId?: number;
  onOpenReport?: (data: any) => void;
  onOpenHelp?: () => void;
}

export const ConvencaoRJView: React.FC<ConvencaoRJViewProps> = ({
  initialTpv,
  initialRecorrencia,
  initialCampanhaId = 0,
  onOpenReport,
  onOpenHelp,
}) => {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();
  const anoConvencao = mesAtual >= 7 ? anoAtual + 1 : anoAtual;
  const anoAlvoAbril = mesAtual >= 4 ? anoAtual + 1 : anoAtual;

  let mesesAteAbril = (anoAlvoAbril - anoAtual) * 12 + (4 - mesAtual);
  if (mesesAteAbril <= 0) mesesAteAbril = 1;

  const [tpvStr, setTpvStr] = useState<string>(initialTpv ? initialTpv.toString() : '');
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>(
    initialRecorrencia
      ? (initialRecorrencia * 100).toFixed(2).replace('.', ',') + '%'
      : ''
  );
  const [crescimentoPersonalizadoStr, setCrescimentoPersonalizadoStr] = useState<string>('');
  const [tpvError, setTpvError] = useState(false);
  const [campanhaId, setCampanhaId] = useState<number>(initialCampanhaId);
  const [result, setResult] = useState<any>(null);

  const selectedCampanha =
    CAMPANHAS_OFICIAIS.find((c) => c.id === campanhaId) || CAMPANHAS_OFICIAIS[0];

  const handleCalcular = () => {
    const tpv = parseValue(tpvStr);
    const rec = parsePercentage(recorrenciaStr);
    const crescCustom = parseValue(crescimentoPersonalizadoStr);

    if (!tpvStr || tpv <= 0) {
      setTpvError(true);
      setResult(null);
      return;
    }
    setTpvError(false);

    const meta = selectedCampanha.meta;
    const jaAtingiu = tpv >= meta;

    if (jaAtingiu) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    const faltam = Math.max(0, meta - tpv);

    // Gerar cronograma até Julho do ano da Convenção (fechamento oficial)
    const totalMesesCronograma = Math.max(
      mesesAteAbril + 4,
      (anoConvencao - anoAtual) * 12 + (7 - mesAtual) + 1
    );
    const nomesMeses = gerarMesesDinamicos(totalMesesCronograma);
    const cronograma: any[] = [];

    // Localizar o mês de Abril do próximo ano para calibrar o ritmo necessário
    const idxAbril = nomesMeses.findIndex((m) => m.startsWith('04/'));
    const mesesParaAbril = idxAbril !== -1 ? idxAbril + 1 : mesesAteAbril;

    // Ritmo de crescimento mensal:
    // Se o usuário informou um ritmo customizado, utiliza-o.
    // Se não informou:
    // - Se ainda não bateu a meta, calcula o necessário para bater em Abril: faltam / mesesParaAbril
    // - Se já bateu a meta, projeta expansão saudável contínua (mínimo de R$ 50.000 ou 5% ao mês)
    let crescimentoMensal: number;
    if (crescCustom > 0) {
      crescimentoMensal = crescCustom;
    } else if (jaAtingiu) {
      crescimentoMensal = Math.max(50000, Math.round((tpv * 0.05) / 10000) * 10000);
    } else {
      crescimentoMensal = faltam > 0 ? faltam / mesesParaAbril : 0;
    }

    const percentualCrescimento = tpv > 0 ? (crescimentoMensal / tpv) * 100 : 0;

    let viabilidadeLabel = '🟢 Alcançável';
    let viabilidadeTipo = 'alcancavel';
    let viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (jaAtingiu) {
      viabilidadeLabel = '🟢 Elegível (Meta Já Superada)';
      viabilidadeTipo = 'alcancavel';
      viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (percentualCrescimento <= 15) {
      viabilidadeLabel = '🟢 Alcançável (até 15% a.m.)';
      viabilidadeTipo = 'alcancavel';
      viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (percentualCrescimento <= 30) {
      viabilidadeLabel = '🟡 Desafiador (15% a 30% a.m.)';
      viabilidadeTipo = 'desafiador';
      viabilidadeCor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else {
      viabilidadeLabel = '🔴 Agressivo (> 30% a.m.)';
      viabilidadeTipo = 'agressivo';
      viabilidadeCor = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    // Preenche crescimento, TPV atingido e remuneração continuamente todos os meses
    for (let q = 0; q < totalMesesCronograma; q++) {
      const cresc = crescimentoMensal;
      const tpvSimulado = tpv + crescimentoMensal * (q + 1);
      const remun = tpvSimulado * rec;
      const numMes = parseInt(nomesMeses[q].split('/')[0], 10);
      const anoRef = numMes <= 7 ? anoConvencao : anoConvencao - 1;

      let statusTexto = '';
      let statusTipo = 'construcao';

      if (numMes === 7) {
        // Julho: Fechamento final oficial
        if (tpvSimulado >= meta) {
          statusTexto = '🏆 Elegível (Final)';
          statusTipo = 'elegivel_final';
        } else {
          statusTexto = '❌ Não elegível (Final)';
          statusTipo = 'nao_elegivel';
        }
      } else if (numMes >= 4 && numMes <= 6) {
        // Abril a Junho: Período oficial de qualificação / elegibilidade
        if (tpvSimulado >= meta) {
          statusTexto = '🏆 Elegível';
          statusTipo = 'elegivel';
        } else {
          statusTexto = '❌ Não elegível';
          statusTipo = 'nao_elegivel';
        }
      } else {
        if (tpvSimulado >= meta) {
          statusTexto = '⚠️ Pré-validação';
          statusTipo = 'pre_validacao';
        } else {
          statusTexto = '⏳ Construção';
          statusTipo = 'construcao';
        }
      }

      cronograma.push({
        mes: nomesMeses[q],
        mesNumero: numMes,
        tpvMeta: meta,
        crescimento: cresc,
        tpvAtingido: tpvSimulado,
        remuneracao: remun,
        status: statusTexto,
        statusTipo,
        anoReferencia: anoRef,
      });
    }

    const tpvAtingidoFinal = cronograma[cronograma.length - 1]?.tpvAtingido || meta;
    const idxMesAbril = idxAbril !== -1 ? idxAbril : mesesParaAbril - 1;
    const comissaoAoAtingir = cronograma[idxMesAbril]?.remuneracao || (tpv + crescimentoMensal * mesesParaAbril) * rec;

    setResult({
      tpvAtual: tpv,
      recorrencia: rec,
      campanha: selectedCampanha,
      mesesDisponiveis: mesesParaAbril,
      mesesAteAbril: mesesParaAbril,
      totalMesesCronograma,
      anoConvencao,
      anoAlvoAbril,
      meta,
      faltam,
      crescimentoNecessario: crescimentoMensal,
      percentualCrescimento,
      comissaoAoAtingir,
      tpvAtingidoFinal,
      cronograma,
      viabilidade: {
        label: viabilidadeLabel,
        tipo: viabilidadeTipo,
        cor: viabilidadeCor,
      },
      jaAtingida: jaAtingiu,
    });
  };

  const handleLimpar = () => {
    setTpvStr('');
    setRecorrenciaStr('');
    setCrescimentoPersonalizadoStr('');
    setTpvError(false);
    setResult(null);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Banner Principal Topo */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs mb-1.5">
            <Palmtree className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Convenção Regional B91</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Planner Convenção RJ
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Planejamento estratégico de TPV para atingimento das metas com regras de elegibilidade oficial
          </p>
        </div>

        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            title="Ver manual de como usar esta ferramenta"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#ff5e36] text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-center group"
          >
            <BookOpen className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            <span>Como usar esta aba</span>
          </button>
        )}
      </div>

      {/* Grid com 2 Colunas: Parâmetros (Esquerda) e Card da Campanha (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Parâmetros de Simulação */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-[#ff5e36] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#ff5e36]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Parâmetros de Simulação</h3>
          </div>

          {/* Grid de Inputs: TPV e Recorrência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                TPV ATUAL (R$)
              </label>
              <CurrencyInput
                value={tpvStr}
                onChangeValue={(v) => {
                  setTpvStr(v.toString());
                  if (tpvError) setTpvError(false);
                }}
                placeholder="R$ 0,00"
                className={`w-full bg-slate-50/70 border ${
                  tpvError ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400/40' : 'border-slate-200 focus:border-[#ff5e36]'
                } rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none transition-all`}
              />
              {tpvError ? (
                <p className="text-[11px] text-rose-500 font-bold mt-1">
                  Informe o TPV atual para calcular a projeção.
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Volume transacionado atual da sua carteira
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                RECORRÊNCIA (%)
              </label>
              <PercentInput
                value={recorrenciaStr}
                onChange={(val) => setRecorrenciaStr(val)}
                placeholder="0,32%"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:bg-white focus:border-[#ff5e36] focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Padrão institucional B91: 0,32%
              </p>
            </div>
          </div>

          {/* Crescimento Mensal Desejado (Opcional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                CRESCIMENTO MENSAL DESEJADO (R$/MÊS)
              </label>
              <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                Opcional • Calculado automaticamente se vazio
              </span>
            </div>
            <CurrencyInput
              value={crescimentoPersonalizadoStr}
              onChangeValue={(v) => setCrescimentoPersonalizadoStr(v.toString())}
              placeholder="Ex: R$ 100.000,00 (deixe vazio para cálculo automático)"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:bg-white focus:border-[#ff5e36] focus:outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Se não preenchido, calcula o ritmo exato para bater a meta em Abril (ou expansão contínua se já elegível)
            </p>
          </div>

          {/* Seleção de Campanha */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              SELECIONE A CAMPANHA / PREMIAÇÃO ALVO
            </label>
            <select
              value={campanhaId}
              onChange={(e) => setCampanhaId(parseInt(e.target.value, 10))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:border-[#ff5e36] focus:outline-none transition-all cursor-pointer"
            >
              {CAMPANHAS_OFICIAIS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nome} (Meta: {formatCurrency(c.meta)})
                </option>
              ))}
            </select>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCalcular}
              className="px-6 py-3 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center gap-2 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span>Calcular Projeção RJ</span>
            </button>

            <button
              onClick={handleLimpar}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Coluna Direita: Card da Campanha Alvo */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="relative h-48 sm:h-52 bg-slate-900 overflow-hidden">
            <img
              src={selectedCampanha.imagemUrl}
              alt={selectedCampanha.premio}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Badge Top Left */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="text-xs">🏷️</span>
              <span>Campanha Oficial</span>
            </div>

            {/* Badge Bottom Right */}
            <div className="absolute bottom-3 right-3 bg-[#ff5e36] text-white px-3 py-1 rounded-lg text-xs font-bold font-mono shadow-sm">
              Meta: {formatCurrency(selectedCampanha.meta)}
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCampanha.premio}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedCampanha.descricao}
              </p>
            </div>

            {/* Regra de Qualificação Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                REGRA B91 DE QUALIFICAÇÃO
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Manter TPV acima de {formatCurrency(selectedCampanha.meta)} por 3 meses consecutivos no ciclo até Julho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados da Simulação ou Empty State */}
      {!result ? (
        /* Empty State (Screenshot 3) */
        <div className="border border-dashed border-slate-300 rounded-2xl p-12 bg-white text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-[#ff5e36]">
            <div className="w-5 h-5 rounded-full border-2 border-[#ff5e36] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#ff5e36]" />
            </div>
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-3.5">
            Preencha os parâmetros para calcular a projeção
          </h4>
          <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2 leading-relaxed">
            Informe o TPV atual da sua carteira e clique em <strong>Calcular Projeção RJ</strong> para visualizar o cronograma mensal de atingimento com evolução de comissões até a Convenção RJ.
          </p>
        </div>
      ) : (
        /* Resultado da Simulação */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Resultado da Simulação • {result.campanha.premio}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ciclo até Julho de {result.anoConvencao} ({result.mesesDisponiveis} meses de crescimento disponível)
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenReport && onOpenReport(result)}
                className="px-4 py-2 bg-[#ff5e36] hover:bg-[#e84f29] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Impressão</span>
              </button>
            </div>
          </div>

          {result.jaAtingida && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h4 className="text-xl font-extrabold text-emerald-900">
                Parabéns! Sua carteira atual já atinge o TPV da campanha!
              </h4>
              <p className="text-sm text-emerald-700 max-w-xl mx-auto">
                Seu TPV de <strong>{formatCurrency(result.tpvAtual)}</strong> já cobre a meta de {formatCurrency(result.meta)}.
                Comissão mensal projetada de <strong>{formatCurrency(result.comissaoAoAtingir)}</strong> mantendo a recorrência de {formatPercent(result.recorrencia)}. Mantenha o volume por 3 meses para garantir a elegibilidade final.
              </p>
            </div>
          )}

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">
                Crescimento Mensal
              </span>
              <strong className="text-xl font-black text-slate-900 font-mono mt-1 block">
                {result.crescimentoNecessario > 0 ? `+${formatCurrency(result.crescimentoNecessario)}` : 'Meta Atingida'}
              </strong>
              <span className="text-[11px] text-slate-500">
                {result.crescimentoNecessario > 0
                  ? `+${result.percentualCrescimento.toFixed(1)}% ao mês até Abril/${result.anoAlvoAbril}`
                  : 'Manutenção de carteira ativa'}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">
                Prazo até Elegibilidade
              </span>
              <strong className="text-xl font-black text-blue-700 font-mono mt-1 block">
                {result.jaAtingida ? 'Já Elegível' : `${result.mesesAteAbril} meses`}
              </strong>
              <span className="text-[11px] text-slate-500">
                {result.jaAtingida ? 'Status Elegível ativo' : `Meta em Abril/${result.anoAlvoAbril} (Elegível)`}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">
                Comissão ao Atingir
              </span>
              <strong className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                {formatCurrency(result.comissaoAoAtingir)}
              </strong>
              <span className="text-[11px] text-slate-500">
                recorrência mensal sobre {formatCurrency(result.tpvAtingidoFinal)}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${result.viabilidade.cor}`}>
              <span className="text-xs font-semibold uppercase block opacity-80">
                Índice de Viabilidade
              </span>
              <strong className="text-base font-black mt-1 block">
                {result.viabilidade.label}
              </strong>
              <span className="text-[11px] opacity-80">
                ritmo necessário para elegibilidade
              </span>
            </div>
          </div>

          {/* Tabela do Cronograma */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="py-3 px-4 font-bold text-xs uppercase">Mês</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Meta TPV</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Crescimento</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">TPV Atingido</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Remuneração</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.cronograma.map((row: any, idx: number) => {
                  const isElegivel = row.statusTipo === 'elegivel_final' || row.statusTipo === 'elegivel';
                  const isNaoElegivel = row.statusTipo === 'nao_elegivel';

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 transition-colors ${
                        isElegivel ? 'bg-emerald-50/70' : isNaoElegivel ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">{row.mes}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{formatCurrency(row.tpvMeta)}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#ff5e36]">
                        {row.crescimento > 0 ? `+${formatCurrency(row.crescimento)}` : '-'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(row.tpvAtingido)}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                        {formatCurrency(row.remuneracao)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isElegivel
                              ? 'bg-emerald-100 text-emerald-800'
                              : isNaoElegivel
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rodapé Informativo (Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 px-1 pt-1">
        <span className="italic">ⓘ * As imagens do evento e da premiação são meramente ilustrativas.</span>
        <span>Convenção RJ • Circuito Oficial de Premiações B91</span>
      </div>
    </div>
  );
};

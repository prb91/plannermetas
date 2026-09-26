import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Copy,
  Check,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formatCurrency, formatPercent } from '../data/campaigns';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: string;
  data: any;
  userName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  tipo,
  data,
  userName,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !data) return null;

  const dataEmissao = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getTituloProjecao = () => {
    if (tipo === 'convencaoRJ') {
      const camp = data?.campanha?.nome || data?.campanha?.premio;
      return camp ? `Projeção de Convenção RJ (${camp})` : 'Projeção de Convenção RJ';
    }
    if (tipo === 'premiacoes') {
      const camp = data?.campanha?.premio || data?.campanha?.nome;
      return camp ? `Projeção de ${camp}` : 'Projeção de Todas as Premiações';
    }
    if (tipo === 'crescimento') {
      return 'Projeção de Remuneração e Crescimento';
    }
    if (tipo === 'geral' || tipo === 'comparador') {
      return 'Projeção de Quadro Executivo de Metas';
    }
    return data?.campanha?.nome ? `Projeção de ${data.campanha.nome}` : 'Projeção de Planejamento Comercial';
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById('relatorio-executivo');
    if (!el) return;

    const previousDisplay = el.style.display;
    el.style.display = 'block';
    if (!el) return;

    const waitForImages = async () => {
      const images = Array.from(el.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
            window.setTimeout(done, 5000);
          });
        })
      );
    };

    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    };

    try {
      setIsGeneratingPdf(true);
      await waitForImages();

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: Math.max(el.scrollWidth, 1200),
        windowHeight: el.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage('a4', 'landscape');
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const safeUser = userName
        ? userName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_')
        : 'consultor';
      const filename = `projecao_${tipo}_${safeUser}.pdf`;

      // Use a Blob download directly. This avoids the previous behavior where
      // the PDF was generated/previewed but the browser did not save the file.
      downloadBlob(pdf.output('blob'), filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao baixar PDF:', err);
      setDownloadSuccess(false);
    } finally {
      el.style.display = previousDisplay;
      setIsGeneratingPdf(false);
    }
  };

  const handleCopySummary = () => {
    let summary = `*PLANNER DE METAS B91 - RELATÓRIO ESTRATÉGICO*\n`;
    summary += `👤 Consultor: ${userName || 'CONSULTOR'}\n`;
    summary += `📅 Data: ${dataEmissao}\n\n`;

    if (tipo === 'convencaoRJ') {
      const comissaoVal = data.comissaoAoAtingir || (data.tpvAtingidoFinal || data.meta) * (data.recorrencia || 0.0032);
      summary += `🏖️ *Campanha:* ${data.campanha.nome} (${data.campanha.premio})\n`;
      summary += `🎯 *Meta:* ${formatCurrency(data.meta)}\n`;
      summary += `📊 *TPV Atual:* ${formatCurrency(data.tpvAtual)}\n`;
      summary += `💵 *Comissão Recorrente:* ${formatCurrency(comissaoVal)}/mês\n`;
      summary += `🚀 *Crescimento Necessário:* ${formatCurrency(data.crescimentoNecessario)}/mês (+${data.percentualCrescimento.toFixed(1)}%)\n`;
      summary += `⏳ *Prazo até Elegibilidade:* ${data.mesesAteAbril || data.mesesDisponiveis} meses (Abril/${data.anoAlvoAbril || data.anoConvencao})\n`;
      summary += `🚦 *Viabilidade:* ${data.viabilidade.label}\n`;
    } else if (tipo === 'premiacoes') {
      const comissaoVal = data.comissaoAoAtingir || data.rows[data.rows.length - 1]?.comissao || (data.meta * (data.recorrencia || 0.0032));
      const rendaTotalVal = data.comissaoTotalAoAtingir || data.rows[data.rows.length - 1]?.comissaoMaisTAC || 0;
      summary += `🏆 *Campanha:* ${data.campanha.nome} (${data.campanha.premio})\n`;
      summary += `🎯 *Meta Ajustada:* ${formatCurrency(data.meta)}\n`;
      summary += `⏱️ *Tempo Estimado:* ${data.meses === 0 || data.jaAtingiu ? 'Já Elegível' : `${data.meses} meses`}\n`;
      summary += `👥 *Novos Clientes/Mês:* ${data.clientesMes}\n`;
      summary += `💵 *Comissão Recorrente:* ${formatCurrency(comissaoVal)}/mês\n`;
      summary += `💰 *Renda Total ao Atingir:* ${formatCurrency(rendaTotalVal)}\n`;
    } else if (tipo === 'crescimento') {
      summary += `📈 *Renda Alvo:* ${formatCurrency(data.comissaoMeta)}/mês\n`;
      summary += `🎯 *TPV Total Necessário:* ${formatCurrency(data.tpvNecessario)}\n`;
      summary += `⏱️ *Mês de Atingimento:* ${data.nomeMesAtingida || 'Projetado'}\n`;
      summary += `👥 *Ritmo:* ${data.clientesMes} novos clientes/mês\n`;
    } else if (tipo === 'geral' && data.campanhas) {
      summary += `📊 *QUADRO COMPARATIVO DAS 6 CAMPANHAS*\n`;
      summary += `Ritmo mensal: ${formatCurrency(data.tpvPorMes)}/mês\n\n`;
      data.campanhas.forEach((c: any) => {
        summary += `• ${c.nome} (${c.premio}): ${c.jaBateu ? 'ELEGÍVEL' : c.mesesNecessarios + ' meses'} | Comissão: ${formatCurrency(c.comissaoAoBater)} | Total: ${formatCurrency(c.totalMensalAoBater)}\n`;
      });
    }

    summary += `\n_“Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?” — Lucas 14:28_`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    let text = `*Planner de Metas B91 - Projeção Estratégica*\nConsultor: ${userName || 'Consultor'}\nData: ${dataEmissao}\n`;
    if (tipo === 'convencaoRJ') {
      const comissaoVal = data.comissaoAoAtingir || (data.tpvAtingidoFinal || data.meta) * (data.recorrencia || 0.0032);
      text += `Meta: ${data.campanha.premio} (${formatCurrency(data.meta)})\nComissão: ${formatCurrency(comissaoVal)}/mês\nRitmo necessário: ${formatCurrency(data.crescimentoNecessario)}/mês (Meta em Abril/${data.anoAlvoAbril || data.anoConvencao})\nStatus: Elegível`;
    } else if (tipo === 'premiacoes') {
      const comissaoVal = data.comissaoAoAtingir || data.rows[data.rows.length - 1]?.comissao || (data.meta * (data.recorrencia || 0.0032));
      const rendaTotalVal = data.comissaoTotalAoAtingir || data.rows[data.rows.length - 1]?.comissaoMaisTAC || 0;
      text += `Prêmio: ${data.campanha.premio}\nTempo: ${data.meses === 0 || data.jaAtingiu ? 'Já Elegível' : `${data.meses} meses`}\nComissão: ${formatCurrency(comissaoVal)}\nRenda Total: ${formatCurrency(rendaTotalVal)}`;
    }
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[94vh] sm:max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl print:shadow-none print:border-none print:max-h-none print:w-full">
        {/* Barra Superior de Ações (No-Print) */}
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
          <div className="text-xs text-slate-500">
            Relatório Oficial pronto para download em PDF ou impressão.
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar em PDF'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Relatório executivo exclusivo para impressão/PDF. A interface do sistema permanece inalterada. */}
        <div
          id="relatorio-executivo"
          className="executive-report"
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          <div className="executive-header">
            <div>
              <div className="executive-kicker">PLANNER DE METAS B91</div>
              <h1>{getTituloProjecao()}</h1>
              <p>Relatório Executivo de Projeção Comercial</p>
            </div>
            <div className="executive-meta">
              <div><span>Consultor</span><strong>{userName || 'CONSULTOR'}</strong></div>
              <div><span>Emissão</span><strong>{dataEmissao}</strong></div>
            </div>
          </div>

          {tipo === 'convencaoRJ' && (
            <>
              <div className="executive-section-title">Resumo Executivo</div>
              <div className="executive-metrics">
                <div><span>TPV Atual</span><strong>{formatCurrency(data.tpvAtual)}</strong></div>
                <div><span>Recorrência</span><strong>{formatPercent(data.recorrencia || 0)}</strong></div>
                <div><span>Crescimento Mensal</span><strong>{data.crescimentoNecessario > 0 ? `+${formatCurrency(data.crescimentoNecessario)}` : 'Meta atingida'}</strong></div>
                <div><span>Meta</span><strong>{formatCurrency(data.meta)}</strong></div>
              </div>
              <div className="executive-highlight">
                <div>
                  <span>Campanha / Premiação</span>
                  <strong>{data.campanha?.nome || 'Campanha'} — {data.campanha?.premio || ''}</strong>
                </div>
                <div>
                  <span>Comissão ao atingir</span>
                  <strong>{formatCurrency(data.comissaoAoAtingir || (data.tpvAtingidoFinal || data.meta) * (data.recorrencia || 0.0032))}/mês</strong>
                </div>
                <div>
                  <span>Viabilidade</span>
                  <strong>{data.viabilidade?.label || 'Alcançável'}</strong>
                </div>
              </div>
              <div className="executive-section-title">Cronograma de Atingimento</div>
              <table className="executive-table">
                <thead><tr><th>Mês</th><th>Meta TPV</th><th>Crescimento</th><th>TPV Atingido</th><th>Remuneração</th><th>Status</th></tr></thead>
                <tbody>
                  {data.cronograma?.map((row: any, i: number) => (
                    <tr key={i}><td>{row.mes}</td><td>{formatCurrency(row.tpvMeta)}</td><td>{row.crescimento > 0 ? `+${formatCurrency(row.crescimento)}` : '-'}</td><td>{formatCurrency(row.tpvAtingido)}</td><td>{formatCurrency(row.remuneracao)}</td><td>{row.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tipo === 'premiacoes' && (
            <>
              <div className="executive-section-title">Resumo Executivo</div>
              <div className="executive-metrics">
                <div><span>Premiação</span><strong>{data.campanha?.premio || data.campanha?.nome || '—'}</strong></div>
                <div><span>Meta</span><strong>{formatCurrency(data.meta)}</strong></div>
                <div><span>Prazo</span><strong>{data.meses === 0 || data.jaAtingiu ? 'Já elegível' : `${data.meses} meses`}</strong></div>
                <div><span>Comissão ao atingir</span><strong>{formatCurrency(data.comissaoAoAtingir || data.rows?.[data.rows.length - 1]?.comissao || (data.meta * (data.recorrencia || 0.0032)))}/mês</strong></div>
              </div>
              <div className="executive-highlight">
                <div><span>Renda Total Mensal</span><strong>{formatCurrency(data.comissaoTotalAoAtingir || data.rows?.[data.rows.length - 1]?.comissaoMaisTAC || 0)}</strong></div>
                <div><span>Novos Clientes</span><strong>{data.clientesMes || 0}/mês</strong></div>
              </div>
              <div className="executive-section-title">Evolução Projetada</div>
              <table className="executive-table">
                <thead><tr><th>Mês</th><th>TPV Adicionado</th><th>TPV Acumulado</th><th>Comissão</th><th>TAC</th><th>Renda Total</th></tr></thead>
                <tbody>
                  {data.rows?.slice(0, 18).map((row: any, i: number) => (
                    <tr key={i} className={row.atingiuMeta ? 'executive-row-highlight' : ''}><td>{row.nomeMes}</td><td>{formatCurrency(row.tpvPorMes)}</td><td>{formatCurrency(row.acumulado)}</td><td>{formatCurrency(row.comissao)}</td><td>{formatCurrency(row.remuneracaoTAC)}</td><td>{formatCurrency(row.comissaoMaisTAC)}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tipo === 'crescimento' && (
            <>
              <div className="executive-section-title">Resumo Executivo</div>
              <div className="executive-metrics">
                <div><span>Renda Alvo</span><strong>{formatCurrency(data.comissaoMeta)}/mês</strong></div>
                <div><span>TPV Necessário</span><strong>{formatCurrency(data.tpvNecessario)}</strong></div>
                <div><span>Atingimento</span><strong>{data.nomeMesAtingida || 'Projetado'}</strong></div>
                <div><span>Novos Clientes</span><strong>{data.clientesMes || 0}/mês</strong></div>
              </div>
              <div className="executive-section-title">Evolução Projetada</div>
              <table className="executive-table">
                <thead><tr><th>Mês</th><th>TPV Novo</th><th>TPV Acumulado</th><th>Comissão</th><th>TAC</th><th>Renda Total</th><th>Status</th></tr></thead>
                <tbody>
                  {data.rows?.map((row: any, i: number) => (
                    <tr key={i} className={row.isMetaMonth ? 'executive-row-highlight' : ''}><td>{row.nomeMes}</td><td>{formatCurrency(row.tpvMensal)}</td><td>{formatCurrency(row.tpvAcumulado)}</td><td>{formatCurrency(row.comissao)}</td><td>{formatCurrency(row.remuneracaoTAC)}</td><td>{formatCurrency(row.comissaoMaisTAC)}</td><td>{row.isMetaMonth ? 'Meta alcançada' : row.comissao >= data.comissaoMeta ? 'Meta superada' : 'Construção'}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tipo === 'geral' && data.campanhas && (
            <>
              <div className="executive-section-title">Resumo das Premiações</div>
              <div className="executive-highlight single">
                <div><span>Ritmo mensal de TPV novo</span><strong>{formatCurrency(data.tpvPorMes)}/mês</strong></div>
              </div>
              <table className="executive-table">
                <thead><tr><th>Campanha</th><th>Prêmio</th><th>Meta</th><th>Falta</th><th>Prazo</th><th>Comissão</th><th>Renda Total</th></tr></thead>
                <tbody>
                  {data.campanhas.map((c: any) => (
                    <tr key={c.id}><td>{c.nome}</td><td>{c.premio}</td><td>{formatCurrency(c.meta)}</td><td>{formatCurrency(c.falta)}</td><td>{c.jaBateu ? 'Elegível' : `${c.mesesNecessarios} meses`}</td><td>{formatCurrency(c.comissaoAoBater)}</td><td>{formatCurrency(c.totalMensalAoBater)}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <div className="executive-footer">
            <span>Planner de Metas B91 • Relatório Executivo</span>
            <span>Projeções para planejamento estratégico • Resultados reais podem variar</span>
          </div>
        </div>

        {/* Conteúdo Imprimível do Relatório */}
        <div id="relatorio-conteudo" className="p-6 sm:p-10 space-y-8 bg-white text-slate-900">
          {/* Cabeçalho Corporativo */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5e36] to-[#e04520] text-white flex items-center justify-center font-black text-xl shadow-md">
                PR
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#ff5e36] block">
                  Gestão PR Negócios • B91
                </span>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  {getTituloProjecao()}
                </h1>
                <p className="text-xs text-slate-500">
                  Documento Estratégico de Metas, TPV e Projeção Financeira
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 sm:bg-transparent sm:p-0 sm:border-none">
              <div>
                <span className="text-slate-400">Consultor(a): </span>
                <strong className="text-slate-900 font-bold uppercase">{userName || 'CONSULTOR'}</strong>
              </div>
              <div>
                <span className="text-slate-400">Emissão: </span>
                <span className="text-slate-700 font-mono">{dataEmissao}</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulação Validada</span>
              </div>
            </div>
          </div>

          {/* Versículo / Fundamento */}
          <div className="p-3 bg-slate-50 border-l-4 border-[#ff5e36] rounded-r-xl text-xs text-slate-600 italic">
            &quot;Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?&quot; — Lucas 14:28
          </div>

          {/* Detalhes de Acordo com o Tipo */}
          {tipo === 'convencaoRJ' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Campanha Alvo</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                    {data.campanha.nome} - {data.campanha.premio}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Meta Exigida</span>
                  <strong className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
                    {formatCurrency(data.meta)}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Comissão ao Atingir</span>
                  <strong className="text-sm font-mono font-bold text-emerald-700 block mt-0.5">
                    {formatCurrency(data.comissaoAoAtingir || (data.tpvAtingidoFinal || data.meta) * (data.recorrencia || 0.0032))}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Crescimento Mensal</span>
                  <strong className="text-sm font-mono font-bold text-[#ff5e36] block mt-0.5">
                    {data.crescimentoNecessario > 0 ? `+${formatCurrency(data.crescimentoNecessario)}` : 'Meta Atingida'}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Índice Viabilidade</span>
                  <strong className="text-sm font-bold block mt-0.5">
                    {data.viabilidade?.label || '🟢 Alcançável'}
                  </strong>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Mês</th>
                      <th className="py-2.5 px-3">Meta TPV</th>
                      <th className="py-2.5 px-3">Crescimento</th>
                      <th className="py-2.5 px-3">TPV Atingido</th>
                      <th className="py-2.5 px-3">Remuneração</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.cronograma?.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold">{row.mes}</td>
                        <td className="py-2 px-3 font-mono">{formatCurrency(row.tpvMeta)}</td>
                        <td className="py-2 px-3 font-mono text-[#ff5e36]">
                          {row.crescimento > 0 ? `+${formatCurrency(row.crescimento)}` : '-'}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold">{formatCurrency(row.tpvAtingido)}</td>
                        <td className="py-2 px-3 font-mono text-emerald-700 font-bold">
                          {formatCurrency(row.remuneracao)}
                        </td>
                        <td className="py-2 px-3 font-semibold">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tipo === 'premiacoes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Prêmio Alvo</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                    {data.campanha.premio}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Meta Ajustada</span>
                  <strong className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
                    {formatCurrency(data.meta)}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Prazo de Conquista</span>
                  <strong className="text-sm font-bold text-purple-700 block mt-0.5">
                    {data.meses === 0 || data.jaAtingiu ? 'Já Elegível' : `${data.meses} meses`}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Comissão ao Atingir</span>
                  <strong className="text-sm font-mono font-bold text-emerald-700 block mt-0.5">
                    {formatCurrency(data.comissaoAoAtingir || data.rows[data.rows.length - 1]?.comissao || (data.meta * (data.recorrencia || 0.0032)))}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Renda Total Mensal</span>
                  <strong className="text-sm font-mono font-bold text-[#ff5e36] block mt-0.5">
                    {formatCurrency(data.comissaoTotalAoAtingir || data.rows[data.rows.length - 1]?.comissaoMaisTAC || 0)}
                  </strong>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Mês</th>
                      <th className="py-2.5 px-3">TPV Adicionado</th>
                      <th className="py-2.5 px-3">TPV Acumulado</th>
                      <th className="py-2.5 px-3">Comissão</th>
                      <th className="py-2.5 px-3">TAC</th>
                      <th className="py-2.5 px-3">Renda Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.rows?.slice(0, 18).map((row: any, i: number) => (
                      <tr key={i} className={row.atingiuMeta ? 'bg-amber-50 font-bold' : ''}>
                        <td className="py-2 px-3">{row.nomeMes}</td>
                        <td className="py-2 px-3 font-mono">{formatCurrency(row.tpvPorMes)}</td>
                        <td className="py-2 px-3 font-mono">{formatCurrency(row.acumulado)}</td>
                        <td className="py-2 px-3 font-mono text-emerald-700">{formatCurrency(row.comissao)}</td>
                        <td className="py-2 px-3 font-mono text-blue-700">{formatCurrency(row.remuneracaoTAC)}</td>
                        <td className="py-2 px-3 font-mono text-[#ff5e36] font-bold">
                          {formatCurrency(row.comissaoMaisTAC)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tipo === 'crescimento' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Renda Alvo Mensal</span>
                  <strong className="text-sm font-mono font-bold text-emerald-700 block mt-0.5">
                    {formatCurrency(data.comissaoMeta)}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">TPV em Carteira</span>
                  <strong className="text-sm font-mono font-bold text-slate-900 block mt-0.5">
                    {formatCurrency(data.tpvNecessario)}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Atingimento</span>
                  <strong className="text-sm font-bold text-blue-700 block mt-0.5">
                    {data.nomeMesAtingida || 'Projetado'}
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Novos Clientes</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                    {data.clientesMes}/mês
                  </strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Índice Viabilidade</span>
                  <strong className="text-sm font-bold block mt-0.5">
                    {data.viabilidade?.label || '🟢 Alcançável'}
                  </strong>
                </div>
              </div>

              {/* Tabela de Evolução da Remuneração */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Mês</th>
                      <th className="py-2.5 px-3">TPV Novo / Mês</th>
                      <th className="py-2.5 px-3">TPV Acumulado</th>
                      <th className="py-2.5 px-3">Comissão Recorrência</th>
                      <th className="py-2.5 px-3">Remuneração TAC</th>
                      <th className="py-2.5 px-3">Renda Total</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.rows?.map((row: any, i: number) => (
                      <tr key={i} className={row.isMetaMonth ? 'bg-amber-50 font-bold' : ''}>
                        <td className="py-2 px-3">{row.nomeMes}</td>
                        <td className="py-2 px-3 font-mono">{formatCurrency(row.tpvMensal)}</td>
                        <td className="py-2 px-3 font-mono">{formatCurrency(row.tpvAcumulado)}</td>
                        <td className="py-2 px-3 font-mono text-emerald-700">{formatCurrency(row.comissao)}</td>
                        <td className="py-2 px-3 font-mono text-blue-700">{formatCurrency(row.remuneracaoTAC)}</td>
                        <td className="py-2 px-3 font-mono text-[#ff5e36] font-bold">
                          {formatCurrency(row.comissaoMaisTAC)}
                        </td>
                        <td className="py-2 px-3 font-semibold">
                          {row.isMetaMonth ? '🎉 Meta Alcançada!' : row.comissao >= data.comissaoMeta ? 'Meta Superada' : 'Construção'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tipo === 'geral' && data.campanhas && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-bold mb-1">
                  Resumo das Premiações no Ritmo Atual ({formatCurrency(data.tpvPorMes)}/mês em TPV novo):
                </strong>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Campanha</th>
                      <th className="py-2.5 px-3">Prêmio</th>
                      <th className="py-2.5 px-3">Meta Ajustada</th>
                      <th className="py-2.5 px-3">Falta</th>
                      <th className="py-2.5 px-3">Tempo Estimado</th>
                      <th className="py-2.5 px-3">Comissão Recorrente</th>
                      <th className="py-2.5 px-3">Renda Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.campanhas.map((c: any) => (
                      <tr key={c.id}>
                        <td className="py-2 px-3 font-mono font-bold">{c.nome}</td>
                        <td className="py-2 px-3 font-semibold">{c.premio}</td>
                        <td className="py-2 px-3 font-mono">{formatCurrency(c.meta)}</td>
                        <td className="py-2 px-3 font-mono text-[#ff5e36]">{formatCurrency(c.falta)}</td>
                        <td className="py-2 px-3 font-bold">
                          {c.jaBateu ? (
                            <span className="text-emerald-700">Elegível</span>
                          ) : (
                            <span>{c.mesesNecessarios} meses</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-emerald-700 font-bold">
                          {formatCurrency(c.comissaoAoBater)}
                        </td>
                        <td className="py-2 px-3 font-mono text-purple-700 font-bold">
                          {formatCurrency(c.totalMensalAoBater)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assinatura Oficial */}
          <div className="pt-10 border-t border-slate-200 flex justify-center text-center text-xs">
            <div className="space-y-1 max-w-xs w-full">
              <div className="border-b border-slate-400 w-3/4 mx-auto pb-6" />
              <strong className="block text-slate-900 font-bold uppercase">{userName || 'CONSULTOR B91'}</strong>
              <span className="text-slate-500">Consultor(a) Comercial Responsável</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

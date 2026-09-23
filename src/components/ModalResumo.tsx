import React, { useState } from 'react';
import { X, Printer, FileDown, Loader2, Check, ExternalLink, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatMoneyNum, formatPercentage } from '../utils/formatters';

interface ModalResumoProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'convencaoRJ' | 'premiacoes' | 'crescimento' | 'geral';
  data: any;
  userName?: string;
}

export const ModalResumo: React.FC<ModalResumoProps> = ({
  isOpen,
  onClose,
  tipo,
  data,
  userName,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [generatedFileName, setGeneratedFileName] = useState<string>('');

  if (!isOpen || !data) return null;

  const handleDownloadPdf = async () => {
    const element = document.getElementById('relatorio-conteudo');
    if (!element) {
      window.print();
      return;
    }

    try {
      setIsExporting(true);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const cleanName = userName ? userName.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'consultor';
      const fileName = `relatorio_${tipo}_${cleanName}.pdf`;
      setGeneratedFileName(fileName);

      // Create Blob URL for direct user download
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      setGeneratedPdfUrl(blobUrl);

      // Trigger download via anchor element
      try {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          try {
            document.body.removeChild(link);
          } catch {}
        }, 1000);
      } catch (e) {
        console.warn('Anchor download failed:', e);
      }

      // Also call standard save as secondary attempt
      try {
        pdf.save(fileName);
      } catch (err) {
        console.warn('pdf.save failed:', err);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF via html2canvas/jsPDF:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[94vh] sm:max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl print:shadow-none print:border-none print:max-h-none print:w-full">
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
          <div className="text-xs text-slate-500">
            Dica: você pode <strong>Salvar em PDF</strong> direto no computador ou usar <strong>Salvar via Sistema / Imprimir</strong>.
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3 sm:px-4 py-2 bg-[#ff5e36] hover:bg-[#e84f29] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 disabled:cursor-not-allowed min-h-[36px]"
              title="Gerar e salvar arquivo PDF"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PDF Pronto!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Salvar em PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 sm:px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px]"
              title="Abre o diálogo de impressão (no destino, escolha 'Salvar como PDF')"
            >
              <Printer className="w-4 h-4 text-slate-600 shrink-0" />
              <span>
                <span className="hidden sm:inline">Salvar via Sistema / </span>Imprimir
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card de Download Direto com Interação Garantida */}
        {generatedPdfUrl && (
          <div className="no-print mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-950">Seu PDF está pronto!</div>
                <div className="text-xs text-emerald-800">
                  Clique no botão verde abaixo para baixar o arquivo no seu dispositivo.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={generatedPdfUrl}
                download={generatedFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Baixar {generatedFileName}</span>
              </a>
              <a
                href={generatedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir em Nova Aba</span>
              </a>
            </div>
          </div>
        )}

        <div id="relatorio-conteudo" className="p-4 sm:p-8 space-y-6 sm:space-y-8 print:p-4 bg-white">
          <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-[#ff5e36] mb-1">
                Gestão PR Negócios
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {tipo === 'convencaoRJ' && 'Planejamento Estratégico - Convenção RJ'}
                {tipo === 'premiacoes' && 'Plano de Atingimento de Premiações'}
                {tipo === 'crescimento' && 'Projeção de Evolução da Remuneração'}
                {tipo === 'geral' && 'Quadro Consolidado de Metas e Performance'}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1.5 font-medium">
                {userName && (
                  <span>
                    <strong className="text-slate-900">Consultor(a):</strong> {userName}
                  </span>
                )}
                <span>
                  <strong className="text-slate-900">Data:</strong> {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {tipo === 'convencaoRJ' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Campanha</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{data.campanha?.premio}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Meta TPV</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{formatMoneyNum(data.meta)}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">TPV Atual</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{formatMoneyNum(data.tpvAtual)}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Viabilidade</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{data.viabilidade?.label}</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Mês</th>
                      <th className="p-3">Meta TPV</th>
                      <th className="p-3">Crescimento</th>
                      <th className="p-3">TPV Atingido</th>
                      <th className="p-3">Remuneração</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.cronograma?.map((r: any, i: number) => (
                      <tr key={i} className={r.mesNumero === 7 ? 'bg-amber-50 font-bold' : ''}>
                        <td className="p-3 font-semibold">{r.mes}</td>
                        <td className="p-3">{formatMoneyNum(r.tpvMeta)}</td>
                        <td className="p-3 text-blue-600">{r.crescimento > 0 ? `+${formatMoneyNum(r.crescimento)}` : '—'}</td>
                        <td className="p-3 font-bold">{formatMoneyNum(r.tpvAtingido)}</td>
                        <td className="p-3 text-emerald-600 font-semibold">{formatMoneyNum(r.remuneracao)}</td>
                        <td className="p-3 font-semibold">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tipo === 'premiacoes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Premiação</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{data.campanha?.premio}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Meta Oficial</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{formatMoneyNum(data.meta)}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Tempo de Atingimento</div>
                  <div className="text-base font-bold text-orange-600 mt-0.5">{data.meses} meses</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Remuneração TAC Mensal</div>
                  <div className="text-base font-bold text-blue-600 mt-0.5">{formatMoneyNum(data.remuneracaoTAC)}</div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Mês</th>
                      <th className="p-3">TPV Projetado/Mês</th>
                      <th className="p-3">TPV Acumulado</th>
                      <th className="p-3">Comissão</th>
                      <th className="p-3">Remuneração TAC</th>
                      <th className="p-3">Total Mensal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.rows?.map((r: any, i: number) => (
                      <tr key={i} className={r.atingiuMeta ? 'bg-emerald-50 font-bold' : ''}>
                        <td className="p-3 font-semibold">{r.nomeMes}</td>
                        <td className="p-3">{formatMoneyNum(r.tpvPorMes)}</td>
                        <td className="p-3 font-bold">{formatMoneyNum(r.acumulado)}</td>
                        <td className="p-3 text-emerald-600">{formatMoneyNum(r.comissao)}</td>
                        <td className="p-3 text-blue-600">{formatMoneyNum(r.remuneracaoTAC)}</td>
                        <td className="p-3 font-black text-purple-700">{formatMoneyNum(r.comissaoMaisTAC)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tipo === 'crescimento' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Comissão Meta</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{formatMoneyNum(data.comissaoMeta)}/mês</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">TPV Necessário</div>
                  <div className="text-base font-bold text-blue-900 mt-0.5">{formatMoneyNum(data.tpvNecessario)}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Mês de Conquista</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{data.nomeMesAtingida || 'Em progresso'}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">TAC Adicional</div>
                  <div className="text-base font-bold text-purple-700 mt-0.5">{formatMoneyNum(data.remuneracaoTAC)}/mês</div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Mês</th>
                      <th className="p-3">TPV Projetado/Mês</th>
                      <th className="p-3">TPV Acumulado</th>
                      <th className="p-3">Comissão</th>
                      <th className="p-3">Remuneração TAC</th>
                      <th className="p-3">Total Mensal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.rows?.map((r: any, i: number) => (
                      <tr key={i} className={r.isMetaMonth ? 'bg-emerald-50 font-bold' : ''}>
                        <td className="p-3 font-semibold">{r.nomeMes}</td>
                        <td className="p-3">{formatMoneyNum(r.tpvMensal)}</td>
                        <td className="p-3 font-bold">{formatMoneyNum(r.tpvAcumulado)}</td>
                        <td className="p-3 text-emerald-600">{formatMoneyNum(r.comissao)}</td>
                        <td className="p-3 text-blue-600">{formatMoneyNum(r.remuneracaoTAC)}</td>
                        <td className="p-3 font-black text-purple-700">{formatMoneyNum(r.comissaoMaisTAC)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tipo === 'geral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold uppercase">TPV Atual</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{formatMoneyNum(data.tpvAtual)}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Ritmo Mensal</div>
                  <div className="text-base font-bold text-blue-900 mt-0.5">{formatMoneyNum(data.tpvPorMes)}/mês</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">TAC Mensal ({data.clientesMes} clientes)</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{formatMoneyNum(data.tacMensal)}/mês</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Taxa de Recorrência</div>
                  <div className="text-base font-bold text-purple-700 mt-0.5">{formatPercentage(data.recorrencia)}</div>
                </div>
              </div>

              {data.fatorCompensacao && data.fatorCompensacao > 1 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong>⚠️ Compensação de Recorrência Ativa ({formatPercentage(data.recorrencia)} vs 0,32% Padrão):</strong> As metas de TPV foram recalculadas com fator +{((data.fatorCompensacao - 1) * 100).toFixed(1)}% para compensar a menor taxa e manter rigorosamente a comissão estipulada de cada campanha corporativa.
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Campanha</th>
                      <th className="p-3">Prêmio Oficial</th>
                      <th className="p-3">{data.fatorCompensacao && data.fatorCompensacao > 1 ? 'Meta TPV Corrigida' : 'Meta TPV'}</th>
                      <th className="p-3">Falta</th>
                      <th className="p-3">Prazo Estimado</th>
                      <th className="p-3">Comissão Recorrente</th>
                      <th className="p-3">Total com TAC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.campanhas?.map((c: any, i: number) => (
                      <tr key={i} className={c.jaBateu ? 'bg-emerald-50/70 font-semibold' : ''}>
                        <td className="p-3 font-bold text-slate-900">{c.nome}</td>
                        <td className="p-3 text-slate-700">{c.premio}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{formatMoneyNum(c.meta)}</div>
                          {c.fatorCompensacao && c.fatorCompensacao > 1 && c.metaOriginal && (
                            <div className="text-[10px] text-slate-400 line-through">
                              Padrão: {formatMoneyNum(c.metaOriginal)}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">{c.jaBateu ? 'Conquistada!' : formatMoneyNum(c.falta)}</td>
                        <td className="p-3 font-bold text-orange-600">
                          {c.jaBateu ? 'Atingida' : `${c.mesesNecessarios} meses`}
                        </td>
                        <td className="p-3 text-emerald-700 font-medium">{formatMoneyNum(c.comissaoAoBater)}/mês</td>
                        <td className="p-3 font-black text-purple-800">{formatMoneyNum(c.totalMensalAoBater)}/mês</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>Gestão PR Negócios • Sistema Oficial de Planejamento Comercial</div>
            <div>Planejamento Estratégico Comercial • Gestão PR Negócios</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileArchive, CheckCircle2, AlertTriangle, FileCode, 
  FileText, Box, ArrowRight, Eye, RefreshCw, Cpu, Layers, Sparkles
} from 'lucide-react';
import { ZipAnalysis, ZipFileEntry } from '../types/model';
import { analyzeZipBlob } from '../utils/zipAnalyzer';
import { 
  createTeachableMachineSampleZip, 
  create3DModelSampleZip, 
  createPyTorchBundleSampleZip 
} from '../utils/sampleZips';

interface ZipInspectorProps {
  currentAnalysis: ZipAnalysis | null;
  onAnalysisComplete: (analysis: ZipAnalysis) => void;
  onSelectAction: (action: 'test' | 'code' | 'guide') => void;
}

export const ZipInspector: React.FC<ZipInspectorProps> = ({
  currentAnalysis,
  onAnalysisComplete,
  onSelectAction,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File | Blob, name: string) => {
    setIsProcessing(true);
    try {
      const analysis = await analyzeZipBlob(file, name);
      onAnalysisComplete(analysis);
      // Select the first text/json file by default if available
      const jsonKey = Object.keys(analysis.extractedTextFiles)[0];
      if (jsonKey) setSelectedFileForPreview(jsonKey);
    } catch (err) {
      console.error('Erro ao analisar arquivo ZIP:', err);
      alert('Não foi possível ler o arquivo ZIP. Certifique-se de que é um arquivo .zip válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file, file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file, file.name);
    }
  };

  const handleLoadSample = async (type: 'teachable' | '3d' | 'pytorch') => {
    setIsProcessing(true);
    try {
      let blob: Blob;
      let name = '';
      if (type === 'teachable') {
        blob = await createTeachableMachineSampleZip();
        name = 'teachable_machine_model.zip';
      } else if (type === '3d') {
        blob = await create3DModelSampleZip();
        name = 'objeto_cristal_3d.zip';
      } else {
        blob = await createPyTorchBundleSampleZip();
        name = 'pytorch_resnet_model.zip';
      }
      await handleProcessFile(blob, name);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="inspector" className="space-y-6">
      {/* Header of Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Inspecione qualquer Modelo em arquivo ZIP
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Arraste seu arquivo ZIP ou clique em uma amostra. A análise é executada 100% no seu navegador com zero envio externo.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Exemplos Prontos:</span>
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleLoadSample('teachable')}
              className="px-2.5 py-1 text-xs font-medium rounded-md text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 hover:bg-cyan-900/50 transition-colors whitespace-nowrap"
            >
              Teachable Machine (.zip)
            </button>
            <button
              onClick={() => handleLoadSample('3d')}
              className="px-2.5 py-1 text-xs font-medium rounded-md text-purple-300 bg-purple-950/60 border border-purple-800/40 hover:bg-purple-900/50 transition-colors whitespace-nowrap"
            >
              Modelo 3D (.zip)
            </button>
            <button
              onClick={() => handleLoadSample('pytorch')}
              className="px-2.5 py-1 text-xs font-medium rounded-md text-amber-300 bg-amber-950/60 border border-amber-800/40 hover:bg-amber-900/50 transition-colors whitespace-nowrap"
            >
              PyTorch (.zip)
            </button>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 md:p-8 text-center transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-200">
              {isProcessing
                ? 'Descompactando e analisando tensores...'
                : 'Arraste e solte o arquivo .ZIP do seu modelo aqui'}
            </p>
            <p className="text-xs text-slate-400">
              ou clique para selecionar do seu computador (Teachable Machine, TensorFlow.js, ONNX, TFLite, GLTF, PyTorch)
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {currentAnalysis && (
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
          {/* Top Banner of Detection */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileArchive className="w-4 h-4 text-cyan-400" />
                  {currentAnalysis.fileName}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono tabular-nums">
                  {currentAnalysis.fileCount} arquivos
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono tabular-nums">
                  {currentAnalysis.formattedTotalSize} descompactado
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>{currentAnalysis.detection.title}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  <CheckCircle2 className="w-3 h-3" /> Detectado
                </span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentAnalysis.detection.description}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {(currentAnalysis.detection.category === 'teachable_machine' ||
                currentAnalysis.detection.category === 'tensorflow_js') && (
                <button
                  onClick={() => onSelectAction('test')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Testar Inferência Live</span>
                </button>
              )}

              {currentAnalysis.detection.category === 'model_3d' && (
                <button
                  onClick={() => onSelectAction('test')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500 text-white hover:bg-purple-400 transition-colors shadow-sm shadow-purple-500/20"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Ver em 3D Interativo</span>
                </button>
              )}

              <button
                onClick={() => onSelectAction('code')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ver Código Pronto</span>
              </button>
            </div>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-400">Framework Principal:</span>
              <div className="font-semibold text-slate-200">
                {currentAnalysis.detection.framework}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-400">Ambiente Recomendado:</span>
              <div className="font-semibold text-cyan-300">
                {currentAnalysis.detection.runtimeTarget}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-400">Status dos Arquivos:</span>
              <div className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Todos os arquivos essenciais presentes</span>
              </div>
            </div>
          </div>

          {/* Missing files warning if any */}
          {currentAnalysis.detection.missingFiles && (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção:</strong> O modelo pode requerer arquivos adicionais:
                <ul className="list-disc list-inside mt-1 font-mono text-[11px]">
                  {currentAnalysis.detection.missingFiles.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* File Explorer & Content Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
            {/* Left: Files List */}
            <div className="md:col-span-5 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Arquivos Dentro do ZIP ({currentAnalysis.files.length})</span>
                <span className="text-[11px] text-slate-500">Clique para inspecionar</span>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {currentAnalysis.files.map((file) => {
                  const isSelected = selectedFileForPreview === file.name;
                  const isJson = file.extension === 'json';
                  const isBin = file.extension === 'bin' || file.extension === 'pt';

                  return (
                    <button
                      key={file.name}
                      onClick={() => {
                        if (currentAnalysis.extractedTextFiles[file.name]) {
                          setSelectedFileForPreview(file.name);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                          : 'bg-slate-950/50 hover:bg-slate-800/50 text-slate-300 border border-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isJson ? (
                          <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : isBin ? (
                          <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate font-mono text-[11px]">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono tabular-nums shrink-0 ml-2">
                        {file.formattedSize}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: File Preview Content */}
            <div className="md:col-span-7 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Pré-visualização de Conteúdo</span>
                {selectedFileForPreview && (
                  <span className="text-[11px] font-mono text-cyan-400">
                    {selectedFileForPreview}
                  </span>
                )}
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 h-60 overflow-auto">
                {selectedFileForPreview && currentAnalysis.extractedTextFiles[selectedFileForPreview] ? (
                  <pre className="text-[11px] font-mono text-slate-300 whitespace-pre leading-relaxed">
                    <code>{currentAnalysis.extractedTextFiles[selectedFileForPreview]}</code>
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                    <Eye className="w-6 h-6 mb-1 opacity-50" />
                    <span>Selecione um arquivo de texto/JSON à esquerda para visualizar seu conteúdo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React from 'react';
import { CheckCircle2, ArrowRight, Zap, FolderArchive, Cpu, ShieldCheck } from 'lucide-react';

export const DirectAnswerBanner: React.FC = () => {
  return (
    <section id="resposta" className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8">
      {/* Decorative subtle background aura */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Main headline answer */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Resposta Direta: Sim, é 100% possível!</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Como usar um modelo que está em uma pasta zipada no seu app
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            Arquivos compactados em <code className="text-cyan-300 font-mono">.zip</code> são exatamente o formato padrão pelo qual ferramentas como o <strong>Google Teachable Machine</strong>, <strong>TensorFlow.js</strong>, <strong>Keras</strong> e repositórios 3D distribuem modelos prontos. Você pode utilizá-los de duas formas principais:
          </p>
        </div>

        {/* 2 Primary Methods Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Method A */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <FolderArchive className="w-4 h-4" />
              <span>Método A: Extrair na pasta do projeto (Recomendado)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você extrai os arquivos do <code className="text-cyan-300 font-mono">.zip</code> uma única vez e coloca na pasta <code className="text-cyan-300 font-mono">/public/models/</code> do seu projeto React / Next.js.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Vantagem: O navegador faz cache automático e a execução é instantânea com WebGL!</span>
            </div>
          </div>

          {/* Method B */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Método B: Descompactar via código em tempo de execução</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seu app recebe o arquivo <code className="text-purple-300 font-mono">.zip</code> (ex: upload do usuário ou download remoto) e a biblioteca <code className="text-purple-300 font-mono">JSZip</code> extrai os dados diretamente na memória RAM.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vantagem: Permite que os usuários enviem seus próprios modelos personalizados!</span>
            </div>
          </div>
        </div>

        {/* Action jump */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <span className="text-slate-400">Teste agora mesmo:</span>
          <a
            href="#inspector"
            className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Arraste seu arquivo ZIP abaixo para inspecionar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

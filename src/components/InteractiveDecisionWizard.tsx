import React, { useState } from 'react';
import { Compass, ArrowRight, CheckCircle2, AlertTriangle, Cpu, Globe, Smartphone, Server } from 'lucide-react';

export const InteractiveDecisionWizard: React.FC = () => {
  const [platform, setPlatform] = useState<'web' | 'mobile' | 'backend'>('web');
  const [fileType, setFileType] = useState<'tfjs' | 'onnx' | 'tflite' | 'pytorch' | 'model3d'>('tfjs');
  const [sizeRange, setSizeRange] = useState<'small' | 'medium' | 'large'>('small');

  const getRecommendation = () => {
    if (fileType === 'model3d') {
      return {
        title: 'Visualização 3D WebGL (Three.js / React Three Fiber)',
        difficulty: 'Fácil',
        approach: 'Descompacte na pasta public/assets/3d/',
        libraries: ['three', '@types/three', '@react-three/fiber (opcional)'],
        explanation: 'Modelos 3D (.gltf, .obj, .fbx) contêm geometrias e texturas. A melhor abordagem é descompactar o ZIP e carregar via GLTFLoader. Se os arquivos forem estáticos, o navegador faz cache automático com zero latência.',
        steps: [
          'Extraia o conteúdo do arquivo .zip.',
          'Mova a pasta resultante para dentro de /public/models/3d/.',
          'Use o GLTFLoader do Three.js para renderizar na cena WebGL.',
          'Garanta que as texturas (.png, .jpg) estejam na mesma pasta relativa do arquivo .gltf/.obj.',
        ],
      };
    }

    if (platform === 'web' && (fileType === 'tfjs' || fileType === 'onnx')) {
      return {
        title: 'Execução 100% Client-Side no Navegador (Zero Custo de Servidor)',
        difficulty: 'Muito Fácil',
        approach: 'Descompactar uma vez e servir via pasta public/',
        libraries: fileType === 'tfjs' 
          ? ['@tensorflow/tfjs', '@teachablemachine/image (se for Teachable Machine)']
          : ['onnxruntime-web'],
        explanation: 'Seu modelo foi feito para rodar direto no dispositivo do usuário! Ele roda sem enviar dados para a internet, mantendo 100% da privacidade do usuário e custo zero de infraestrutura para você.',
        steps: [
          'Descompacte o arquivo .zip no seu computador.',
          'Copie os arquivos (model.json e *.bin ou model.onnx) para a pasta /public/models/.',
          'No seu componente React, chame a função de carregamento dentro de um useEffect().',
          'Passe elementos HTML de imagem ou o feed da webcam (<video>) para o método .predict().',
        ],
      };
    }

    if (platform === 'mobile' || fileType === 'tflite') {
      return {
        title: 'App Mobile Nativo com TensorFlow Lite (Android & iOS)',
        difficulty: 'Intermediário',
        approach: 'Embutir nos assets do aplicativo mobile',
        libraries: ['react-native-fast-tflite (React Native)', 'tflite_flutter (Flutter)'],
        explanation: 'Modelos .tflite são otimizados para chips neurais de smartphones (NPU / GPU). Eles rodam offline a 60 FPS com baixíssimo consumo de bateria.',
        steps: [
          'Extraia o arquivo .tflite de dentro da pasta zipada.',
          'No React Native/Expo, adicione à pasta assets/ e configure o metro.config.js para aceitar a extensão .tflite.',
          'Use aceleração de hardware (GPU Delegate ou CoreML no iOS / NNAPI no Android).',
        ],
      };
    }

    // Heavy model or PyTorch/Backend
    return {
      title: 'Arquitetura com API de Inferência (Backend Python + Frontend React)',
      difficulty: 'Intermediário',
      approach: 'Descompactar no servidor e expor API REST (FastAPI)',
      libraries: ['fastapi', 'uvicorn', 'torch', 'torchvision', 'pillow'],
      explanation: 'Modelos PyTorch (.pt, .pth) ou Scikit-learn (.pkl) necessitam do ecossistema Python para executar. O frontend do seu app (React) envia a foto ou os dados via POST /predict e recebe o resultado JSON.',
      steps: [
        'Coloque o arquivo .zip no servidor backend ou descompacte durante o build do Docker.',
        'Carregue os pesos na inicialização da aplicação para não recarregar a cada requisição.',
        'Crie uma rota POST /predict usando FastAPI que recebe o arquivo ou imagem.',
        'No seu app React, faça um simples fetch("https://sua-api.com/predict", { method: "POST", body: formData }).',
      ],
    };
  };

  const rec = getRecommendation();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Assistente Decisório: Como integrar o seu arquivo ZIP
          </h3>
        </div>
        <span className="text-xs text-slate-400">Guia interativo</span>
      </div>

      <div className="p-5 space-y-6">
        {/* Step 1: Platform */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            1. Onde você quer que o aplicativo rode principalmente?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setPlatform('web')}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                platform === 'web'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-medium">Navegador Web</div>
                <div className="text-[10px] text-slate-400">React, Next.js, Vue, HTML</div>
              </div>
            </button>

            <button
              onClick={() => setPlatform('mobile')}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                platform === 'mobile'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-medium">Celular / Tablet</div>
                <div className="text-[10px] text-slate-400">React Native, Flutter, iOS/Android</div>
              </div>
            </button>

            <button
              onClick={() => setPlatform('backend')}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                platform === 'backend'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <Server className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-medium">API / Servidor</div>
                <div className="text-[10px] text-slate-400">Python, FastAPI, Node, Docker</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Model Files in Zip */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            2. Que arquivos estão dentro da sua pasta ZIP?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'tfjs', label: 'model.json + .bin', desc: 'TensorFlow.js / Teachable Machine' },
              { id: 'onnx', label: '.onnx', desc: 'ONNX Runtime universal' },
              { id: 'tflite', label: '.tflite', desc: 'TensorFlow Lite mobile' },
              { id: 'pytorch', label: '.pt / .pth / .pkl', desc: 'PyTorch / Scikit-learn' },
              { id: 'model3d', label: '.gltf / .obj / .fbx', desc: 'Modelo Tridimensional 3D' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFileType(item.id as any)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  fileType === item.id
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-mono font-medium text-cyan-300">{item.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
            <div>
              <span className="text-[11px] text-cyan-400 font-semibold tracking-wide uppercase">
                Caminho Recomendado para o seu Caso
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{rec.title}</h4>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Abordagem:</span>
              <span className="text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                {rec.approach}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{rec.explanation}</p>

          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-slate-200">Passos práticos de implementação:</span>
            <ol className="space-y-1.5 text-xs text-slate-300">
              {rec.steps.map((st, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Pacotes recomendados:</span>
            {rec.libraries.map((lib) => (
              <code key={lib} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">
                {lib}
              </code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

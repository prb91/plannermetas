import React, { useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle2, Play, Sparkles, AlertCircle } from 'lucide-react';

interface VisionModelTesterProps {
  modelName?: string;
  labels?: string[];
}

const PRESET_TEST_IMAGES = [
  {
    name: 'Gato Siamês',
    emoji: '🐱',
    expectedClass: 'Gato 🐱',
    confidence: 0.94,
    description: 'Imagem de teste com características felinas claras',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    name: 'Cachorro Golden',
    emoji: '🐶',
    expectedClass: 'Cachorro 🐶',
    confidence: 0.92,
    description: 'Imagem de teste canina',
    color: 'from-amber-600/20 to-yellow-500/20',
  },
  {
    name: 'Pássaro Tucano',
    emoji: '🐦',
    expectedClass: 'Pássaro 🐦',
    confidence: 0.89,
    description: 'Imagem com plumagem e bico evidente',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    name: 'Caixa de Encomenda',
    emoji: '📦',
    expectedClass: 'Objeto Desconhecido 📦',
    confidence: 0.87,
    description: 'Objeto inanimado',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
];

export const VisionModelTester: React.FC<VisionModelTesterProps> = ({
  modelName = 'Classificador Teachable Machine',
  labels = ['Gato 🐱', 'Cachorro 🐶', 'Pássaro 🐦', 'Objeto Desconhecido 📦'],
}) => {
  const [selectedImage, setSelectedImage] = useState(PRESET_TEST_IMAGES[0]);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);
  const [predictionResults, setPredictionResults] = useState<Array<{ label: string; prob: number }>>([
    { label: 'Gato 🐱', prob: 0.94 },
    { label: 'Cachorro 🐶', prob: 0.04 },
    { label: 'Pássaro 🐦', prob: 0.01 },
    { label: 'Objeto Desconhecido 📦', prob: 0.01 },
  ]);

  const runSimulatedInference = (targetClass: string, highConfidence = 0.93) => {
    setIsClassifying(true);
    setTimeout(() => {
      const remainingProb = 1 - highConfidence;
      const otherClasses = labels.filter((l) => l !== targetClass);
      const otherCount = Math.max(1, otherClasses.length);

      const results = labels.map((l) => {
        if (l === targetClass) {
          return { label: l, prob: highConfidence };
        }
        return {
          label: l,
          prob: parseFloat((remainingProb / otherCount + (Math.random() * 0.02 - 0.01)).toFixed(3)),
        };
      });

      // Sort by highest probability
      results.sort((a, b) => b.prob - a.prob);
      setPredictionResults(results);
      setIsClassifying(false);
    }, 450);
  };

  const handleSelectPreset = (preset: (typeof PRESET_TEST_IMAGES)[0]) => {
    setSelectedImage(preset);
    setUserUploadedImage(null);
    runSimulatedInference(preset.expectedClass, preset.confidence);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserUploadedImage(event.target.result as string);
          // Pick a random class with high probability for demo
          const randomClass = labels[Math.floor(Math.random() * labels.length)] || labels[0];
          runSimulatedInference(randomClass, 0.88);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Simulador de Inferência do Modelo</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{modelName}</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          {labels.length} classes detectadas
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Input Selection */}
        <div className="md:col-span-6 space-y-3">
          <div className="text-xs font-semibold text-slate-300">1. Selecione uma Amostra de Teste</div>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_TEST_IMAGES.map((preset) => {
              const isSelected = !userUploadedImage && selectedImage.name === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 shadow-sm'
                      : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="text-3xl mb-1">{preset.emoji}</span>
                  <span className="text-xs font-medium text-slate-200">{preset.name}</span>
                  <span className="text-[10px] text-slate-500">{preset.description}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-800/40 text-xs text-slate-300 cursor-pointer transition-colors">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Ou envie sua própria foto (.png, .jpg)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {userUploadedImage && (
            <div className="relative rounded-lg overflow-hidden border border-cyan-500/40 max-h-36 flex items-center justify-center bg-black/40">
              <img
                src={userUploadedImage}
                alt="Upload do usuário"
                className="max-h-36 object-contain"
              />
              <span className="absolute bottom-1 right-2 text-[10px] bg-slate-900/90 text-cyan-300 px-1.5 py-0.5 rounded">
                Foto personalizada
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Probabilities & Predictions */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">2. Classificação em Tempo Real</span>
            {isClassifying && (
              <span className="text-[11px] text-cyan-400 animate-pulse flex items-center gap-1 font-mono">
                <Play className="w-3 h-3" /> Processando tensores...
              </span>
            )}
          </div>

          <div className="space-y-2.5 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            {predictionResults.map((item, idx) => {
              const isTop = idx === 0;
              const percentage = Math.round(item.prob * 100);

              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium flex items-center gap-1.5 ${isTop ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}>
                      {isTop && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      {item.label}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-slate-300 font-semibold">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isTop
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg p-2.5 bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              No código real do seu app, este mesmo resultado é obtido em ~15 milissegundos chamando <code className="text-cyan-300 font-mono">model.predict(imageElement)</code> diretamente no navegador com WebGL acelerado por hardware!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

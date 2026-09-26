import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: '1. Preciso extrair o arquivo .zip antes ou o próprio aplicativo pode descompactar?',
    answer: 'As duas formas são válidas! Se o modelo faz parte do seu app fixo (ex: você treinou no Teachable Machine), a melhor prática é descompactar uma vez no seu computador e mover os arquivos para a pasta public/models/. Isso economiza memória do usuário e permite cache automático do navegador. Mas se o seu app permite que o usuário envie seus próprios modelos compactados, você pode usar a biblioteca JSZip para descompactar os dados diretamente na memória RAM.',
  },
  {
    question: '2. O modelo roda sem internet (offline)?',
    answer: 'Sim! Uma vez que o aplicativo React ou PWA tiver baixado os arquivos do modelo para o navegador do usuário, o TensorFlow.js ou ONNX Runtime executam 100% offline nos chips gráficos (GPU/WebGL) do próprio dispositivo. Nenhuma foto ou dado precisa ser enviado para a nuvem.',
  },
  {
    question: '3. Como carregar a webcam no React para enviar ao modelo?',
    answer: 'Basta usar a API padrão navigator.mediaDevices.getUserMedia({ video: true }) apontando para uma tag <video ref={videoRef} autoPlay playsInline />. As bibliotecas como @teachablemachine/image ou @tensorflow/tfjs aceitam o elemento HTMLVideoElement diretamente no método model.predict(videoRef.current).',
  },
  {
    question: '4. Posso rodar qualquer modelo no navegador ou há limitações de tamanho?',
    answer: 'Modelos de até ~100 MB (MobileNet, ResNet18, YOLOv8 nano, Teachable Machine) rodam com alta performance no navegador. Modelos muito pesados (ex: Whisper de 1.5 GB ou LLaMA/Stable Diffusion de 4+ GB) demandam muita memória RAM do usuário. Nesses casos, o padrão da indústria é descompactar o arquivo .zip em uma API de backend em Python (FastAPI/Flask) e consumir via HTTP.',
  },
  {
    question: '5. O que fazer se o modelo estiver em formato PyTorch (.pt ou .pth) e eu quiser rodar no navegador?',
    answer: 'Você pode converter o modelo PyTorch para o formato universal ONNX usando torch.onnx.export(model, dummy_input, "modelo.onnx"). Com o arquivo .onnx gerado, você pode executá-lo diretamente no frontend com o pacote onnxruntime-web via WebAssembly!',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Perguntas Frequentes & Melhores Práticas
        </h2>
      </div>

      <div className="space-y-2">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

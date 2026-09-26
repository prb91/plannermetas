import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal, Layers, Smartphone } from 'lucide-react';
import { ModelCategory } from '../types/model';

interface CodeSnippetsProps {
  category: ModelCategory;
  modelTitle: string;
  filesList: string[];
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = ({
  category,
  modelTitle,
  filesList,
}) => {
  const [activeTab, setActiveTab] = useState<'public_dir' | 'in_memory_zip' | 'backend_python' | 'mobile'>('public_dir');
  const [copied, setCopied] = useState<boolean>(false);

  const getCodeContent = () => {
    switch (activeTab) {
      case 'public_dir':
        if (category === 'teachable_machine') {
          return `// 1. Instale o pacote:
// npm install @teachablemachine/image @tensorflow/tfjs

import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

export function TeachableMachineDetector() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function loadModel() {
      // Dica: Extraia o seu .zip dentro de /public/models/
      // O Vite/Next.js servirá esses arquivos automaticamente!
      const modelURL = '/models/model.json';
      const metadataURL = '/models/metadata.json';
      
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      console.log('Modelo carregado com sucesso!');
    }
    loadModel();
  }, []);

  const handleClassify = async () => {
    if (!model || !imageRef.current) return;
    const results = await model.predict(imageRef.current);
    setPredictions(results);
  };

  return (
    <div>
      <img ref={imageRef} src="/exemplo.jpg" alt="Teste" crossOrigin="anonymous" />
      <button onClick={handleClassify}>Classificar Imagem</button>
      <ul>
        {predictions.map((p) => (
          <li key={p.className}>
            {p.className}: {(p.probability * 100).toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
}`;
        } else if (category === 'model_3d') {
          return `// 1. Instale o Three.js:
// npm install three @types/three

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Se for GLTF/GLB:
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// Se for OBJ:
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export function Model3DViewer() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Cenário Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 300);
    canvasRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(2, 2, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Carregar o modelo descompactado da pasta public/
    const loader = new GLTFLoader();
    loader.load('/models/meu-objeto.gltf', (gltf) => {
      scene.add(gltf.scene);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={canvasRef} />;
}`;
        } else if (category === 'onnx') {
          return `// 1. Instale o runtime ONNX Web:
// npm install onnxruntime-web

import React, { useEffect, useState } from 'react';
import * as ort from 'onnxruntime-web';

export function OnnxRunner() {
  const [session, setSession] = useState<ort.InferenceSession | null>(null);

  useEffect(() => {
    async function initOnnx() {
      // Coloque o arquivo .onnx na pasta /public/models/
      const ses = await ort.InferenceSession.create('/models/model.onnx', {
        executionProviders: ['wasm', 'webgl'], // aceleração por hardware
      });
      setSession(ses);
    }
    initOnnx();
  }, []);

  const runModel = async () => {
    if (!session) return;
    // Exemplo: tensor com formato de entrada [1, 3, 224, 224]
    const dummyData = new Float32Array(1 * 3 * 224 * 224);
    const tensor = new ort.Tensor('float32', dummyData, [1, 3, 224, 224]);
    
    const feeds = { [session.inputNames[0]]: tensor };
    const results = await session.run(feeds);
    console.log('Saída do modelo ONNX:', results);
  };

  return <button onClick={runModel}>Executar Inferência ONNX</button>;
}`;
        } else {
          return `// 1. Instale o TensorFlow.js:
// npm install @tensorflow/tfjs

import * as tf from '@tensorflow/tfjs';

async function carregarModelo() {
  // 1. Extraia o ZIP para public/models/
  // 2. O arquivo model.json e os arquivos .bin devem estar na mesma pasta
  const model = await tf.loadLayersModel('/models/model.json');
  console.log('Estrutura da rede neural:');
  model.summary();

  // Testar inferência com tensor dummy:
  const input = tf.zeros([1, 10]); // ajuste com o formato de entrada do seu modelo
  const output = model.predict(input) as tf.Tensor;
  output.print();
}

carregarModelo();`;
        }

      case 'in_memory_zip':
        return `// Descompactar o arquivo .ZIP DINAMICAMENTE no navegador sem salvar em disco!
// npm install jszip

import JSZip from 'jszip';

/**
 * Lê um arquivo .zip recebido (ex: por <input type="file"> ou fetch)
 * e carrega os arquivos do modelo diretamente na memória RAM.
 */
export async function carregarModeloDiretoDoZip(zipFileOrBlob: File | Blob) {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(zipFileOrBlob);

  console.log('Arquivos encontrados no ZIP:');
  unzipped.forEach((relativePath, file) => {
    console.log(relativePath, file.dir ? '(pasta)' : '(arquivo)');
  });

  // 1. Ler o JSON de metadados ou configuração
  const modelJsonFile = unzipped.file('model.json') || unzipped.file(/model\\.json$/i)[0];
  if (!modelJsonFile) {
    throw new Error('Arquivo model.json não encontrado no ZIP');
  }

  const modelJsonText = await modelJsonFile.async('text');
  const modelConfig = JSON.parse(modelJsonText);

  // 2. Ler os pesos binários (.bin)
  const weightsFile = unzipped.file('weights.bin') || unzipped.file(/\\.bin$/i)[0];
  let weightsBuffer: ArrayBuffer | null = null;
  if (weightsFile) {
    weightsBuffer = await weightsFile.async('arraybuffer');
  }

  console.log('Modelo extraído na memória:', {
    config: modelConfig,
    weightsSize: weightsBuffer?.byteLength || 0,
  });

  return { modelConfig, weightsBuffer };
}`;

      case 'backend_python':
        return `# Se o seu modelo for PyTorch (.pt/.pth) ou Scikit-Learn (.pkl),
# o melhor caminho é criar uma API rápida em Python com FastAPI:

# pip install fastapi uvicorn torch torchvision pillow python-multipart

from fastapi import FastAPI, UploadFile, File
import zipfile
import torch
import os
from io import BytesIO

app = FastAPI(title="API do Modelo")

# Opção 1: Descompactar o arquivo ZIP na inicialização
def inicializar_modelo():
    caminho_zip = "meu_modelo.zip"
    if os.path.exists(caminho_zip):
        with zipfile.ZipFile(caminho_zip, 'r') as zip_ref:
            zip_ref.extractall("modelo_extraido/")
            print("Modelo ZIP descompactado com sucesso!")
            
    # Carregar modelo PyTorch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = torch.load("modelo_extraido/model_weights.pt", map_location=device)
    model.eval()
    return model

modelo = inicializar_modelo()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Ler imagem enviada pelo app React/Frontend
    contents = await file.read()
    # Processar inferência...
    return {
        "status": "sucesso",
        "resultado": "classe_predita",
        "confianca": 0.95
    }

# Execute com: uvicorn main:app --reload --port 8000`;

      case 'mobile':
        return `// Para aplicativos React Native / Expo ou Flutter:
// 1. Coloque os arquivos descompactados dentro da pasta 'assets/models/'
// 2. No app.json / metro.config.js, garanta que extensões como .bin e .json sejam suportadas:

// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('bin', 'tflite', 'onnx');
module.exports = config;

// Exemplo usando TensorFlow Lite no React Native:
// npm install react-native-fast-tflite
import { useTensorflowModel } from 'react-native-fast-tflite';

export function MeuScannerMobile() {
  // Carrega o arquivo de modelo local
  const model = useTensorflowModel(require('./assets/models/model.tflite'));

  const executarInferência = (inputTensor) => {
    if (model.state === 'loaded') {
      const output = model.model.runSync([inputTensor]);
      console.log('Previsão mobile:', output);
    }
  };

  return <View>{/* Interface da câmera */}</View>;
}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
      {/* Tab Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('public_dir')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'public_dir'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Opção 1: Pasta public/ (Recomendado)</span>
          </button>

          <button
            onClick={() => setActiveTab('in_memory_zip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'in_memory_zip'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Opção 2: Descompactar via JSZip</span>
          </button>

          <button
            onClick={() => setActiveTab('backend_python')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'backend_python'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Opção 3: Backend Python (PyTorch/YOLO)</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Opção 4: Mobile (React Native)</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
        </button>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="p-4 text-xs font-mono text-slate-200 bg-slate-950 overflow-x-auto leading-relaxed max-h-96">
          <code>{getCodeContent()}</code>
        </pre>
      </div>

      {/* Explanatory note */}
      <div className="p-3 bg-slate-900 border-t border-slate-800/80 text-xs text-slate-400">
        <span className="text-cyan-400 font-semibold">Resumo prático:</span>{' '}
        {activeTab === 'public_dir' && 'A forma mais simples e profissional no React/Vite é descompactar o .zip uma vez no seu computador e mover a pasta para dentro de public/models/. Assim você carrega direto via URL sem consumir CPU para descompactar a cada acesso!'}
        {activeTab === 'in_memory_zip' && 'Se o usuário final do seu app precisa fazer upload de um arquivo .zip personalizado, a biblioteca JSZip permite descompactar os dados diretamente na memória RAM do navegador sem precisar de backend.'}
        {activeTab === 'backend_python' && 'Modelos gigantes (ex: Stable Diffusion, Whisper, LLMs, redes PyTorch complexas) não devem rodar no navegador. O arquivo .zip é colocado no servidor, descompactado na inicialização e o app chama via API REST.'}
        {activeTab === 'mobile' && 'No React Native ou Flutter, os arquivos do modelo são colocados na pasta de assets do projeto e incluídos no pacote de compilação (APK/IPA).'}
      </div>
    </div>
  );
};

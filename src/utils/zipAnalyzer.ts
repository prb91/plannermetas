import JSZip from 'jszip';
import { ModelDetectionResult, ZipAnalysis, ZipFileEntry } from '../types/model';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function analyzeZipBlob(blob: Blob | ArrayBuffer, fileName: string): Promise<ZipAnalysis> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(blob);

  const files: ZipFileEntry[] = [];
  const extractedTextFiles: Record<string, string> = {};
  let totalSize = 0;

  const fileKeys = Object.keys(loadedZip.files);

  for (const relativePath of fileKeys) {
    const fileObj = loadedZip.files[relativePath];
    const isDir = fileObj.dir;
    
    // JSZip internal size or estimated uncompressed size
    // @ts-expect-error internal uncompressed size
    const size = fileObj._data ? fileObj._data.uncompressedSize || 0 : 0;
    totalSize += size;

    const parts = relativePath.split('.');
    const extension = isDir ? '' : parts.length > 1 ? parts.pop()!.toLowerCase() : '';

    const entry: ZipFileEntry = {
      name: relativePath,
      size,
      formattedSize: formatBytes(size),
      isDir,
      extension,
    };

    // If it's a small JSON, metadata, or text file, let's preview its content
    if (!isDir && ['json', 'txt', 'csv', 'yaml', 'yml'].includes(extension) && size < 500_000) {
      try {
        const textContent = await fileObj.async('text');
        extractedTextFiles[relativePath] = textContent;
        entry.contentSnippet = textContent.slice(0, 300);
      } catch (err) {
        console.warn('Could not read text from', relativePath, err);
      }
    }

    files.push(entry);
  }

  // Sort files: directories first, then alphabetical
  files.sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.name.localeCompare(b.name);
  });

  // Detect model type based on contents
  const detection = detectModelType(files, extractedTextFiles);

  return {
    fileName,
    totalSize,
    formattedTotalSize: formatBytes(totalSize),
    fileCount: files.filter(f => !f.isDir).length,
    files,
    detection,
    extractedTextFiles,
  };
}

function detectModelType(
  files: ZipFileEntry[],
  extractedText: Record<string, string>
): ModelDetectionResult {
  const fileNames = files.map(f => f.name.toLowerCase());
  const baseNames = files.map(f => f.name.split('/').pop()?.toLowerCase() || '');

  // 1. Google Teachable Machine Check (model.json + metadata.json + weights.bin)
  const hasMetadataJson = baseNames.includes('metadata.json');
  const hasModelJson = baseNames.includes('model.json');
  const hasBinWeights = baseNames.some(n => n.endsWith('.bin') || n.includes('weights'));

  if (hasMetadataJson && hasModelJson) {
    let labels: string[] = [];
    let modelName = 'Modelo Teachable Machine';
    let rawJson: Record<string, unknown> | undefined;

    // Find metadata.json key
    const metaKey = Object.keys(extractedText).find(k => k.endsWith('metadata.json'));
    if (metaKey && extractedText[metaKey]) {
      try {
        const parsed = JSON.parse(extractedText[metaKey]);
        rawJson = parsed;
        if (parsed.modelName) modelName = parsed.modelName;
        if (Array.isArray(parsed.labels)) labels = parsed.labels;
      } catch {
        // ignore parse error
      }
    }

    const missingFiles: string[] = [];
    if (!hasBinWeights) missingFiles.push('weights.bin (pesos do modelo)');

    return {
      category: 'teachable_machine',
      title: 'Google Teachable Machine (TensorFlow.js)',
      description: 'Modelo de visão computacional ou áudio treinado no Teachable Machine do Google. Pronto para rodar 100% no navegador (Client-side) usando a biblioteca @teachablemachine/image ou @tensorflow/tfjs.',
      confidence: 'high',
      keyFilesFound: ['model.json', 'metadata.json', ...(hasBinWeights ? ['weights.bin'] : [])],
      missingFiles: missingFiles.length > 0 ? missingFiles : undefined,
      framework: 'TensorFlow.js / Teachable Machine',
      runtimeTarget: 'Navegador (Client-side)',
      metadata: {
        modelName,
        labels,
        rawJson,
      },
      recommendation: 'Extraia os arquivos para a pasta public/models/ do seu projeto web ou carregue diretamente via JSZip na memória.',
    };
  }

  // 2. TensorFlow.js standard model (model.json + shard*.bin)
  if (hasModelJson && hasBinWeights) {
    let inputShape: string | undefined;
    const modelKey = Object.keys(extractedText).find(k => k.endsWith('model.json'));
    if (modelKey && extractedText[modelKey]) {
      try {
        const parsed = JSON.parse(extractedText[modelKey]);
        if (parsed.modelTopology?.model_config?.config?.layers?.[0]?.config?.batch_input_shape) {
          inputShape = JSON.stringify(parsed.modelTopology.model_config.config.layers[0].config.batch_input_shape);
        }
      } catch {
        // ignore
      }
    }

    return {
      category: 'tensorflow_js',
      title: 'TensorFlow.js Layers / Graph Model',
      description: 'Modelo convertido do Keras/TensorFlow para execução direta no navegador via WebGL / WebGPU com tfjs.',
      confidence: 'high',
      keyFilesFound: ['model.json', 'pesos binários (.bin)'],
      framework: 'TensorFlow.js (@tensorflow/tfjs)',
      runtimeTarget: 'Navegador (Client-side)',
      metadata: {
        inputShape,
      },
      recommendation: 'Coloque a pasta descompactada em /public/ e chame tf.loadLayersModel("/models/model.json").',
    };
  }

  // 3. ONNX Model
  const onnxFile = baseNames.find(n => n.endsWith('.onnx'));
  if (onnxFile) {
    return {
      category: 'onnx',
      title: 'Modelo ONNX (Open Neural Network Exchange)',
      description: 'Formato interoperável universal. Pode ser executado no navegador via onnxruntime-web (WebAssembly/WebGPU) ou no backend Python via onnxruntime.',
      confidence: 'high',
      keyFilesFound: [onnxFile],
      framework: 'ONNX Runtime (Web ou Python)',
      runtimeTarget: 'Navegador ou Servidor',
      recommendation: 'Use onnxruntime-web para rodar direto no navegador ou onnxruntime em Python no backend.',
    };
  }

  // 4. TensorFlow Lite (.tflite)
  const tfliteFile = baseNames.find(n => n.endsWith('.tflite'));
  if (tfliteFile) {
    return {
      category: 'tflite',
      title: 'TensorFlow Lite (.tflite)',
      description: 'Modelo otimizado para dispositivos móveis (Android / iOS) e microcontroladores, também suportado no navegador via MediaPipe ou TFLite Web.',
      confidence: 'high',
      keyFilesFound: [tfliteFile],
      framework: 'TensorFlow Lite / MediaPipe',
      runtimeTarget: 'Mobile ou Navegador',
      recommendation: 'Ideal para apps React Native, Flutter, Kotlin ou web via MediaPipe Tasks.',
    };
  }

  // 5. 3D Model files (.gltf, .glb, .obj, .fbx, .stl)
  const hasGltf = baseNames.some(n => n.endsWith('.gltf') || n.endsWith('.glb'));
  const hasObj = baseNames.some(n => n.endsWith('.obj'));
  const hasFbx = baseNames.some(n => n.endsWith('.fbx'));
  const hasStl = baseNames.some(n => n.endsWith('.stl'));

  if (hasGltf || hasObj || hasFbx || hasStl) {
    const formatName = hasGltf ? 'glTF / GLB' : hasObj ? 'Wavefront OBJ' : hasFbx ? 'Autodesk FBX' : 'STL';
    const found3DFiles = baseNames.filter(n => 
      n.endsWith('.gltf') || n.endsWith('.glb') || n.endsWith('.obj') || 
      n.endsWith('.mtl') || n.endsWith('.fbx') || n.endsWith('.png') || n.endsWith('.jpg')
    );

    return {
      category: 'model_3d',
      title: `Modelo 3D (${formatName})`,
      description: 'Arquivo de modelo tridimensional com malha poligonal, materiais e texturas. Pronto para visualização interativa 3D usando Three.js / React Three Fiber.',
      confidence: 'high',
      keyFilesFound: found3DFiles.slice(0, 5),
      framework: 'Three.js / WebGL / Babylon.js',
      runtimeTarget: 'Visualizador 3D (WebGL)',
      recommendation: 'Extraia os arquivos para a pasta public/assets/3d/ e carregue via GLTFLoader ou OBJLoader do Three.js.',
    };
  }

  // 6. PyTorch weights (.pt, .pth, weights.pt)
  const ptFile = baseNames.find(n => n.endsWith('.pt') || n.endsWith('.pth'));
  if (ptFile) {
    return {
      category: 'pytorch',
      title: 'Modelo PyTorch (.pt / .pth)',
      description: 'Pesos ou modelo serializado em PyTorch (muito comum em redes neurais de visão, YOLO, NLP). Normalmente requer um backend Python (FastAPI/Flask) ou conversão prévia para ONNX.',
      confidence: 'high',
      keyFilesFound: [ptFile],
      framework: 'PyTorch (Python)',
      runtimeTarget: 'Servidor (Python/Node)',
      recommendation: 'Descompacte no servidor backend em Python com torch.load() ou converta para ONNX para rodar no frontend.',
    };
  }

  // 7. Scikit-learn / Pickle (.pkl, .joblib)
  const pklFile = baseNames.find(n => n.endsWith('.pkl') || n.endsWith('.joblib') || n.endsWith('.pickle'));
  if (pklFile) {
    return {
      category: 'scikit_learn',
      title: 'Modelo Scikit-Learn / Pickle (.pkl)',
      description: 'Modelo tradicional de machine learning (Regressão, Random Forest, SVM) serializado em Python. Deve ser executado em uma API backend Python.',
      confidence: 'high',
      keyFilesFound: [pklFile],
      framework: 'Scikit-Learn / Joblib (Python)',
      runtimeTarget: 'Servidor (Python/Node)',
      recommendation: 'Hospede em uma API FastAPI com joblib.load("modelo.pkl") e crie um endpoint POST /predict para seu app.',
    };
  }

  // Fallback: generic archive
  return {
    category: 'generic_archive',
    title: 'Arquivo ZIP Genérico / Modelo Desconhecido',
    description: 'O arquivo contém arquivos compactados, mas não possui extensões de modelo padrão reconhecidas automaticamente.',
    confidence: 'low',
    keyFilesFound: baseNames.slice(0, 4),
    framework: 'A definir',
    runtimeTarget: 'Navegador (Client-side)',
    recommendation: 'Verifique se os arquivos foram exportados com a extensão correta (ex: .json, .onnx, .tflite, .gltf, .pt).',
  };
}

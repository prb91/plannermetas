export type ModelCategory = 
  | 'teachable_machine'
  | 'tensorflow_js'
  | 'onnx'
  | 'tflite'
  | 'pytorch'
  | 'scikit_learn'
  | 'model_3d'
  | 'generic_archive';

export interface ZipFileEntry {
  name: string;
  size: number;
  formattedSize: string;
  isDir: boolean;
  extension: string;
  contentSnippet?: string;
}

export interface ModelDetectionResult {
  category: ModelCategory;
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  keyFilesFound: string[];
  missingFiles?: string[];
  framework: string;
  runtimeTarget: 
    | 'Navegador (Client-side)' 
    | 'Servidor (Python/Node)' 
    | 'Mobile (App nativo)' 
    | 'Visualizador 3D (WebGL)'
    | 'Navegador ou Servidor'
    | 'Mobile ou Navegador';
  metadata?: {
    modelName?: string;
    labels?: string[];
    inputShape?: string | number[];
    dateCreated?: string;
    version?: string;
    rawJson?: Record<string, unknown>;
  };
  recommendation: string;
}

export interface ZipAnalysis {
  fileName: string;
  totalSize: number;
  formattedTotalSize: string;
  fileCount: number;
  files: ZipFileEntry[];
  detection: ModelDetectionResult;
  extractedTextFiles: Record<string, string>;
}

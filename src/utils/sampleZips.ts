import JSZip from 'jszip';

export async function createTeachableMachineSampleZip(): Promise<Blob> {
  const zip = new JSZip();

  const metadata = {
    tfjsVersion: '1.3.1',
    tmVersion: '2.4.7',
    packageVersion: '0.8.4-alpha.2',
    packageName: '@teachablemachine/image',
    timeStamp: new Date().toISOString(),
    userMetadata: {},
    modelName: 'Classificador de Animais & Objetos',
    labels: ['Gato 🐱', 'Cachorro 🐶', 'Pássaro 🐦', 'Objeto Desconhecido 📦'],
    imageSize: 224
  };

  const modelTopology = {
    format: 'layers-model',
    generatedBy: 'keras v2.2.4',
    convertedBy: 'TensorFlow.js Converter v1.3.1',
    modelTopology: {
      keras_version: '2.2.4',
      backend: 'tensorflow',
      model_config: {
        class_name: 'Sequential',
        config: {
          name: 'sequential_1',
          layers: [
            {
              class_name: 'Dense',
              config: {
                name: 'dense_1',
                units: 100,
                activation: 'relu',
                batch_input_shape: [null, 1280]
              }
            },
            {
              class_name: 'Dense',
              config: {
                name: 'output_layer',
                units: 4,
                activation: 'softmax'
              }
            }
          ]
        }
      }
    },
    weightsManifest: [
      {
        paths: ['./weights.bin'],
        weights: [
          {
            name: 'dense_1/kernel',
            shape: [1280, 100],
            dtype: 'float32'
          },
          {
            name: 'dense_1/bias',
            shape: [100],
            dtype: 'float32'
          },
          {
            name: 'output_layer/kernel',
            shape: [100, 4],
            dtype: 'float32'
          },
          {
            name: 'output_layer/bias',
            shape: [4],
            dtype: 'float32'
          }
        ]
      }
    ]
  };

  // Create fake binary weights (Float32Array)
  const floatWeights = new Float32Array(1280 * 100 + 100 + 100 * 4 + 4);
  for (let i = 0; i < floatWeights.length; i++) {
    floatWeights[i] = (Math.random() - 0.5) * 0.05;
  }

  zip.file('model.json', JSON.stringify(modelTopology, null, 2));
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  zip.file('weights.bin', floatWeights.buffer);
  zip.file('README.txt', 'Modelo treinado no Teachable Machine do Google.\nExporte para o seu app React ou Web.');

  return await zip.generateAsync({ type: 'blob' });
}

export async function create3DModelSampleZip(): Promise<Blob> {
  const zip = new JSZip();

  // Simple clean Wavefront OBJ polyhedron / diamond mesh
  const objContent = `# Wavefront OBJ generated for 3D Model Lab
mtllib material.mtl
o DiamondCrystal
v 0.0000 1.0000 0.0000
v -0.7071 0.0000 0.7071
v 0.7071 0.0000 0.7071
v 0.7071 0.0000 -0.7071
v -0.7071 0.0000 -0.7071
v 0.0000 -1.0000 0.0000
vn 0.0 1.0 0.0
vn 0.0 -1.0 0.0
vn 0.0 0.0 1.0
vn 1.0 0.0 0.0
vn 0.0 0.0 -1.0
vn -1.0 0.0 0.0
s 1
usemtl CrystalGlass
f 1//1 2//3 3//3
f 1//1 3//4 4//4
f 1//1 4//5 5//5
f 1//1 5//6 2//6
f 6//2 3//3 2//3
f 6//2 4//4 3//4
f 6//2 5//5 4//5
f 6//2 2//6 5//6
`;

  const mtlContent = `# Material definition
newmtl CrystalGlass
Ns 250.0000
Ka 1.0000 1.0000 1.0000
Kd 0.1000 0.8000 0.9000
Ks 0.9000 0.9000 0.9000
d 0.85
illum 2
`;

  zip.file('model_crystal.obj', objContent);
  zip.file('material.mtl', mtlContent);
  zip.file('info.json', JSON.stringify({
    name: 'Prisma de Cristal 3D',
    vertices: 6,
    faces: 8,
    author: '3D Asset Lab',
    license: 'CC-BY-4.0'
  }, null, 2));

  return await zip.generateAsync({ type: 'blob' });
}

export async function createPyTorchBundleSampleZip(): Promise<Blob> {
  const zip = new JSZip();

  const configYaml = `model:
  architecture: "resnet50"
  num_classes: 10
  pretrained: true
training:
  epochs: 50
  batch_size: 32
  optimizer: "AdamW"
  learning_rate: 0.0001
export_options:
  onnx_compatible: true
`;

  const classesTxt = `aviao
automovel
passaro
gato
cervo
cao
sapo
cavalo
navio
caminhao
`;

  const inferencePy = `import torch
import torchvision.transforms as transforms
from PIL import Image

# Pipeline de inferência com o modelo descompactado
def run_inference(image_path, model_path="model_weights.pt"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = torch.load(model_path, map_location=device)
    model.eval()
    
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        
    return probabilities.tolist()
`;

  // Create a dummy binary for weights
  const dummyWeights = new Uint8Array(4096);
  for (let i = 0; i < dummyWeights.length; i++) {
    dummyWeights[i] = (i * 37) % 256;
  }

  zip.file('model_weights.pt', dummyWeights.buffer);
  zip.file('classes.txt', classesTxt);
  zip.file('config.yaml', configYaml);
  zip.file('inference.py', inferencePy);

  return await zip.generateAsync({ type: 'blob' });
}

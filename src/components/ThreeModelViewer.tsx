import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Box, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreeModelViewerProps {
  fileName?: string;
  objSnippet?: string;
}

export const ThreeModelViewer: React.FC<ThreeModelViewerProps> = ({ fileName = 'Modelo 3D', objSnippet }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [meshColor, setMeshColor] = useState<string>('#06b6d4');
  const [geometryType, setGeometryType] = useState<'crystal' | 'torus' | 'octahedron'>('crystal');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = 320;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.0);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    // Grid Floor
    const grid = new THREE.GridHelper(6, 12, 0x334155, 0x1e293b);
    grid.position.y = -1.6;
    scene.add(grid);

    // Build geometry based on selection
    function createGeo(type: string) {
      if (type === 'torus') {
        return new THREE.TorusKnotGeometry(0.8, 0.28, 100, 16);
      } else if (type === 'octahedron') {
        return new THREE.OctahedronGeometry(1.2, 1);
      } else {
        // Octahedron / crystal shape
        return new THREE.ConeGeometry(1.1, 2.2, 6);
      }
    }

    const geometry = createGeo(geometryType);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(meshColor),
      metalness: 0.15,
      roughness: 0.2,
      transmission: 0.2,
      thickness: 1.2,
      wireframe,
      clearcoat: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Animation Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (meshRef.current && autoRotate && !isDraggingRef.current) {
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.x += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [geometryType]);

  // Update material properties when state changes
  useEffect(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.wireframe = wireframe;
    mat.color.set(meshColor);
    mat.needsUpdate = true;
  }, [wireframe, meshColor]);

  // Mouse interaction for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !meshRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    meshRef.current.rotation.y += deltaX * 0.01;
    meshRef.current.rotation.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const step = direction === 'in' ? -0.5 : 0.5;
    cameraRef.current.position.z = Math.max(2, Math.min(8, cameraRef.current.position.z + step));
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
      {/* 3D Canvas Header Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Box className="w-4 h-4 text-cyan-400" />
          <span>Renderizador WebGL / Three.js</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{fileName}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Shape selector */}
          <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => setGeometryType('crystal')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                geometryType === 'crystal' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cristal
            </button>
            <button
              onClick={() => setGeometryType('torus')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                geometryType === 'torus' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Torus
            </button>
            <button
              onClick={() => setGeometryType('octahedron')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                geometryType === 'octahedron' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Poliedro
            </button>
          </div>

          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
              wireframe
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Wireframe</span>
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
              autoRotate
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            <span>Giro</span>
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleZoom('in')}
              className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              title="Aproximar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              title="Afastar"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-80 relative cursor-grab active:cursor-grabbing bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center"
      >
        <span className="absolute bottom-2 left-3 text-[11px] text-slate-500 pointer-events-none select-none">
          Arraste com o mouse para girar o objeto 3D
        </span>
      </div>

      {/* Color Swatches & Status */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Cor do Material:</span>
          {['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
            <button
              key={c}
              onClick={() => setMeshColor(c)}
              className={`w-4 h-4 rounded-full transition-transform ${
                meshColor === c ? 'scale-125 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="text-slate-500 font-mono text-[11px]">
          Pronto para Three.js GLTFLoader / OBJLoader
        </div>
      </div>
    </div>
  );
};

import { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ParticleGroup {
  mesh: THREE.Points;
  initialRotation: THREE.Euler;
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
  pulseFactor: number;
  pulseSpeed: number;
  pulseOffset: number;
}

const ParticleBackground: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particleGroupsRef = useRef<ParticleGroup[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Track dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Handle mouse movement for interactive particles
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Main Three.js setup and animation
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create multiple particle groups
    createParticleGroups();
    
    // Start animation loop
    startAnimationLoop();
    
    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Clean up all THREE.js objects
      particleGroupsRef.current.forEach(group => {
        if (group.mesh.geometry) {
          group.mesh.geometry.dispose();
        }
        if (group.mesh.material) {
          (group.mesh.material as THREE.Material).dispose();
        }
        if (sceneRef.current) {
          sceneRef.current.remove(group.mesh);
        }
      });
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Update particle colors when dark mode changes
  useEffect(() => {
    if (!particleGroupsRef.current.length) return;
    
    // Update particle colors based on theme
    particleGroupsRef.current.forEach((group, index) => {
      const material = group.mesh.material as THREE.PointsMaterial;
      
      if (isDarkMode) {
        // Colors for dark mode
        if (index === 0) {
          material.color.set(0x3b82f6); // Blue
        } else if (index === 1) {
          material.color.set(0xf97316); // Orange
        } else {
          material.color.set(0x4f46e5); // Indigo
        }
      } else {
        // Colors for light mode
        if (index === 0) {
          material.color.set(0x1e40af); // Darker blue
        } else if (index === 1) {
          material.color.set(0xea580c); // Darker orange
        } else {
          material.color.set(0x3730a3); // Darker indigo
        }
      }
    });
  }, [isDarkMode]);

  const createParticleGroups = () => {
    // Main background particles (small and numerous)
    createParticleGroup({
      count: window.innerWidth < 768 ? 1000 : 1500,
      size: 0.02,
      color: isDarkMode ? 0x3b82f6 : 0x1e40af, // Blue
      opacity: 0.6,
      range: 15,
      rotationSpeed: { x: 0.0001, y: 0.0001, z: 0.00005 },
      pulseFactor: 0.1,
      pulseSpeed: 0.4,
      pulseOffset: 0
    });
    
    // Secondary layer with different movement (medium sized)
    createParticleGroup({
      count: window.innerWidth < 768 ? 300 : 500,
      size: 0.04,
      color: isDarkMode ? 0xf97316 : 0xea580c, // Orange
      opacity: 0.4,
      range: 10,
      rotationSpeed: { x: 0.0002, y: -0.0003, z: 0.0001 },
      pulseFactor: 0.15,
      pulseSpeed: 0.3,
      pulseOffset: Math.PI / 2
    });
    
    // Distant background stars (tiny and sparse)
    createParticleGroup({
      count: window.innerWidth < 768 ? 200 : 300,
      size: 0.01,
      color: isDarkMode ? 0x4f46e5 : 0x3730a3, // Indigo
      opacity: 0.3,
      range: 18,
      rotationSpeed: { x: 0.00005, y: 0.00005, z: 0.00005 },
      pulseFactor: 0.05,
      pulseSpeed: 0.2,
      pulseOffset: Math.PI
    });
  };

  const createParticleGroup = ({
    count,
    size,
    color,
    opacity,
    range,
    rotationSpeed,
    pulseFactor,
    pulseSpeed,
    pulseOffset
  }: {
    count: number;
    size: number;
    color: number;
    opacity: number;
    range: number;
    rotationSpeed: { x: number; y: number; z: number };
    pulseFactor: number;
    pulseSpeed: number;
    pulseOffset: number;
  }) => {
    if (!sceneRef.current) return;
    
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);
    
    // Randomize positions in 3D space
    for (let i = 0; i < count * 3; i += 3) {
      // Create more interesting distribution with some clusters
      const radius = Math.random() * range;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Convert spherical to cartesian coordinates with some randomization
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 2;
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 2;
      posArray[i + 2] = radius * Math.cos(phi) + (Math.random() - 0.5) * 2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material with custom shader for better visuals
    const particlesMaterial = new THREE.PointsMaterial({
      size,
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      // Enhanced appearance with attenuation and texture
      sizeAttenuation: true,
    });
    
    // Particle mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    
    // Random initial rotation for variety
    particlesMesh.rotation.x = Math.random() * Math.PI;
    particlesMesh.rotation.y = Math.random() * Math.PI;
    particlesMesh.rotation.z = Math.random() * Math.PI;
    
    // Store initial rotation for animation reference
    const initialRotation = particlesMesh.rotation.clone();
    
    // Add to scene
    sceneRef.current.add(particlesMesh);
    
    // Store in ref for animation access
    particleGroupsRef.current.push({
      mesh: particlesMesh,
      initialRotation,
      rotationSpeed,
      pulseFactor,
      pulseSpeed,
      pulseOffset
    });
  };
  
  const startAnimationLoop = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const animate = () => {
      timeRef.current += 0.01;
      
      // Animate each particle group
      particleGroupsRef.current.forEach(group => {
        // Base rotation animation
        group.mesh.rotation.x = group.initialRotation.x + timeRef.current * group.rotationSpeed.x;
        group.mesh.rotation.y = group.initialRotation.y + timeRef.current * group.rotationSpeed.y;
        group.mesh.rotation.z = group.initialRotation.z + timeRef.current * group.rotationSpeed.z;
        
        // Pulsing scale animation
        const pulseScale = 1 + Math.sin(timeRef.current * group.pulseSpeed + group.pulseOffset) * group.pulseFactor;
        group.mesh.scale.set(pulseScale, pulseScale, pulseScale);
        
        // Respond to mouse movement (subtle parallax effect)
        group.mesh.position.x += (mousePosition.current.x * 0.01 - group.mesh.position.x) * 0.05;
        group.mesh.position.y += (mousePosition.current.y * 0.01 - group.mesh.position.y) * 0.05;
      });
      
      // Camera slight movement for more immersive feel
      if (cameraRef.current) {
        cameraRef.current.position.x += (mousePosition.current.x * 0.3 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y += (mousePosition.current.y * 0.3 - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(0, 0, 0);
      }
      
      // Render scene
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Continue animation loop
      rafRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  return (
    <div 
      id="particles-background" 
      ref={containerRef} 
      className="absolute w-full h-full top-0 left-0 z-0"
    />
  );
};

export default ParticleBackground;

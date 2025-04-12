import { FC, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Project } from '@/types';
import { gsap } from 'gsap';

interface ProjectCard3DProps {
  project: Project;
  index: number;
}

const ProjectCard3D: FC<ProjectCard3DProps> = ({ project, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boxRef = useRef<THREE.Mesh | null>(null);
  
  // Set up the 3D scene on component mount
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // 1:1 aspect ratio for the card
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Set up auto-rotation variables
    let autoRotate = true;
    const autoRotateSpeed = 0.01;
    
    // Create a texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Create a basic geometry for the project showcase
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    
    // Load project image as texture
    textureLoader.load(project.image, (texture) => {
      // Create materials with the project image and colors that match the project type
      const materials = [
        new THREE.MeshBasicMaterial({ color: project.categories.includes('react') ? 0x61dafb : 0xf0db4f }),
        new THREE.MeshBasicMaterial({ color: project.categories.includes('ui') ? 0xff6b6b : 0x68d391 }),
        new THREE.MeshBasicMaterial({ map: texture }),
        new THREE.MeshBasicMaterial({ color: 0x38b2ac }),
        new THREE.MeshBasicMaterial({ color: 0xe53e3e }),
        new THREE.MeshBasicMaterial({ color: 0x805ad5 })
      ];
      
      // Create a cube with the materials
      const box = new THREE.Mesh(geometry, materials);
      scene.add(box);
      boxRef.current = box;
      
      // Position the box based on index for staggered appearance
      box.rotation.x = Math.PI / 4;
      box.rotation.y = Math.PI / 4;
      
      // Initial scale is 0, will animate to 1
      box.scale.set(0, 0, 0);
      
      // Animate the box into view
      gsap.to(box.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        delay: index * 0.2 + 0.5,
        ease: "elastic.out(1, 0.5)"
      });
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // Add point lights with different colors
      const pointLight1 = new THREE.PointLight(0xff9000, 1, 10);
      pointLight1.position.set(2, 2, 2);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0x0000ff, 1, 10);
      pointLight2.position.set(-2, -2, -2);
      scene.add(pointLight2);
    });
    
    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      if (boxRef.current) {
        // Subtle floating animation
        boxRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        
        // Auto-rotate the box if enabled
        if (autoRotate) {
          boxRef.current.rotation.y += autoRotateSpeed;
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Hover effects
    const handleMouseEnter = () => {
      // Stop auto-rotation on hover
      autoRotate = false;
      
      if (boxRef.current) {
        gsap.to(boxRef.current.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };
    
    const handleMouseLeave = () => {
      // Resume auto-rotation
      autoRotate = true;
      
      if (boxRef.current) {
        gsap.to(boxRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };
    
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up on unmount
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      
      if (boxRef.current) {
        geometry.dispose();
        if (Array.isArray(boxRef.current.material)) {
          boxRef.current.material.forEach(material => material.dispose());
        } else {
          boxRef.current.material.dispose();
        }
      }
    };
  }, [project, index]);
  
  return (
    <div 
      ref={containerRef}
      className="project-card-3d relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 flex flex-col"
    >
      <div className="relative h-64 w-full flex justify-center items-center">
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-800 to-transparent opacity-20 pointer-events-none"></div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 font-poppins">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
          {project.description}
        </p>
        
        <div className="flex flex-wrap mb-4 gap-2">
          {project.techs.map((tech, index) => (
            <span 
              key={index}
              className={`inline-block ${index % 2 === 0 ? 'bg-orange-500' : 'bg-blue-600'} text-white px-2 py-1 text-xs rounded font-medium`}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex space-x-3 mt-auto">
          <a 
            href={project.demo} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-orange-500 dark:hover:text-orange-500 transition flex items-center"
          >
            <i className="fas fa-external-link-alt mr-1"></i> Live Demo
          </a>
          <a 
            href={project.code} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-orange-500 dark:hover:text-orange-500 transition flex items-center"
          >
            <i className="fab fa-github mr-1"></i> Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard3D;
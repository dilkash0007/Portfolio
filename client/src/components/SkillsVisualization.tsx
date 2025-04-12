import { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillNode {
  name: string;
  level: number; // 1-10
  category: 'frontend' | 'backend' | 'design' | 'tools';
  color: string;
  icon: string;
}

const SkillsVisualization: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const skillNodesRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  // Define skills data
  const skills: SkillNode[] = [
    { name: 'HTML', level: 9, category: 'frontend', color: '#E34F26', icon: 'fab fa-html5' },
    { name: 'CSS', level: 9, category: 'frontend', color: '#1572B6', icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', level: 8, category: 'frontend', color: '#F7DF1E', icon: 'fab fa-js' },
    { name: 'React', level: 8, category: 'frontend', color: '#61DAFB', icon: 'fab fa-react' },
    { name: 'TypeScript', level: 7, category: 'frontend', color: '#3178C6', icon: 'fas fa-code' },
    { name: 'SASS', level: 7, category: 'frontend', color: '#CC6699', icon: 'fab fa-sass' },
    { name: 'Node.js', level: 7, category: 'backend', color: '#339933', icon: 'fab fa-node-js' },
    { name: 'Express', level: 7, category: 'backend', color: '#000000', icon: 'fas fa-server' },
    { name: 'MongoDB', level: 6, category: 'backend', color: '#47A248', icon: 'fas fa-database' },
    { name: 'UI Design', level: 7, category: 'design', color: '#FF7C7C', icon: 'fas fa-palette' },
    { name: 'Figma', level: 6, category: 'design', color: '#F24E1E', icon: 'fab fa-figma' },
    { name: 'Git', level: 8, category: 'tools', color: '#F05032', icon: 'fab fa-git-alt' },
    { name: 'Webpack', level: 6, category: 'tools', color: '#8DD6F9', icon: 'fas fa-cube' },
    { name: 'Responsive Design', level: 8, category: 'design', color: '#6B46C1', icon: 'fas fa-mobile-alt' },
    { name: 'Animations', level: 8, category: 'frontend', color: '#F97316', icon: 'fas fa-wand-magic-sparkles' }
  ];
  
  // Create 3D visualization
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Get container dimensions
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Create a group for all skill nodes
    const skillNodes = new THREE.Group();
    skillNodesRef.current = skillNodes;
    scene.add(skillNodes);
    
    // Create skill spheres and position them in a sphere-like arrangement
    const radius = 15; // Radius of the overall sphere arrangement
    
    skills.forEach((skill, i) => {
      // Calculate position on a sphere
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      // Node size based on skill level
      const size = 0.5 + (skill.level / 10) * 0.8;
      
      // Create geometry and material
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      
      // Convert hex color to Three.js color
      const color = new THREE.Color(skill.color);
      
      // Create material with glow effect
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
      });
      
      // Create mesh for the skill node
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      
      // Store skill data in the mesh's userData for interaction
      mesh.userData = {
        name: skill.name,
        level: skill.level,
        category: skill.category,
        color: skill.color
      };
      
      // Add to the group
      skillNodes.add(mesh);
      
      // Create connections to nearby skills (same category)
      skills.forEach((otherSkill, j) => {
        if (i !== j && otherSkill.category === skill.category) {
          const otherPhi = Math.acos(-1 + (2 * j) / skills.length);
          const otherTheta = Math.sqrt(skills.length * Math.PI) * otherPhi;
          
          const otherX = radius * Math.cos(otherTheta) * Math.sin(otherPhi);
          const otherY = radius * Math.sin(otherTheta) * Math.sin(otherPhi);
          const otherZ = radius * Math.cos(otherPhi);
          
          // Create a line connecting related skills
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(otherX, otherY, otherZ)
          ]);
          
          const lineMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          skillNodes.add(line);
        }
      });
    });
    
    // Create a particle system for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a larger sphere
      const radius = 50;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random subtle colors
      colors[i * 3] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.5
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Handle mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the picking ray
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections
      if (skillNodesRef.current) {
        const intersects = raycaster.intersectObjects(skillNodesRef.current.children);
        
        if (intersects.length > 0) {
          // Only consider sphere meshes, not lines
          const intersectedSphere = intersects.find(obj => obj.object.type === 'Mesh');
          
          if (intersectedSphere) {
            const userData = intersectedSphere.object.userData;
            if (userData && userData.name) {
              setHoveredSkill(userData.name);
              
              // Highlight the hovered skill
              gsap.to(intersectedSphere.object.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.3
              });
            }
          } else {
            setHoveredSkill(null);
          }
        } else {
          setHoveredSkill(null);
          
          // Reset all skill nodes to original scale
          skillNodesRef.current.children.forEach(child => {
            if (child.type === 'Mesh') {
              gsap.to(child.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3
              });
            }
          });
        }
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (skillNodesRef.current) {
        // Rotate the entire skill sphere slowly
        skillNodesRef.current.rotation.y += 0.002;
        skillNodesRef.current.rotation.x += 0.0005;
      }
      
      if (particles) {
        particles.rotation.y += 0.0003;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Scroll animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        gsap.to(camera.position, {
          z: 30,
          duration: 1.5,
          ease: 'power2.out'
        });
      },
      onLeave: () => {
        gsap.to(camera.position, {
          z: 50,
          duration: 1.5,
          ease: 'power2.in'
        });
      },
      onEnterBack: () => {
        gsap.to(camera.position, {
          z: 30,
          duration: 1.5,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(camera.position, {
          z: 50,
          duration: 1.5,
          ease: 'power2.in'
        });
      }
    });
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of all Three.js objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
  
  // Find the current hovered skill's data
  const hoveredSkillData = hoveredSkill ? skills.find(skill => skill.name === hoveredSkill) : null;
  
  return (
    <section className="relative py-20 bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-4 relative inline-block text-white">
            Skills Universe
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded transform"></span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore my skills in a 3D interactive visualization. Hover over nodes to see skill details.
          </p>
        </div>
        
        <div 
          ref={containerRef} 
          className="relative h-[500px] w-full rounded-lg overflow-hidden"
        >
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
          ></canvas>
          
          {/* Skill info tooltip when hovering */}
          {hoveredSkillData && (
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10 min-w-[200px] text-center transition-all duration-200">
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white`} style={{ backgroundColor: hoveredSkillData.color }}>
                <i className={hoveredSkillData.icon}></i>
              </div>
              <h3 className="text-lg font-semibold">{hoveredSkillData.name}</h3>
              <div className="mt-2 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hoveredSkillData.level * 10}%`,
                    backgroundColor: hoveredSkillData.color
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{hoveredSkillData.level * 10}% Proficiency</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">Category: {hoveredSkillData.category}</p>
            </div>
          )}
          
          <div className="absolute bottom-5 left-0 right-0 text-center text-white text-sm opacity-70">
            <p>Drag or move your cursor to interact with the visualization</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span>Frontend</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span>Backend</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
            <span>Design</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span>Tools</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsVisualization;
import React, { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SkillNode {
  name: string;
  level: number; // 1-10
  category: 'frontend' | 'backend' | 'design' | 'tools';
  color: string;
  icon: string;
}

const SkillsVisualization: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number>(0);
  const groupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const hoveredSkillRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define skills
  const skills: SkillNode[] = [
    // Frontend
    { name: 'React', level: 9, category: 'frontend', color: '#61DAFB', icon: '⚛️' },
    { name: 'JavaScript', level: 9, category: 'frontend', color: '#F7DF1E', icon: '📜' },
    { name: 'TypeScript', level: 8, category: 'frontend', color: '#3178C6', icon: '🔷' },
    { name: 'HTML5', level: 9, category: 'frontend', color: '#E34F26', icon: '🌐' },
    { name: 'CSS3', level: 8, category: 'frontend', color: '#1572B6', icon: '🎨' },
    { name: 'Redux', level: 7, category: 'frontend', color: '#764ABC', icon: '🔄' },
    { name: 'Next.js', level: 8, category: 'frontend', color: '#000000', icon: '⏭️' },
    { name: 'Tailwind', level: 8, category: 'frontend', color: '#06B6D4', icon: '💨' },
    
    // Backend
    { name: 'Node.js', level: 8, category: 'backend', color: '#339933', icon: '🟢' },
    { name: 'Express', level: 7, category: 'backend', color: '#000000', icon: '🚂' },
    { name: 'MongoDB', level: 7, category: 'backend', color: '#47A248', icon: '🍃' },
    { name: 'PostgreSQL', level: 6, category: 'backend', color: '#336791', icon: '🐘' },
    { name: 'Firebase', level: 7, category: 'backend', color: '#FFCA28', icon: '🔥' },
    
    // Design
    { name: 'Figma', level: 7, category: 'design', color: '#F24E1E', icon: '🖌️' },
    { name: 'UI/UX', level: 7, category: 'design', color: '#FF61F6', icon: '📱' },
    { name: 'GSAP', level: 6, category: 'design', color: '#88CE02', icon: '🎭' },
    { name: 'Three.js', level: 5, category: 'design', color: '#000000', icon: '🔮' },
    
    // Tools
    { name: 'Git', level: 8, category: 'tools', color: '#F05032', icon: '📊' },
    { name: 'Docker', level: 5, category: 'tools', color: '#2496ED', icon: '🐳' },
    { name: 'Webpack', level: 6, category: 'tools', color: '#8DD6F9', icon: '📦' },
    { name: 'Jest', level: 6, category: 'tools', color: '#C21325', icon: '🧪' },
  ];

  // Setup 3D visualization
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    // Setup
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500; // Fixed height
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 25;
    cameraRef.current = camera;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    
    // Create a group to hold all skill nodes
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;
    
    // Helper to create HTML texture
    const createTextTexture = (text: string, icon: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Fill background with skill color
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(64, 64, 64, 0, Math.PI * 2);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(64, 64, 60, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add icon
        ctx.fillStyle = 'white';
        ctx.font = '35px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, 64, 42);
        
        // Add text
        ctx.font = 'bold 16px Arial';
        ctx.fillText(text, 64, 82);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };
    
    // Create the 3D skill node objects
    skills.forEach((skill, index) => {
      // Create material with skill texture
      const texture = createTextTexture(skill.name, skill.icon, skill.color);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      
      // Create sphere geometry with size based on skill level
      const size = 0.8 + (skill.level / 10) * 0.5;
      const geometry = new THREE.CircleGeometry(size, 32);
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position in 3D space based on category
      // Arrange in a 3D orbital system
      const phi = Math.acos(-1 + (2 * index) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const distance = 10 + (Math.random() * 5);
      
      mesh.position.x = distance * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = distance * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = distance * Math.cos(phi);
      
      // Store skill name as user data for raycasting
      mesh.userData = { name: skill.name, level: skill.level, category: skill.category };
      
      group.add(mesh);
    });
    
    // Add tooltips container
    const tooltipElement = document.createElement('div');
    tooltipElement.classList.add('skill-tooltip');
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.padding = '8px 12px';
    tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltipElement.style.color = 'white';
    tooltipElement.style.borderRadius = '4px';
    tooltipElement.style.fontSize = '14px';
    tooltipElement.style.pointerEvents = 'none';
    tooltipElement.style.opacity = '0';
    tooltipElement.style.transition = 'opacity 0.2s';
    tooltipElement.style.zIndex = '1000';
    container.appendChild(tooltipElement);
    
    // Handle mouse move for interaction
    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update raycaster
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Check for intersections
      const intersects = raycasterRef.current.intersectObjects(group.children);
      
      // Reset all meshes to original scale
      group.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.name !== hoveredSkillRef.current) {
          child.scale.set(1, 1, 1);
        }
      });
      
      // Hide tooltip by default
      tooltipElement.style.opacity = '0';
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        const skillData = intersectedObject.userData;
        
        // Scale up the hovered object
        intersectedObject.scale.set(1.2, 1.2, 1.2);
        hoveredSkillRef.current = skillData.name;
        
        // Update and show tooltip
        tooltipElement.innerHTML = `
          <strong>${skillData.name}</strong><br>
          Level: ${skillData.level}/10<br>
          Category: ${skillData.category.charAt(0).toUpperCase() + skillData.category.slice(1)}
        `;
        tooltipElement.style.opacity = '1';
        tooltipElement.style.left = `${event.clientX - rect.left + 15}px`;
        tooltipElement.style.top = `${event.clientY - rect.top + 15}px`;
      } else {
        hoveredSkillRef.current = null;
      }
    };
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (groupRef.current) {
        // Rotate the entire skill cloud slowly
        groupRef.current.rotation.y += 0.002;
        // Gentle pulsing motion
        const pulse = Math.sin(Date.now() * 0.001) * 0.02;
        groupRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      }
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (camera && renderer && container) {
        const newWidth = container.clientWidth;
        camera.aspect = newWidth / height;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, height);
      }
    };
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', onMouseMove);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameIdRef.current);
      
      if (tooltipElement && tooltipElement.parentNode) {
        tooltipElement.parentNode.removeChild(tooltipElement);
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="skills-visualization relative w-full my-12" ref={containerRef}>
      <h2 className="text-3xl font-bold text-center mb-4 font-poppins bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-600">
        Interactive Skills Cloud
      </h2>
      <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
        Hover over skills to see details. This interactive 3D visualization showcases my technical expertise.
      </p>
      <canvas 
        ref={canvasRef} 
        className="w-full rounded-lg shadow-lg"
        style={{ height: '500px' }}
      />
    </div>
  );
};

export default SkillsVisualization;
import React, { FC, useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  targetX: number;
  targetY: number;
}

const ParticleTextMorphing: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const textOptions = [
    'Dilkash Raja',
    'Web Developer',
    'UI Designer',
    'Ranchi, India',
    'Let\'s Connect'
  ];
  
  const colorPalettes = [
    ['#F97316', '#F59E0B', '#D97706'], // Orange shades
    ['#3B82F6', '#60A5FA', '#93C5FD'], // Blue shades
    ['#10B981', '#34D399', '#6EE7B7'], // Green shades
    ['#EC4899', '#F472B6', '#FBCFE8'], // Pink shades
    ['#8B5CF6', '#A78BFA', '#C4B5FD']  // Purple shades
  ];
  
  // Create text particles
  const createTextParticles = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    fontSize: number,
    colorPalette: string[]
  ) => {
    const particles: Particle[] = [];
    const canvas = ctx.canvas;
    
    // Draw text to get pixel data
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const textData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = textData.data;
    
    // Sample pixels to create particles
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        const alpha = pixels[index + 3];
        
        if (alpha > 128) {
          const colorIndex = Math.floor(Math.random() * colorPalette.length);
          const color = colorPalette[colorIndex];
          
          const particle: Particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            color: color,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            targetX: x,
            targetY: y
          };
          
          particles.push(particle);
        }
      }
    }
    
    return particles;
  };
  
  // Draw particles and animate
  const animate = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Process each particle
    particlesRef.current.forEach(particle => {
      // Calculate direction to target
      const dx = particle.targetX - particle.x;
      const dy = particle.targetY - particle.y;
      
      // Add some mouse influence for interactivity
      const mouseInfluenceRange = 80;
      const mouseDx = mousePosition.x - particle.x;
      const mouseDy = mousePosition.y - particle.y;
      const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
      
      // Move particles toward their targets
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        particle.x += dx * 0.04;
        particle.y += dy * 0.04;
      }
      
      // Apply mouse repulsion
      if (mouseDistance < mouseInfluenceRange) {
        const repulsionForce = (1 - mouseDistance / mouseInfluenceRange) * 1.5;
        particle.x -= mouseDx * repulsionForce * 0.01;
        particle.y -= mouseDy * repulsionForce * 0.01;
      }
      
      // Add some random movement
      particle.x += particle.speedX * 0.2;
      particle.y += particle.speedY * 0.2;
      
      // Draw the particle
      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationFrameRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  };
  
  // Morph to new text
  const morphText = (
    ctx: CanvasRenderingContext2D, 
    newText: string, 
    colorPalette: string[]
  ) => {
    const fontSize = Math.min(ctx.canvas.width / (newText.length * 0.6), 120);
    const newParticles = createTextParticles(ctx, newText, fontSize, colorPalette);
    
    // Reuse existing particles if possible
    if (particlesRef.current.length > 0) {
      const minLength = Math.min(particlesRef.current.length, newParticles.length);
      
      // Update targets for existing particles
      for (let i = 0; i < minLength; i++) {
        particlesRef.current[i].targetX = newParticles[i].targetX;
        particlesRef.current[i].targetY = newParticles[i].targetY;
        particlesRef.current[i].color = newParticles[i].color;
      }
      
      // Add new particles if needed
      if (newParticles.length > particlesRef.current.length) {
        particlesRef.current = [
          ...particlesRef.current,
          ...newParticles.slice(particlesRef.current.length)
        ];
      }
      // Remove extra particles if needed
      else if (particlesRef.current.length > newParticles.length) {
        particlesRef.current = particlesRef.current.slice(0, newParticles.length);
      }
    } 
    // Initial setup
    else {
      particlesRef.current = newParticles;
    }
  };
  
  const handleResize = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const container = containerRef.current;
    if (!container) return;
    
    // Set canvas size to match container
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    // Regenerate particles for the new size
    const currentText = textOptions[currentTextIndex];
    const fontSize = Math.min(canvas.width / (currentText.length * 0.6), 120);
    const palette = colorPalettes[currentTextIndex % colorPalettes.length];
    particlesRef.current = createTextParticles(ctx, currentText, fontSize, palette);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Initialize canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initial setup
    handleResize(canvas, ctx);
    
    // Setup initial text
    const text = textOptions[currentTextIndex];
    const palette = colorPalettes[currentTextIndex % colorPalettes.length];
    const fontSize = Math.min(canvas.width / (text.length * 0.6), 120);
    particlesRef.current = createTextParticles(ctx, text, fontSize, palette);
    
    // Start animation
    animate(ctx, canvas.width, canvas.height);
    
    // Listen for window resize
    window.addEventListener('resize', () => handleResize(canvas, ctx));
    
    // Mouse move listener
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Text change interval
    const textChangeInterval = setInterval(() => {
      const nextIndex = (currentTextIndex + 1) % textOptions.length;
      setCurrentTextIndex(nextIndex);
      
      const nextText = textOptions[nextIndex];
      const nextPalette = colorPalettes[nextIndex % colorPalettes.length];
      morphText(ctx, nextText, nextPalette);
    }, 4000);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', () => handleResize(canvas, ctx));
      canvas.removeEventListener('mousemove', handleMouseMove);
      clearInterval(textChangeInterval);
    };
  }, [currentTextIndex]);
  
  return (
    <div className="particle-text-morphing relative w-full h-80 my-12 overflow-hidden" ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-0 w-full text-center text-gray-500 dark:text-gray-400 text-sm">
        Move your mouse to interact with the particles
      </div>
    </div>
  );
};

export default ParticleTextMorphing;
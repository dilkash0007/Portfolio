import { FC, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

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
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const currentTextRef = useRef<string>('DILKASH');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const texts = ['DILKASH', 'DEVELOPER', 'DESIGNER', 'CREATIVE'];
  const colors = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6'];
  
  // Function to get text pixel positions
  const getTextPixels = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    fontWeight: string, 
    fontSize: number,
    fontFamily: string,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    ctx.fillText(text, width / 2, height / 2);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const pixels: { x: number; y: number }[] = [];
    
    // Sample the text area for non-transparent pixels
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const i = (y * width + x) * 4;
        if (data[i + 3] > 128) { // If pixel is mostly opaque
          pixels.push({ x, y });
        }
      }
    }
    
    return pixels;
  };
  
  // Initialize particles
  const initParticles = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pixelPositions: { x: number; y: number }[],
    color: string
  ) => {
    // Clear existing particles
    particlesRef.current = [];
    
    // Create particles from text pixels
    pixelPositions.forEach((pos) => {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        color,
        speedX: 0,
        speedY: 0,
        targetX: pos.x,
        targetY: pos.y
      });
    });
  };
  
  // Animation loop
  const animate = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw and update particles
    particlesRef.current.forEach((p) => {
      // Draw particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Calculate distance to target
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      
      // Calculate distance to mouse for repulsion
      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);
      
      // Apply forces - attraction to target & repulsion from mouse
      p.speedX = dx * 0.05;
      p.speedY = dy * 0.05;
      
      // Mouse repulsion effect
      if (mouseDistance < 100) {
        const force = (100 - mouseDistance) / 100;
        p.speedX += (mdx / mouseDistance) * force * 4;
        p.speedY += (mdy / mouseDistance) * force * 4;
      }
      
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
    });
    
    animationFrameRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  };
  
  // Handle text morphing
  const morphText = (
    ctx: CanvasRenderingContext2D, 
    nextText: string, 
    color: string,
    width: number,
    height: number
  ) => {
    const pixels = getTextPixels(ctx, nextText, 'bold', 80, 'Poppins, Arial, sans-serif', width, height);
    
    // When we have fewer particles than needed, create new ones
    if (particlesRef.current.length < pixels.length) {
      const diff = pixels.length - particlesRef.current.length;
      
      for (let i = 0; i < diff; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          color,
          speedX: 0,
          speedY: 0,
          targetX: 0,
          targetY: 0
        });
      }
    }
    
    // Update targets for existing particles
    particlesRef.current.forEach((p, i) => {
      if (i < pixels.length) {
        p.targetX = pixels[i].x;
        p.targetY = pixels[i].y;
        // Gradually change the color
        gsap.to(p, { color, duration: 0.5 });
      } else {
        // Extra particles should move off screen
        p.targetX = Math.random() * width;
        p.targetY = height + 20;
      }
    });
    
    currentTextRef.current = nextText;
  };
  
  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };
  
  // Handle window resize
  const handleResize = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Re-initialize the text with new dimensions
      const pixels = getTextPixels(
        ctx, 
        currentTextRef.current, 
        'bold', 
        80,
        'Poppins, Arial, sans-serif',
        width,
        height
      );
      
      particlesRef.current.forEach((p, i) => {
        if (i < pixels.length) {
          p.targetX = pixels[i].x;
          p.targetY = pixels[i].y;
        }
      });
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set initial canvas size
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    // Initial text setup
    const initialPixels = getTextPixels(
      ctx, 
      texts[0], 
      'bold', 
      80, 
      'Poppins, Arial, sans-serif',
      width,
      height
    );
    
    // Initialize particles
    initParticles(ctx, width, height, initialPixels, colors[0]);
    
    // Start animation
    animate(ctx, width, height);
    
    // Set up mouse move event
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set up resize event
    const handleResizeEvent = () => handleResize(canvas, ctx);
    window.addEventListener('resize', handleResizeEvent);
    
    // Set up text changing interval
    const textInterval = setInterval(() => {
      const nextIndex = (currentTextIndex + 1) % texts.length;
      setCurrentTextIndex(nextIndex);
      morphText(ctx, texts[nextIndex], colors[nextIndex], width, height);
    }, 4000);
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResizeEvent);
      clearInterval(textInterval);
    };
  }, [currentTextIndex]);
  
  return (
    <div className="py-20 bg-gray-900 relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="relative h-[200px] w-full flex items-center justify-center"
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        ></canvas>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-70">
          <p>Move your cursor through the particles to see them react</p>
        </div>
      </div>
    </div>
  );
};

export default ParticleTextMorphing;
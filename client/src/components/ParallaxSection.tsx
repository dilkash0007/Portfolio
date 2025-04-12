import { FC, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !layersRef.current) return;
    
    const layers = layersRef.current.querySelectorAll('.parallax-layer');
    
    // Create parallax scrolling effect for each layer
    layers.forEach((layer, index) => {
      const depth = (layers.length - index) / layers.length;
      const movement = -(depth * 100);
      
      gsap.to(layer, {
        y: movement,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
    
    // Title animation
    const title = sectionRef.current.querySelector('.parallax-title');
    if (title) {
      gsap.from(title, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    }
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden h-[600px] flex items-center">
      {/* The parallax layers */}
      <div ref={layersRef} className="absolute inset-0 w-full h-full">
        {/* Sky layer */}
        <div className="parallax-layer absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-900 dark:to-indigo-900"></div>
        
        {/* Far mountains */}
        <div className="parallax-layer absolute bottom-0 left-0 right-0 h-[120px] md:h-[200px]">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q300,150 600,100 T1200,50 V200 H0 Z" fill="#8b5cf6" opacity="0.3" />
          </svg>
        </div>
        
        {/* Mid mountains */}
        <div className="parallax-layer absolute bottom-0 left-0 right-0 h-[150px] md:h-[250px]">
          <svg viewBox="0 0 1200 250" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,100 Q200,200 400,120 T800,150 T1200,100 V250 H0 Z" fill="#7c3aed" opacity="0.5" />
          </svg>
        </div>
        
        {/* Close mountains */}
        <div className="parallax-layer absolute bottom-0 left-0 right-0 h-[180px] md:h-[300px]">
          <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,150 Q150,250 300,150 T600,180 T900,150 T1200,180 V300 H0 Z" fill="#6d28d9" opacity="0.7" />
          </svg>
        </div>
        
        {/* Decorative elements - stars, clouds, birds */}
        <div className="parallax-layer absolute inset-0">
          {/* Stars - visible in dark mode */}
          <div className="hidden dark:block">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white" 
                style={{ 
                  width: `${Math.random() * 3 + 1}px`, 
                  height: `${Math.random() * 3 + 1}px`, 
                  top: `${Math.random() * 60}%`, 
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                  animation: `twinkle ${Math.random() * 3 + 1}s infinite alternate`
                }}
              ></div>
            ))}
          </div>
          
          {/* Clouds */}
          <div className="cloud absolute top-[15%] left-[10%] w-20 h-10 bg-white dark:bg-gray-300 rounded-full opacity-80"></div>
          <div className="cloud absolute top-[20%] left-[30%] w-24 h-12 bg-white dark:bg-gray-300 rounded-full opacity-90"></div>
          <div className="cloud absolute top-[10%] left-[60%] w-28 h-14 bg-white dark:bg-gray-300 rounded-full opacity-70"></div>
          <div className="cloud absolute top-[25%] left-[80%] w-16 h-8 bg-white dark:bg-gray-300 rounded-full opacity-80"></div>
        </div>
        
        {/* Foreground elements */}
        <div className="parallax-layer absolute bottom-0 left-0 right-0 h-[80px] md:h-[120px]">
          <svg viewBox="0 0 1200 120" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,0 L1200,0 L1200,120 L0,120 Z" fill="#4c1d95" />
          </svg>
        </div>
      </div>
      
      {/* Content layer */}
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <h2 className="parallax-title text-3xl md:text-5xl font-bold font-poppins mb-6 drop-shadow-lg">
          Turning <span className="text-orange-500">Vision</span> Into <span className="text-blue-400">Reality</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md">
          Scroll to experience the depth of my creative process and development journey
        </p>
      </div>
      
      {/* CSS for cloud animations is added to index.css instead */}
    </section>
  );
};

export default ParallaxSection;
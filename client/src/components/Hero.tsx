import { FC, useEffect, useRef, useState } from 'react';
import ParticleBackground from './ParticleBackground';

const Hero: FC = () => {
  const typingRef = useRef<HTMLSpanElement>(null);
  const [typingText, setTypingText] = useState('I build responsive websites');

  useEffect(() => {
    const texts = ["I build responsive websites", "I create modern apps", "I craft seamless UI/UX"];
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    const typeText = () => {
      const current = texts[currentIndex];
      
      if (isDeleting) {
        setTypingText(current.substring(0, charIndex - 1));
        charIndex--;
        typingDelay = 50;
      } else {
        setTypingText(current.substring(0, charIndex + 1));
        charIndex++;
        typingDelay = 100;
      }
      
      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typingDelay = 1000; // Wait before start deleting
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % texts.length;
        typingDelay = 500; // Wait before typing next string
      }
      
      setTimeout(typeText, typingDelay);
    };

    const typingTimer = setTimeout(typeText, 1000);
    
    // Apply animation classes
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 200 * (index + 1));
    });

    return () => clearTimeout(typingTimer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 space-y-6">
            <div className="space-y-3">
              <p className="text-orange-500 font-medium font-poppins text-lg md:text-xl mb-2 fade-in">
                Hello, I'm
              </p>
              <h1 className="text-4xl md:text-6xl font-bold font-poppins leading-tight text-gray-800 dark:text-gray-100 fade-in">
                Rahul Dev
              </h1>
              <h2 className="text-xl md:text-3xl font-medium text-gray-600 dark:text-gray-300 mb-6 fade-in">
                <span ref={typingRef} className="typing">{typingText}</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-lg fade-in">
                A passionate web developer from Ranchi, India, transforming ideas into elegant digital experiences. I specialize in creating responsive, modern, and user-friendly applications.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 fade-in">
              <a href="#projects" className="btn-primary">
                <span>View My Work</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
              <a href="#contact" className="btn-secondary">
                <span>Contact Me</span>
              </a>
            </div>
            
            <div className="flex space-x-4 pt-6 fade-in">
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500 transition-colors">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500 transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/3 mt-12 md:mt-0 flex justify-center items-center fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative w-56 h-56 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=500&q=80" 
                  alt="Rahul Dev - Web Developer"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center fade-in">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <i className="fas fa-map-marker-alt text-orange-500"></i>
            <span>Inspired by the vibrant culture of Jharkhand, building for the world.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

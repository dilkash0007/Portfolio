import { FC, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  percentage: number;
}

interface Tech {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface LearningTech {
  name: string;
  icon: string;
  color: string;
  progress: number;
}

const Skills: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarsRef = useRef<HTMLDivElement>(null);
  const techGridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const skills: Skill[] = [
    { name: 'HTML & CSS', percentage: 95 },
    { name: 'JavaScript', percentage: 90 },
    { name: 'React', percentage: 85 },
    { name: 'Node.js', percentage: 75 },
    { name: 'UI/UX Design', percentage: 80 },
    { name: 'Responsive Design', percentage: 90 }
  ];

  const technologies: Tech[] = [
    { name: 'HTML5', icon: 'fab fa-html5', color: 'text-orange-600', bgColor: 'bg-orange-600' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { name: 'JavaScript', icon: 'fab fa-js', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { name: 'React', icon: 'fab fa-react', color: 'text-blue-400', bgColor: 'bg-blue-400' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: 'text-green-600', bgColor: 'bg-green-600' },
    { name: 'Git', icon: 'fab fa-git-alt', color: 'text-red-500', bgColor: 'bg-red-500' },
    { name: 'Sass', icon: 'fab fa-sass', color: 'text-pink-500', bgColor: 'bg-pink-500' },
    { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: 'text-purple-600', bgColor: 'bg-purple-600' },
    { name: 'Figma', icon: 'fab fa-figma', color: 'text-purple-500', bgColor: 'bg-purple-500' },
    { name: 'MongoDB', icon: 'fas fa-database', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { name: 'AWS', icon: 'fab fa-aws', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { name: 'CLI', icon: 'fas fa-terminal', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-600 dark:bg-gray-400' }
  ];

  const learning: LearningTech[] = [
    { name: 'Python', icon: 'fab fa-python', color: 'text-blue-500', progress: 40 },
    { name: 'Next.js', icon: 'fas fa-cube', color: 'text-indigo-500', progress: 60 },
    { name: 'React Native', icon: 'fas fa-mobile-alt', color: 'text-green-500', progress: 30 },
    { name: 'TypeScript', icon: 'fas fa-file-code', color: 'text-blue-600', progress: 55 }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Heading animation
    if (headingRef.current) {
      const headingLine = headingRef.current.querySelector('span');
      
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
          }
        }
      );
      
      if (headingLine) {
        gsap.fromTo(
          headingLine,
          { width: '0%', left: '50%' },
          { 
            width: '100%', 
            left: '0%', 
            duration: 1.2, 
            delay: 0.3,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }

    // Progress bars animation with enhanced effects
    if (progressBarsRef.current) {
      const progressBars = progressBarsRef.current.querySelectorAll('.progress-bar');
      const progressLabels = progressBarsRef.current.querySelectorAll('.progress-label');
      const progressPercentages = progressBarsRef.current.querySelectorAll('.progress-percentage');
      
      // Staggered animation for progress bar labels
      gsap.fromTo(
        progressLabels,
        { opacity: 0, x: -30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.1,
          scrollTrigger: {
            trigger: progressBarsRef.current,
            start: 'top 80%',
          }
        }
      );
      
      // Staggered animation for progress bar percentages
      gsap.fromTo(
        progressPercentages,
        { opacity: 0, x: 30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: {
            trigger: progressBarsRef.current,
            start: 'top 80%',
          }
        }
      );
      
      // Animate progress bars with delay
      ScrollTrigger.create({
        trigger: progressBarsRef.current,
        start: 'top 80%',
        onEnter: () => {
          progressBars.forEach((bar, index) => {
            setTimeout(() => {
              bar.classList.add('animate');
              
              // Add pulse animation after progress bar is filled
              setTimeout(() => {
                const highlight = bar.querySelector('.progress-highlight');
                if (highlight) {
                  highlight.classList.add('active');
                }
              }, 1500);
            }, index * 200);
          });
        }
      });
    }

    // Tech icons 3D flip and staggered animation
    if (techGridRef.current) {
      const techCards = techGridRef.current.querySelectorAll('.tech-card');
      
      // Create a more impressive entrance animation with 3D effects
      gsap.fromTo(
        techCards,
        { 
          y: 50, 
          opacity: 0, 
          rotationX: -30,
          rotationY: 15,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: techGridRef.current,
            start: 'top 80%',
          }
        }
      );
    }
    
    // Learning technologies animation
    if (learningRef.current) {
      const learningCards = learningRef.current.querySelectorAll('.learning-card');
      const progressBars = learningRef.current.querySelectorAll('.learning-progress');
      
      gsap.fromTo(
        learningCards,
        { x: -30, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.7, 
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: learningRef.current,
            start: 'top 85%',
          }
        }
      );
      
      // Animate progress bars
      ScrollTrigger.create({
        trigger: learningRef.current,
        start: 'top 85%',
        onEnter: () => {
          progressBars.forEach((bar, index) => {
            gsap.fromTo(
              bar,
              { width: '0%' },
              { 
                width: bar.getAttribute('data-progress') || '0%',
                duration: 1.5,
                delay: 0.8 + (index * 0.1),
                ease: "power2.out"
              }
            );
          });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Tech card hover animation using GSAP
  const handleTechCardHover = (techName: string, isEnter: boolean) => {
    setHoveredTech(isEnter ? techName : null);
    
    const card = document.getElementById(`tech-${techName.replace(/\./g, '-')}`);
    if (!card) return;
    
    if (isEnter) {
      gsap.to(card, {
        y: -15,
        scale: 1.1,
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: "power2.out"
      });
      
      const icon = card.querySelector('i');
      if (icon) {
        gsap.to(icon, {
          scale: 1.2,
          rotateY: 360,
          duration: 0.6,
          ease: "back.out(1.7)"
        });
      }
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        duration: 0.3,
        ease: "power2.out"
      });
      
      const icon = card.querySelector('i');
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotateY: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        });
      }
    }
  };

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 bg-grid opacity-5"></div>
      
      {/* Floating shapes for visual interest */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 ref={headingRef} className="text-3xl md:text-5xl font-bold font-poppins mb-4 relative inline-block gradient-text">
            My Skills
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-blue-500 rounded transform"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            I've worked with a variety of technologies and continue to expand my knowledge with a focus on creating impressive animations and responsive designs.
          </p>
        </div>
        
        <div className="mb-20">
          <h3 className="text-xl font-semibold mb-8 font-poppins text-center relative inline-block">
            Technical Expertise
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded transform"></span>
          </h3>
          <div ref={progressBarsRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {skills.map((skill, index) => (
              <div key={index} className="reveal-from-bottom" style={{ transitionDelay: `${index * 0.1}s` }}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium progress-label">{skill.name}</span>
                  <span className="progress-percentage font-semibold">{skill.percentage}%</span>
                </div>
                <div className="progress-bar bg-gray-200 dark:bg-gray-700 relative overflow-hidden" style={{ '--progress': `${skill.percentage}%` } as React.CSSProperties}>
                  <div className="progress-highlight absolute inset-0 opacity-0"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-10 border-t border-gray-200 dark:border-gray-700 mb-20">
          <h3 className="text-xl font-semibold mb-8 font-poppins text-center relative inline-block">
            Technologies I Work With
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded transform"></span>
          </h3>
          <div ref={techGridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                id={`tech-${tech.name.replace(/\./g, '-')}`}
                className={`tech-card rounded-xl shadow-sm flex flex-col items-center justify-center py-6 px-3 transform-gpu transition-all duration-500 ${hoveredTech === tech.name ? 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900' : 'bg-white dark:bg-gray-900'}`}
                onMouseEnter={() => handleTechCardHover(tech.name, true)}
                onMouseLeave={() => handleTechCardHover(tech.name, false)}
              >
                <div className={`relative mb-4 w-16 h-16 flex items-center justify-center rounded-full ${tech.bgColor} bg-opacity-10 dark:bg-opacity-20`}>
                  <i className={`${tech.icon} text-3xl ${tech.color} tech-icon`}></i>
                  
                  {/* Add particles around the icon on hover */}
                  {hoveredTech === tech.name && (
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <span className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-current animate-particle-1"></span>
                      <span className="absolute top-3/4 left-1/2 w-1 h-1 rounded-full bg-current animate-particle-2"></span>
                      <span className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-current animate-particle-3"></span>
                    </div>
                  )}
                </div>
                
                <span className="font-medium">{tech.name}</span>
                
                {/* Animated underline on hover */}
                <div className={`mt-2 h-0.5 ${tech.bgColor} rounded-full transition-all duration-300 ${hoveredTech === tech.name ? 'w-16' : 'w-0'}`}></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-8 font-poppins text-center relative inline-block">
            Currently Learning
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded transform"></span>
          </h3>
          <div ref={learningRef} className="flex flex-wrap justify-center gap-8">
            {learning.map((tech, index) => (
              <div 
                key={index} 
                className="learning-card bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md flex items-center space-x-4 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
              >
                <div className={`flex items-center justify-center w-14 h-14 rounded-full ${tech.color.replace('text-', 'bg-')} bg-opacity-10 dark:bg-opacity-20`}>
                  <i className={`${tech.icon} text-2xl ${tech.color}`}></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-lg mb-2">{tech.name}</span>
                  <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${tech.color.replace('text-', 'bg-')} rounded-full learning-progress`}
                      style={{ width: '0%' }}
                      data-progress={`${tech.progress}%`}
                    ></div>
                  </div>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{tech.progress}% Mastered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;

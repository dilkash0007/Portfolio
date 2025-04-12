import React, { FC, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const InteractiveTimeline: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Timeline data
  const timelineItems: TimelineItem[] = [
    {
      year: '2019',
      title: 'Started Web Development Journey',
      description: 'Began learning HTML, CSS, and JavaScript fundamentals through online courses and self-study. Created my first simple websites and web applications.',
      icon: '🚀',
      color: '#4299E1'
    },
    {
      year: '2020',
      title: 'First Freelance Projects',
      description: 'Completed several freelance projects for local clients in Ranchi, including business websites and e-commerce platforms. Started learning React and modern JavaScript frameworks.',
      icon: '💼',
      color: '#F6AD55'
    },
    {
      year: '2021',
      title: 'Full Stack Development',
      description: 'Expanded skills to include backend technologies like Node.js, Express, and MongoDB. Developed full-stack applications with complete authentication and database integration.',
      icon: '⚙️',
      color: '#48BB78'
    },
    {
      year: '2022',
      title: 'Professional Development',
      description: 'Joined a development team working on large-scale applications. Improved skills in team collaboration, version control, and agile methodologies. Started exploring UI/UX design principles.',
      icon: '🔄',
      color: '#9F7AEA'
    },
    {
      year: '2023',
      title: 'Advanced Frontend Technologies',
      description: 'Mastered React ecosystem with Redux, Next.js, and TypeScript. Developed expertise in modern CSS techniques, animations, and responsive design. Created complex interactive web experiences.',
      icon: '✨',
      color: '#F56565'
    },
    {
      year: '2024',
      title: 'Creative Development & 3D Web',
      description: 'Focused on creative development using Three.js, GSAP, and WebGL. Created immersive web experiences with 3D elements and advanced animations. Started sharing knowledge through technical blog posts.',
      icon: '🔮',
      color: '#ED8936'
    },
    {
      year: '2025',
      title: 'Current Projects & Future Vision',
      description: 'Currently working on innovative web projects with cutting-edge technologies. Focused on performance optimization, accessibility, and creating memorable user experiences. Open to new opportunities and collaborations.',
      icon: '🌟',
      color: '#667EEA'
    }
  ];
  
  // Setup the timeline animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (timelineRef.current) {
      // Create the timeline line animation
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none none'
          }
        }
      );
      
      // Animate each timeline item
      itemsRef.current.forEach((item, index) => {
        if (item) {
          // Staggered appearance of items
          gsap.fromTo(
            item,
            { 
              opacity: 0, 
              x: index % 2 === 0 ? -50 : 50 
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
          
          // Animate the year circles
          gsap.fromTo(
            item.querySelector('.year-circle'),
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              delay: index * 0.2 + 0.3,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });
    }
  }, []);
  
  // Handle item hover/selection
  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <div className="timeline-container relative py-16 px-4" ref={timelineRef}>
      <h2 className="text-3xl font-bold text-center mb-16 font-poppins bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-600">
        My Journey
      </h2>
      
      {/* Vertical timeline line */}
      <div className="timeline-line absolute left-1/2 top-32 bottom-32 w-1 bg-gradient-to-b from-orange-500 to-blue-600 transform -translate-x-1/2 rounded-full"></div>
      
      {/* Timeline items */}
      <div className="relative z-10">
        {timelineItems.map((item, index) => (
          <div
            ref={(el) => (itemsRef.current[index] = el)}
            key={index}
            className={`timeline-item relative mb-16 flex ${
              index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'
            }`}
            onMouseEnter={() => handleItemHover(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Content side */}
            <div className="w-5/12 p-4">
              <div 
                className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
                  activeIndex === index 
                    ? 'scale-105 shadow-xl' 
                    : 'scale-100'
                } ${
                  index % 2 === 0 
                    ? 'rounded-tr-none' 
                    : 'rounded-tl-none'
                } bg-white dark:bg-gray-800`}
              >
                <div className="flex items-center mb-3">
                  <span 
                    className="text-2xl mr-3" 
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
            
            {/* Center year marker */}
            <div className="w-2/12 flex justify-center relative">
              <div 
                className="year-circle absolute top-6 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transform -translate-y-1/2 z-20"
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: activeIndex === index 
                    ? `0 0 15px ${item.color}` 
                    : 'none'
                }}
              >
                {item.year}
              </div>
            </div>
            
            {/* Empty side (for alignment) */}
            <div className="w-5/12"></div>
          </div>
        ))}
      </div>
      
      {/* Final marker */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 animate-pulse"></div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
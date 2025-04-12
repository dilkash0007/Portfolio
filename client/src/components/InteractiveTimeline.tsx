import { FC, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const InteractiveTimeline: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const timelineData: TimelineItem[] = [
    {
      year: "2019",
      title: "Started Web Development Journey",
      description: "Began learning HTML, CSS, and JavaScript fundamentals and built my first static websites.",
      icon: "fas fa-rocket",
      color: "bg-blue-500"
    },
    {
      year: "2020",
      title: "Front-end Framework Mastery",
      description: "Dived deep into React.js and built several interactive web applications.",
      icon: "fab fa-react",
      color: "bg-blue-400"
    },
    {
      year: "2021",
      title: "Full Stack Development",
      description: "Expanded skills to include Node.js, Express, and MongoDB to create complete web solutions.",
      icon: "fas fa-layer-group",
      color: "bg-green-500"
    },
    {
      year: "2022",
      title: "Modern Web Techniques",
      description: "Mastered advanced animations, state management, and responsive design principles.",
      icon: "fas fa-wand-magic-sparkles",
      color: "bg-purple-500"
    },
    {
      year: "2023",
      title: "Freelance Web Developer",
      description: "Started offering professional web development services to clients around Ranchi.",
      icon: "fas fa-briefcase",
      color: "bg-orange-500"
    }
  ];
  
  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return;
    
    const timeline = timelineRef.current;
    const items = timeline.querySelectorAll('.timeline-item');
    const connector = timeline.querySelector('.timeline-connector');
    
    // Title animation
    const title = sectionRef.current.querySelector('h2');
    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
          }
        }
      );
    }
    
    // Connector line animation
    if (connector) {
      gsap.fromTo(
        connector,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timeline,
            start: 'top 70%',
          }
        }
      );
    }
    
    // Animate each timeline item
    items.forEach((item, index) => {
      const itemContent = item.querySelector('.timeline-content');
      const dot = item.querySelector('.timeline-dot');
      const icon = item.querySelector('.timeline-icon');
      const year = item.querySelector('.timeline-year');
      const content = item.querySelector('.timeline-details');
      
      // Create a timeline for this item
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
        }
      });
      
      // Dot animation
      if (dot) {
        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
          }
        );
      }
      
      // Icon animation
      if (icon) {
        tl.fromTo(
          icon,
          { opacity: 0, rotateY: -90 },
          {
            opacity: 1,
            rotateY: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
          },
          "-=0.2"
        );
      }
      
      // Year animation
      if (year) {
        tl.fromTo(
          year,
          { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5
          },
          "-=0.3"
        );
      }
      
      // Content animation
      if (content) {
        tl.fromTo(
          content,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5
          },
          "-=0.2"
        );
      }
      
      // Add hover animations
      if (itemContent) {
        itemContent.addEventListener('mouseenter', () => {
          gsap.to(itemContent, {
            y: -5,
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
            duration: 0.3
          });
          
          if (icon) {
            gsap.to(icon, {
              rotate: "+=360",
              duration: 1,
              ease: "power2.out"
            });
          }
        });
        
        itemContent.addEventListener('mouseleave', () => {
          gsap.to(itemContent, {
            y: 0,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
            duration: 0.3
          });
        });
      }
    });
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      items.forEach(item => {
        const itemContent = item.querySelector('.timeline-content');
        if (itemContent) {
          itemContent.removeEventListener('mouseenter', () => {});
          itemContent.removeEventListener('mouseleave', () => {});
        }
      });
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef} 
      id="timeline" 
      className="py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden relative"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-4 relative inline-block">
            My Journey
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-orange-500 rounded transform"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow my path to becoming a skilled web developer and the milestones along the way.
          </p>
        </div>
        
        <div ref={timelineRef} className="relative py-8">
          {/* Center line */}
          <div className="timeline-connector absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 origin-top"></div>
          
          {/* Timeline items */}
          <div className="relative">
            {timelineData.map((item, index) => (
              <div 
                key={index} 
                className={`timeline-item relative mb-16 ${
                  index % 2 === 0 ? 'ml-auto pr-12 md:pr-0 md:ml-[50%] md:pl-12 md:w-1/2' : 'mr-auto pl-12 md:pl-0 md:mr-[50%] md:pr-12 md:w-1/2 md:text-right'
                }`}
              >
                {/* Timeline dot */}
                <div className="timeline-dot absolute left-0 md:left-1/2 top-7 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-4 border-orange-500 -translate-x-1/2 z-10"></div>
                
                {/* Timeline content */}
                <div className="timeline-content bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md transition-all duration-300 relative">
                  {/* Icon */}
                  <div className={`timeline-icon absolute ${index % 2 === 0 ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} -top-5 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${item.color}`}>
                    <i className={`${item.icon}`}></i>
                  </div>
                  
                  {/* Year */}
                  <span className="timeline-year inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm font-semibold mb-3">
                    {item.year}
                  </span>
                  
                  {/* Content */}
                  <div className="timeline-details">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveTimeline;
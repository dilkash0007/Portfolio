import { FC, useEffect, useRef } from 'react';
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

  const skills: Skill[] = [
    { name: 'HTML & CSS', percentage: 95 },
    { name: 'JavaScript', percentage: 90 },
    { name: 'React', percentage: 85 },
    { name: 'Node.js', percentage: 75 },
    { name: 'UI/UX Design', percentage: 80 },
    { name: 'Responsive Design', percentage: 90 }
  ];

  const technologies: Tech[] = [
    { name: 'HTML5', icon: 'fab fa-html5', color: 'text-orange-600' },
    { name: 'CSS3', icon: 'fab fa-css3-alt', color: 'text-blue-500' },
    { name: 'JavaScript', icon: 'fab fa-js', color: 'text-yellow-500' },
    { name: 'React', icon: 'fab fa-react', color: 'text-blue-400' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: 'text-green-600' },
    { name: 'Git', icon: 'fab fa-git-alt', color: 'text-red-500' },
    { name: 'Sass', icon: 'fab fa-sass', color: 'text-pink-500' },
    { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: 'text-purple-600' },
    { name: 'Figma', icon: 'fab fa-figma', color: 'text-purple-500' },
    { name: 'MongoDB', icon: 'fas fa-database', color: 'text-blue-500' },
    { name: 'AWS', icon: 'fab fa-aws', color: 'text-orange-500' },
    { name: 'CLI', icon: 'fas fa-terminal', color: 'text-gray-600 dark:text-gray-400' }
  ];

  const learning: LearningTech[] = [
    { name: 'Python', icon: 'fab fa-python', color: 'text-blue-500', progress: 40 },
    { name: 'Next.js', icon: 'fas fa-cube', color: 'text-indigo-500', progress: 60 },
    { name: 'React Native', icon: 'fas fa-mobile-alt', color: 'text-green-500', progress: 30 }
  ];

  useEffect(() => {
    if (!sectionRef.current || !progressBarsRef.current) return;

    // Animation for progress bars
    const progressBars = progressBarsRef.current.querySelectorAll('.progress-bar');
    
    ScrollTrigger.create({
      trigger: progressBarsRef.current,
      start: 'top 80%',
      onEnter: () => {
        progressBars.forEach(bar => {
          bar.classList.add('animate');
        });
      }
    });

    // Animation for tech icons
    const techCards = sectionRef.current.querySelectorAll('.tech-card');
    
    gsap.fromTo(
      techCards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: techCards[0],
          start: 'top 80%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-gray-100 dark:bg-gray-800 relative">
      <div className="absolute inset-0 bg-grid opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 relative inline-block">
            My Skills
            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded transform"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            I've worked with a variety of technologies and continue to expand my knowledge.
          </p>
        </div>
        
        <div className="mb-16">
          <h3 className="text-xl font-semibold mb-6 font-poppins text-center">Technical Skills</h3>
          <div ref={progressBarsRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {skills.map((skill, index) => (
              <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span>{skill.percentage}%</span>
                </div>
                <div className="progress-bar bg-gray-200 dark:bg-gray-700" style={{ '--progress': `${skill.percentage}%` } as React.CSSProperties}></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-6 font-poppins text-center">Technologies I Work With</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {technologies.map((tech, index) => (
              <div 
                key={index} 
                className="tech-card bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center transition-transform hover:scale-105"
              >
                <i className={`${tech.icon} text-4xl mb-3 ${tech.color}`}></i>
                <span className="font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6 font-poppins text-center">Currently Learning</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {learning.map((tech, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 px-6 py-4 rounded-lg shadow-sm flex items-center space-x-3 transition-transform hover:scale-105"
              >
                <i className={`${tech.icon} text-2xl ${tech.color}`}></i>
                <div className="flex flex-col">
                  <span className="font-medium">{tech.name}</span>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${tech.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${tech.progress}%` }}></div>
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

export default Skills;

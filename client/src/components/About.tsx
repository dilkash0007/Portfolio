import { FC, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const fadeInElements = sectionRef.current.querySelectorAll('.fade-in');
    
    fadeInElements.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 relative inline-block">
            About Me
            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded transform"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get to know more about me, my background, and what drives my passion for web development.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-2/5 fade-in">
            <div className="relative">
              <div className="absolute -inset-2 bg-orange-500 opacity-10 rounded-lg blur-xl"></div>
              <img 
                className="rounded-lg shadow-xl relative z-10" 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80" 
                alt="Web developer workspace" 
              />
            </div>
          </div>
          
          <div className="md:w-3/5 fade-in">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold font-poppins text-gray-800 dark:text-gray-100">
                Passionate Web Developer from Ranchi
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400">
                Hello! I'm Rahul, a web developer based in the beautiful city of Ranchi, Jharkhand. With a deep passion for creating seamless digital experiences, I've dedicated myself to mastering the art of web development.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                I specialize in building responsive websites and applications using modern technologies like React, JavaScript, HTML, and CSS. My approach combines technical expertise with creative problem-solving to deliver solutions that not only look great but also perform exceptionally.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                When I'm not coding, you can find me exploring Ranchi's natural landscapes, contributing to the local tech community, or experimenting with new web technologies to stay at the cutting edge of development.
              </p>
              
              <div className="pt-4">
                <a href="#contact" className="btn-primary">
                  <span>Get In Touch</span>
                  <i className="fas fa-envelope ml-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md transition-transform hover:-translate-y-1">
            <div className="mb-4 text-orange-500">
              <i className="fas fa-laptop-code text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 font-poppins">Web Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating responsive, user-friendly websites that work across all devices and browsers.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md transition-transform hover:-translate-y-1">
            <div className="mb-4 text-orange-500">
              <i className="fas fa-mobile-alt text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 font-poppins">App Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Building modern web applications with React and other cutting-edge technologies.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md transition-transform hover:-translate-y-1">
            <div className="mb-4 text-orange-500">
              <i className="fas fa-paint-brush text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 font-poppins">UI/UX Design</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating intuitive user interfaces and enjoyable user experiences that engage and delight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import { FC, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Animate the section heading with a custom underline animation
    if (headingRef.current) {
      const underline = headingRef.current.querySelector('span');
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
      
      if (underline) {
        gsap.fromTo(
          underline,
          { width: '0%', left: '50%' },
          {
            width: '100%',
            left: '0%',
            duration: 1,
            delay: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }
    
    // Animate the about image with a 3D tilt effect
    if (imageRef.current) {
      const image = imageRef.current.querySelector('img');
      
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -50, rotateY: -15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 75%',
          }
        }
      );
      
      // Add floating animation
      if (image) {
        gsap.to(image, {
          y: 10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      
      // Add tilt effect on mouse move
      const tiltContainer = imageRef.current;
      if (tiltContainer) {
        tiltContainer.addEventListener('mousemove', (e) => {
          if (!image) return;
          
          const rect = tiltContainer.getBoundingClientRect();
          const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
          const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
          
          gsap.to(image, {
            rotationY: mouseX * 10,
            rotationX: -mouseY * 10,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        tiltContainer.addEventListener('mouseleave', () => {
          if (!image) return;
          
          gsap.to(image, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      }
    }
    
    // Animate the content section with staggered paragraphs
    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');
      const button = contentRef.current.querySelector('a');
      
      gsap.fromTo(
        paragraphs,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          }
        }
      );
      
      if (button) {
        gsap.fromTo(
          button,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 75%',
            }
          }
        );
      }
    }
    
    // Animate service cards with staggered appearance and hover effects
    if (servicesRef.current) {
      const cards = servicesRef.current.querySelectorAll('.service-card');
      
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: 'top 75%',
          }
        }
      );
      
      // Add hover effects to cards
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          const icon = card.querySelector('.service-icon');
          const title = card.querySelector('h3');
          
          gsap.to(card, {
            y: -10,
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
            duration: 0.3
          });
          
          if (icon) {
            gsap.to(icon, {
              rotateY: 180,
              scale: 1.2,
              duration: 0.6,
              ease: "back.out(1.7)"
            });
          }
          
          if (title) {
            gsap.to(title, {
              color: '#f97316',
              duration: 0.3
            });
          }
        });
        
        card.addEventListener('mouseleave', () => {
          const icon = card.querySelector('.service-icon');
          const title = card.querySelector('h3');
          
          gsap.to(card, {
            y: 0,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            duration: 0.3
          });
          
          if (icon) {
            gsap.to(icon, {
              rotateY: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.7)"
            });
          }
          
          if (title) {
            gsap.to(title, {
              color: '', // Reset to default
              duration: 0.3
            });
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 ref={headingRef} className="text-3xl md:text-5xl font-bold font-poppins mb-4 relative inline-block gradient-text animate__animated animate__fadeIn">
            About Me
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-orange-500 rounded transform"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Get to know more about me, my background, and what drives my passion for web development.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div ref={imageRef} className="md:w-2/5 reveal-from-left">
            <div className="relative transform-gpu perspective-image">
              {/* Animated glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-400 to-blue-500 opacity-20 rounded-lg blur-xl animate-pulse"></div>
              
              {/* Main image with 3D hover effect */}
              <div className="relative overflow-hidden rounded-lg shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                <img 
                  className="w-full h-auto relative z-10" 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80" 
                  alt="Dilkash Raja - Web Developer workspace" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Floating code element */}
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-900 p-3 rounded-md shadow-lg animate__animated animate__fadeInUp">
                <pre className="text-xs text-orange-500 font-mono">
                  <code>{`function createAwesome() {
  return passion + skills;
}`}</code>
                </pre>
              </div>
            </div>
          </div>
          
          <div ref={contentRef} className="md:w-3/5 reveal-from-right">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold font-poppins text-gray-800 dark:text-gray-100 reveal-from-right">
                Passionate Web Developer from <span className="text-orange-500">Ranchi</span>
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 reveal-from-right">
                Hello! I'm <span className="font-semibold text-orange-500">Dilkash Raja</span>, a web developer based in the beautiful city of Ranchi, Jharkhand. With a deep passion for creating seamless digital experiences, I've dedicated myself to mastering the art of web development and creating visually stunning, interactive websites.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400 reveal-from-right">
                I specialize in building responsive websites and applications using modern technologies like React, JavaScript, HTML, and CSS. My approach combines technical expertise with creative problem-solving to deliver solutions that not only look great but also provide exceptional user experiences with smooth animations and intuitive interfaces.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400 reveal-from-right">
                When I'm not coding, you can find me exploring Ranchi's natural landscapes, contributing to the local tech community, or experimenting with new animation techniques and web technologies to stay at the cutting edge of development.
              </p>
              
              <div className="pt-6 flex space-x-4">
                <a 
                  href="#contact" 
                  className="btn-primary group relative overflow-hidden"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.3
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.3
                    });
                  }}
                >
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform">Get In Touch</span>
                  <i className="fas fa-envelope ml-2 relative z-10 group-hover:translate-x-1 transition-transform"></i>
                  <span className="btn-shine"></span>
                </a>
                <a 
                  href={`mailto:${encodeURIComponent('dilkashr690@gmail.com')}`}
                  className="btn-secondary group relative overflow-hidden"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.3
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.3
                    });
                  }}
                >
                  <span className="relative z-10">Email Me</span>
                  <span className="btn-ripple"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div ref={servicesRef} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="service-card bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md transition-all duration-500 transform hover:shadow-xl">
            <div className="mb-6 text-orange-500 service-icon transform-gpu transition-transform duration-500">
              <i className="fas fa-laptop-code text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-4 font-poppins transition-colors duration-300">Web Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating responsive, user-friendly websites with modern animations that work flawlessly across all devices and browsers.
            </p>
            <div className="mt-6 w-12 h-1 bg-orange-500 rounded-full transform transition-all duration-300 hover:w-20"></div>
          </div>
          
          <div className="service-card bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md transition-all duration-500 transform hover:shadow-xl">
            <div className="mb-6 text-orange-500 service-icon transform-gpu transition-transform duration-500">
              <i className="fas fa-mobile-alt text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-4 font-poppins transition-colors duration-300">App Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Building modern web applications with React and other cutting-edge technologies that provide seamless user experiences.
            </p>
            <div className="mt-6 w-12 h-1 bg-orange-500 rounded-full transform transition-all duration-300 hover:w-20"></div>
          </div>
          
          <div className="service-card bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md transition-all duration-500 transform hover:shadow-xl">
            <div className="mb-6 text-orange-500 service-icon transform-gpu transition-transform duration-500">
              <i className="fas fa-paint-brush text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-4 font-poppins transition-colors duration-300">UI/UX Design</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating intuitive user interfaces with stunning animations and enjoyable user experiences that engage and delight visitors.
            </p>
            <div className="mt-6 w-12 h-1 bg-orange-500 rounded-full transform transition-all duration-300 hover:w-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import { FC, useState, useRef, FormEvent, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const infoContainerRef = useRef<HTMLDivElement>(null);
  const socialIconsRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

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
          { width: '0%' },
          {
            width: '100%',
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }
    
    // Form animation
    if (formContainerRef.current) {
      const formElements = formContainerRef.current.querySelectorAll('input, textarea, button');
      const formLabels = formContainerRef.current.querySelectorAll('label');
      
      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formContainerRef.current,
            start: 'top 75%',
          }
        }
      );
      
      gsap.fromTo(
        formLabels,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formContainerRef.current,
            start: 'top 75%',
          }
        }
      );
      
      gsap.fromTo(
        formElements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formContainerRef.current,
            start: 'top 75%',
          }
        }
      );
    }
    
    // Info container animation
    if (infoContainerRef.current) {
      const infoItems = infoContainerRef.current.querySelectorAll('.contact-info-item');
      
      gsap.fromTo(
        infoContainerRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoContainerRef.current,
            start: 'top 75%',
          }
        }
      );
      
      gsap.fromTo(
        infoItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          delay: 0.3,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: infoContainerRef.current,
            start: 'top 75%',
          }
        }
      );
    }
    
    // Social icons animation
    if (socialIconsRef.current) {
      const icons = socialIconsRef.current.querySelectorAll('a');
      
      gsap.fromTo(
        icons,
        { opacity: 0, scale: 0, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: socialIconsRef.current,
            start: 'top 85%',
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Input focus animations
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const icon = e.currentTarget.parentElement?.querySelector('i');
    if (icon) {
      gsap.to(icon, {
        scale: 1.2,
        color: '#f97316',
        duration: 0.3
      });
    }
    
    gsap.to(e.currentTarget, {
      boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.25)',
      borderColor: '#f97316',
      duration: 0.3
    });
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const icon = e.currentTarget.parentElement?.querySelector('i');
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        color: '#9ca3af',
        duration: 0.3
      });
    }
    
    gsap.to(e.currentTarget, {
      boxShadow: 'none',
      borderColor: '',
      duration: 0.3
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      
      // Shake the form to indicate error
      if (formRef.current) {
        gsap.to(formRef.current, {
          keyframes: {
            x: [-10, 10, -10, 10, -5, 5, -2, 2, 0]
          },
          duration: 0.6,
          ease: "power1.inOut"
        });
      }
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/contact', formData);
      
      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
      });
      
      // Success animation
      setFormSuccess(true);
      
      if (formRef.current) {
        const formElements = formRef.current.querySelectorAll('input, textarea, button');
        
        gsap.to(formElements, {
          opacity: 0,
          y: -20,
          stagger: 0.05,
          duration: 0.4,
          onComplete: () => {
            // Reset form
            setFormData({
              name: '',
              email: '',
              subject: '',
              message: ''
            });
            
            // Show success message with animation
            const successMessage = document.createElement('div');
            successMessage.className = 'text-center py-10';
            successMessage.innerHTML = `
              <div class="text-green-500 text-5xl mb-4">
                <i class="fas fa-check-circle animate__animated animate__bounceIn"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Thanks for reaching out. I'll get back to you soon.</p>
              <button class="btn-primary mt-4" id="reset-form">Send Another Message</button>
            `;
            
            // Replace form content
            if (formRef.current) {
              formRef.current.innerHTML = '';
              formRef.current.appendChild(successMessage);
              
              // Animate the success message
              gsap.fromTo(
                successMessage.children,
                { opacity: 0, y: 20 },
                { 
                  opacity: 1, 
                  y: 0, 
                  stagger: 0.1,
                  duration: 0.6,
                  ease: "power3.out"
                }
              );
              
              // Reset button functionality
              const resetButton = document.getElementById('reset-form');
              if (resetButton) {
                resetButton.addEventListener('click', () => {
                  setFormSuccess(false);
                  location.reload(); // Simple reload to reset everything
                });
              }
            }
          }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
      
      // Error shake animation
      if (formRef.current) {
        gsap.to(formRef.current, {
          keyframes: {
            x: [-10, 10, -10, 10, -5, 5, -2, 2, 0]
          },
          duration: 0.6,
          ease: "power1.inOut"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social icon hover animations
  const socialIconHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      y: -5,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      duration: 0.3,
      ease: "power2.out"
    });
  };
  
  const socialIconLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      boxShadow: 'none',
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 dark:bg-orange-900/10 opacity-50 -skew-x-12 transform-gpu hidden lg:block"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 ref={headingRef} className="text-3xl md:text-5xl font-bold font-poppins mb-4 relative inline-block">
            Get In Touch
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-orange-500 rounded transform"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you!
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div ref={formContainerRef} className="lg:w-1/2 reveal-from-left">
            <form 
              ref={formRef} 
              onSubmit={handleSubmit} 
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-user mr-2 text-orange-500"></i>Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400 transition-all duration-300"></i>
                  </div>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-3.5 transition-all duration-300 border border-gray-300 dark:border-gray-600 input-animated"
                    placeholder="Your Name" 
                    required 
                  />
                  <div className="input-highlight"></div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-envelope mr-2 text-orange-500"></i>Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 transition-all duration-300"></i>
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-3.5 transition-all duration-300 border border-gray-300 dark:border-gray-600 input-animated"
                    placeholder="your.email@example.com" 
                    required 
                  />
                  <div className="input-highlight"></div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-pen mr-2 text-orange-500"></i>Subject
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-pen text-gray-400 transition-all duration-300"></i>
                  </div>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-3.5 transition-all duration-300 border border-gray-300 dark:border-gray-600 input-animated"
                    placeholder="What's this about?" 
                  />
                  <div className="input-highlight"></div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-comment mr-2 text-orange-500"></i>Message
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-3.5 transition-all duration-300 border border-gray-300 dark:border-gray-600 input-animated"
                  placeholder="Tell me about your project or ask me anything..." 
                  required
                ></textarea>
                <div className="input-highlight"></div>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary w-full relative overflow-hidden group"
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  const button = e.currentTarget;
                  gsap.to(button, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power1.out"
                  });
                }}
                onMouseLeave={(e) => {
                  const button = e.currentTarget;
                  gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power1.out"
                  });
                }}
              >
                <span className={`relative z-10 transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100 group-hover:tracking-wider'}`}>
                  Send Message <i className="fas fa-paper-plane ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </span>
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin text-xl"></i>
                  </span>
                )}
                <span className="btn-shine"></span>
              </button>
            </form>
          </div>
          
          <div ref={infoContainerRef} className="lg:w-1/2 reveal-from-right">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold font-poppins mb-8 relative inline-block">
                  Contact Information
                  <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500 rounded"></span>
                </h3>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-6 contact-info-item">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">Location</h4>
                      <p className="text-gray-600 dark:text-gray-400">Ranchi, Jharkhand, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6 contact-info-item">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">Email</h4>
                      <a 
                        href="mailto:dilkashr690@gmail.com" 
                        className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            color: '#f97316',
                            x: 5,
                            duration: 0.3
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            color: '',
                            x: 0,
                            duration: 0.3
                          });
                        }}
                      >
                        dilkashr690@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6 contact-info-item">
                    <div className="contact-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">Phone</h4>
                      <a 
                        href="tel:+919955478552" 
                        className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            color: '#f97316',
                            x: 5,
                            duration: 0.3
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            color: '',
                            x: 0,
                            duration: 0.3
                          });
                        }}
                      >
                        +91 9955478552
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h4 className="font-medium text-lg mb-6 relative inline-block">
                    Connect With Me
                    <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500 rounded"></span>
                  </h4>
                  <div ref={socialIconsRef} className="flex space-x-4">
                    <a 
                      href="https://github.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon-3d"
                      onMouseEnter={socialIconHover}
                      onMouseLeave={socialIconLeave}
                    >
                      <i className="fab fa-github"></i>
                    </a>
                    <a 
                      href="https://linkedin.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon-3d bg-blue-500"
                      onMouseEnter={socialIconHover}
                      onMouseLeave={socialIconLeave}
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a 
                      href="https://twitter.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon-3d bg-sky-400"
                      onMouseEnter={socialIconHover}
                      onMouseLeave={socialIconLeave}
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a 
                      href={`mailto:${encodeURIComponent('dilkashr690@gmail.com')}`}
                      className="social-icon-3d bg-red-500"
                      onMouseEnter={socialIconHover}
                      onMouseLeave={socialIconLeave}
                    >
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a 
                      href={`tel:${encodeURIComponent('+919955478552')}`}
                      className="social-icon-3d bg-green-500"
                      onMouseEnter={socialIconHover}
                      onMouseLeave={socialIconLeave}
                    >
                      <i className="fas fa-phone"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <div className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-orange-100 dark:border-orange-800/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <div className="flex items-start">
                    <div className="text-orange-500 text-2xl mr-4 mt-1 animate-bounce">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-lg text-gray-800 dark:text-gray-200">
                        Quick Response
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        I usually respond to inquiries within 24 hours. Looking forward to collaborating with you on your next amazing project!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

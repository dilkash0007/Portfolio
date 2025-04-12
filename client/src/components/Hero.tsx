import { FC, useEffect, useRef, useState } from "react";
import ParticleBackground from "./ParticleBackground";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero: FC = () => {
  const typingRef = useRef<HTMLSpanElement>(null);
  const [typingText, setTypingText] = useState("I build responsive websites");
  const heroRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Typing animation
    const texts = [
      "I build responsive websites",
      "I create modern apps",
      "I craft seamless UI/UX",
      "I develop mobile experiences",
    ];
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

    // GSAP animations
    if (heroRef.current) {
      const textElements = heroRef.current.querySelectorAll(".hero-text");

      // Main hero intro animation
      gsap.fromTo(
        textElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );

      // Animate profile picture
      if (profileRef.current) {
        gsap.fromTo(
          profileRef.current,
          { scale: 0.8, opacity: 0, rotate: -5 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 1.2,
            delay: 0.5,
            ease: "elastic.out(1, 0.5)",
          }
        );
      }

      // Animate buttons with bounce effect
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll("a");
        gsap.fromTo(
          buttons,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
          }
        );
      }

      // Animate social icons
      if (socialRef.current) {
        const icons = socialRef.current.querySelectorAll("a");
        gsap.fromTo(
          icons,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            delay: 1.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        );
      }

      // Animate location info
      if (locationRef.current) {
        gsap.fromTo(
          locationRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 2,
            ease: "power3.out",
          }
        );
      }
    }

    return () => clearTimeout(typingTimer);
  }, []);

  // Button hover effect
  const buttonHoverEffect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    gsap.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const buttonLeaveEffect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    gsap.to(button, {
      scale: 1,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <ParticleBackground />
      <div
        className="container mx-auto px-4 sm:px-6 py-12 md:py-24 relative z-10"
        ref={heroRef}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-orange-500 font-medium font-poppins text-base sm:text-lg md:text-xl mb-2 hero-text animate__animated animate__fadeInDown">
                Hello, I'm
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight text-gray-800 dark:text-gray-100 hero-text animate__animated animate__fadeInLeft">
                Dilkash Raja
              </h1>
              <div className="relative">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 hero-text overflow-hidden">
                  <span ref={typingRef} className="typing inline-block">
                    {typingText}
                  </span>
                  <span className="cursor-blink"></span>
                </h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-lg hero-text animate__animated animate__fadeIn">
                A passionate web developer from Ranchi, India, transforming
                ideas into elegant digital experiences. I specialize in creating
                responsive, modern, and user-friendly applications with
                impressive animations.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-3 sm:gap-4 hero-text"
              ref={buttonsRef}
            >
              <a
                href="#projects"
                className="btn-primary relative overflow-hidden text-sm sm:text-base"
                onMouseEnter={buttonHoverEffect}
                onMouseLeave={buttonLeaveEffect}
              >
                <span className="relative z-10">View My Work</span>
                <i className="fas fa-arrow-right ml-2 relative z-10"></i>
                <span className="btn-shine"></span>
              </a>
              <a
                href="#contact"
                className="btn-secondary relative overflow-hidden text-sm sm:text-base"
                onMouseEnter={buttonHoverEffect}
                onMouseLeave={buttonLeaveEffect}
              >
                <span className="relative z-10">Contact Me</span>
                <span className="btn-ripple"></span>
              </a>
            </div>

            <div
              className="flex space-x-3 sm:space-x-4 pt-4 sm:pt-6 hero-text"
              ref={socialRef}
            >
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-container"
              >
                <i className="fab fa-github text-lg sm:text-xl social-icon"></i>
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-container"
              >
                <i className="fab fa-linkedin text-lg sm:text-xl social-icon"></i>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-container"
              >
                <i className="fab fa-twitter text-lg sm:text-xl social-icon"></i>
              </a>
              <a
                href={`mailto:${encodeURIComponent("dilkashr690@gmail.com")}`}
                className="social-icon-container"
              >
                <i className="fas fa-envelope text-lg sm:text-xl social-icon"></i>
              </a>
              <a
                href={`tel:${encodeURIComponent("+919955478552")}`}
                className="social-icon-container"
              >
                <i className="fas fa-phone text-lg sm:text-xl social-icon"></i>
              </a>
            </div>
          </div>

          <div
            className="w-full md:w-1/3 mt-10 md:mt-0 flex justify-center items-center hero-text"
            ref={profileRef}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden profile-image-container">
                <img
                  className="w-full h-full object-cover profile-image"
                  src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=500&q=80"
                  alt="Dilkash Raja - Web Developer"
                />
                <div className="profile-image-overlay"></div>
              </div>
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                <i className="fas fa-code mr-1"></i> Hire Me
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-0 right-0 flex justify-center hero-text px-4 text-center"
          ref={locationRef}
        >
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 location-badge">
            <i className="fas fa-map-marker-alt text-orange-500 animate-pulse"></i>
            <span>
              Ranchi, Jharkhand, India | Building digital experiences for the
              world
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator animate__animated animate__fadeIn animate__delay-2s">
          <span className="scroll-indicator-text text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Scroll
          </span>
          <div className="scroll-indicator-line"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

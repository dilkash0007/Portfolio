import { gsap } from 'gsap';

// Animation for fade-in elements
export const fadeInAnimation = (element: Element, delay: number = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out'
    }
  );
};

// Animation for staggered elements
export const staggeredAnimation = (elements: Element[], stagger: number = 0.2) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger,
      ease: 'power3.out'
    }
  );
};

// Animation for skill progress bars
export const animateProgressBars = (elements: NodeListOf<Element>) => {
  elements.forEach(bar => {
    bar.classList.add('animate');
  });
};

// Animation for typing effect
export const typeText = (
  element: HTMLElement, 
  texts: string[], 
  options = { 
    startDelay: 1000, 
    deleteDelay: 1000, 
    typeSpeed: 100,
    deleteSpeed: 50,
    waitBetween: 500
  }
) => {
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = options.typeSpeed;

  const type = () => {
    const current = texts[currentIndex];
    
    if (isDeleting) {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = options.deleteSpeed;
    } else {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = options.typeSpeed;
    }
    
    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingDelay = options.deleteDelay;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % texts.length;
      typingDelay = options.waitBetween;
    }
    
    setTimeout(type, typingDelay);
  };

  setTimeout(type, options.startDelay);
};

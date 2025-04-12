import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Portfolio from "@/pages/Portfolio";
import { useEffect, useState } from "react";

// Add scroll animation observer function
function setupScrollAnimations() {
  // Check if IntersectionObserver is available
  if ('IntersectionObserver' in window) {
    // Create the observer instance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If element is visible
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Trigger when at least 15% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
    });

    // Observe all elements with reveal-from-* classes
    const revealElements = document.querySelectorAll(
      '.reveal-from-left, .reveal-from-right, .reveal-from-bottom, .reveal-scale'
    );
    
    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers without intersection observer support
    const revealElements = document.querySelectorAll(
      '.reveal-from-left, .reveal-from-right, .reveal-from-bottom, .reveal-scale'
    );
    
    revealElements.forEach(element => {
      element.classList.add('reveal-active');
    });
  }
}

function Router() {
  // Theme state management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    // Initialize scroll animations when the component mounts
    setupScrollAnimations();
    
    // Set up a timer to check for new elements that might need animations
    const animationCheckInterval = setInterval(() => {
      setupScrollAnimations();
    }, 1000); // Check every second
    
    // Clean up interval on unmount
    return () => clearInterval(animationCheckInterval);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Switch>
      <Route path="/" component={() => <Portfolio theme={theme} toggleTheme={toggleTheme} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;

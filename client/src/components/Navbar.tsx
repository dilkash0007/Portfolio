import { FC, useState, useEffect } from 'react';
import { Link } from 'wouter';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 transition-all duration-300 
                     ${scrolled ? 'shadow-md py-2' : 'py-3'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-poppins text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span className="text-orange-500">&lt;</span>Rahul Dev<span className="text-orange-500">/&gt;</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#about" className="hover:text-orange-500 transition-colors duration-300 relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#projects" className="hover:text-orange-500 transition-colors duration-300 relative group">
              Projects
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#skills" className="hover:text-orange-500 transition-colors duration-300 relative group">
              Skills
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-orange-500 transition-colors duration-300 relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
          </div>
          
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-500 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden pt-4 pb-2 space-y-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <a href="#about" className="block py-2 hover:text-orange-500 transition-colors" onClick={closeMobileMenu}>About</a>
          <a href="#projects" className="block py-2 hover:text-orange-500 transition-colors" onClick={closeMobileMenu}>Projects</a>
          <a href="#skills" className="block py-2 hover:text-orange-500 transition-colors" onClick={closeMobileMenu}>Skills</a>
          <a href="#contact" className="block py-2 hover:text-orange-500 transition-colors" onClick={closeMobileMenu}>Contact</a>
          <div className="py-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
              <span className="ml-2">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

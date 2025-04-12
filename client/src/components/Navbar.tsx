import { FC, useState, useEffect } from "react";
import { Link } from "wouter";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Navbar: FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    const newMenuState = !mobileMenuOpen;
    setMobileMenuOpen(newMenuState);

    // Toggle body class to prevent scrolling when menu is open
    if (newMenuState) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove("mobile-menu-open");
  };

  // Close mobile menu on resize if it gets into desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  // Clean up body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, []);

  return (
    <nav
      className={`fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 transition-all duration-300 
                     ${scrolled ? "shadow-md py-1.5 sm:py-2" : "py-2 sm:py-3"}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold font-poppins text-blue-700 dark:text-blue-300 flex items-center gap-1.5 sm:gap-2"
          >
            <span className="text-orange-500">&lt;</span>Rahul Dev
            <span className="text-orange-500">/&gt;</span>
          </Link>

          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <a
              href="#about"
              className="text-sm lg:text-base hover:text-orange-500 transition-colors duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#projects"
              className="text-sm lg:text-base hover:text-orange-500 transition-colors duration-300 relative group"
            >
              Projects
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#skills"
              className="text-sm lg:text-base hover:text-orange-500 transition-colors duration-300 relative group"
            >
              Skills
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#contact"
              className="text-sm lg:text-base hover:text-orange-500 transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Theme"
            >
              <i
                className={`fas ${
                  theme === "light" ? "fa-moon" : "fa-sun"
                } text-base sm:text-lg`}
              ></i>
            </button>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-1.5 text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-500 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            <i
              className={`fas ${
                mobileMenuOpen ? "fa-times" : "fa-bars"
              } text-lg sm:text-xl`}
            ></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 md:hidden pt-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-40 transition-all duration-300 transform 
                      ${
                        mobileMenuOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-full opacity-0 pointer-events-none"
                      }`}
        >
          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            <a
              href="#about"
              className="block py-3 px-6 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              About
            </a>
            <a
              href="#projects"
              className="block py-3 px-6 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Projects
            </a>
            <a
              href="#skills"
              className="block py-3 px-6 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Skills
            </a>
            <a
              href="#contact"
              className="block py-3 px-6 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              onClick={closeMobileMenu}
            >
              Contact
            </a>
            <button
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              className="mt-4 py-3 px-6 w-full rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center space-x-2 font-medium"
              aria-label="Toggle Theme"
            >
              <i
                className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}
              ></i>
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

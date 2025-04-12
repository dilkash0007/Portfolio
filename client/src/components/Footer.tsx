import { FC } from 'react';
import { Link } from 'wouter';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-2xl font-bold font-poppins flex items-center gap-2">
              <span className="text-orange-500">&lt;</span>Rahul Dev<span className="text-orange-500">/&gt;</span>
            </Link>
            <p className="mt-2 text-gray-400 max-w-md">
              A passionate web developer from Ranchi, India, creating beautiful and functional digital experiences.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-8">
            <a href="#about" className="hover:text-orange-500 transition-colors duration-300">About</a>
            <a href="#projects" className="hover:text-orange-500 transition-colors duration-300">Projects</a>
            <a href="#skills" className="hover:text-orange-500 transition-colors duration-300">Skills</a>
            <a href="#contact" className="hover:text-orange-500 transition-colors duration-300">Contact</a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Rahul Dev. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://dribbble.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-dribbble"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

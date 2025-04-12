import { FC } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParallaxSection from "@/components/ParallaxSection";
import ParticleTextMorphing from "@/components/ParticleTextMorphing";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import SkillsVisualization from "@/components/SkillsVisualization";
import ThreeJSBackground from "@/components/ThreeJSBackground";

interface PortfolioProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Portfolio: FC<PortfolioProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic 3D background with particles */}
      <ThreeJSBackground theme={theme} />

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 w-full">
        <Hero />
        <ParticleTextMorphing />
        <About />
        <ParallaxSection />
        <Projects />
        <InteractiveTimeline />
        <SkillsVisualization />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;

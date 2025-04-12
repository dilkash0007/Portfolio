import { FC, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  categories: string[];
  techs: string[];
  demo: string;
  code: string;
}

const Projects: FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "A full-featured online store with product filtering, cart functionality, and secure checkout integration. Built with React, Node.js, and MongoDB.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      categories: ["react", "ui"],
      techs: ["React", "Node.js"],
      demo: "#",
      code: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A productivity application for task management with drag-and-drop functionality, labels, and deadlines. Uses JavaScript and Firebase.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      categories: ["javascript"],
      techs: ["JavaScript", "Firebase"],
      demo: "#",
      code: "#",
    },
    {
      id: 3,
      title: "Travel Explorer",
      description:
        "A travel destination explorer with interactive maps, curated travel guides, and booking integration. Built with React and Tailwind CSS.",
      image:
        "https://images.unsplash.com/photo-1561736778-92e52a7769ef?auto=format&fit=crop&w=800&q=80",
      categories: ["react", "ui"],
      techs: ["React", "Tailwind"],
      demo: "#",
      code: "#",
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description:
        "An interactive weather application showing current conditions and forecasts with beautiful visualizations. Uses JavaScript and Weather API.",
      image:
        "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80",
      categories: ["javascript", "ui"],
      techs: ["JavaScript", "API"],
      demo: "#",
      code: "#",
    },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.categories.includes(activeFilter));

  // Set up animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading animation
    if (headingRef.current) {
      const headingLine = headingRef.current.querySelector("span");

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
          },
        }
      );

      if (headingLine) {
        gsap.fromTo(
          headingLine,
          { width: "0%", left: "50%" },
          {
            width: "100%",
            left: "0%",
            duration: 1,
            delay: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }

    // Filter buttons animation
    if (filterRef.current) {
      const buttons = filterRef.current.querySelectorAll("button");

      gsap.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: {
            trigger: filterRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Project cards animation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
    });

    timeline.fromTo(
      ".project-card",
      {
        y: 50,
        opacity: 0,
        rotateY: 5,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [activeFilter]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 sm:py-20 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins mb-3 sm:mb-4 relative inline-block"
          >
            My Projects
            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded transform"></span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here's a selection of projects I've worked on. Each demonstrates
            different skills and technologies.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 flex justify-center">
          <div
            ref={filterRef}
            className="flex flex-wrap justify-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 m-0.5 rounded-md text-xs sm:text-sm font-medium transition ${
                activeFilter === "all"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 m-0.5 rounded-md text-xs sm:text-sm font-medium transition ${
                activeFilter === "react"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveFilter("react")}
            >
              React
            </button>
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 m-0.5 rounded-md text-xs sm:text-sm font-medium transition ${
                activeFilter === "javascript"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveFilter("javascript")}
            >
              JavaScript
            </button>
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 m-0.5 rounded-md text-xs sm:text-sm font-medium transition ${
                activeFilter === "ui"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveFilter("ui")}
            >
              UI/UX
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative overflow-hidden h-44 sm:h-48 md:h-52">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  {project.techs.map((tech, index) => (
                    <span
                      key={index}
                      className={`inline-block ${
                        index === 0 ? "bg-orange-500" : "bg-blue-600"
                      } text-white px-2 py-1 text-xs rounded font-medium ${
                        index > 0 ? "ml-2" : ""
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 font-poppins">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex space-x-3">
                  <a
                    href={project.demo}
                    className="inline-flex items-center text-xs sm:text-sm text-white bg-orange-500 hover:bg-orange-600 transition-colors px-3 py-1 rounded-md"
                  >
                    <i className="fas fa-external-link-alt mr-1.5"></i> Live
                    Demo
                  </a>
                  <a
                    href={project.code}
                    className="inline-flex items-center text-xs sm:text-sm text-white bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1 rounded-md"
                  >
                    <i className="fas fa-code mr-1.5"></i> View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <i className="fab fa-github mr-2"></i>
            <span>See More on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;

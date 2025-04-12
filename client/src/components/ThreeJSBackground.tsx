import React, { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeJSBackgroundProps {
  theme: "light" | "dark";
}

const ThreeJSBackground: FC<ThreeJSBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points[]>([]);
  const frameIdRef = useRef<number>(0);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
    });
    rendererRef.current = renderer;

    // Configure renderer
    renderer.setPixelRatio(isMobile ? 1 : window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    // Create particle groups
    const createParticleSystem = (
      count: number,
      size: number,
      color: THREE.Color,
      speed: number
    ) => {
      // Reduce particle count on mobile devices
      const adjustedCount = isMobile ? Math.floor(count * 0.4) : count;

      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(adjustedCount * 3);
      const velocities = new Float32Array(adjustedCount * 3);

      for (let i = 0; i < adjustedCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 100; // x
        positions[i + 1] = (Math.random() - 0.5) * 100; // y
        positions[i + 2] = (Math.random() - 0.5) * 100; // z

        // Velocity
        velocities[i] = (Math.random() - 0.5) * speed; // vx
        velocities[i + 1] = (Math.random() - 0.5) * speed; // vy
        velocities[i + 2] = (Math.random() - 0.5) * speed; // vz
      }

      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particles.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );

      // Create particle material - reduced size on mobile
      const particleMaterial = new THREE.PointsMaterial({
        color,
        size: isMobile ? size * 0.8 : size,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      // Create points system
      const points = new THREE.Points(particles, particleMaterial);
      scene.add(points);
      return points;
    };

    // Create particle groups with colors based on theme
    const primaryColor =
      theme === "dark" ? new THREE.Color(0xf97316) : new THREE.Color(0xf97316);
    const secondaryColor =
      theme === "dark" ? new THREE.Color(0x3b82f6) : new THREE.Color(0x3b82f6);
    const tertiaryColor =
      theme === "dark" ? new THREE.Color(0xffffff) : new THREE.Color(0x1a1a1a);

    const particleGroups = [
      createParticleSystem(200, 0.15, primaryColor, 0.01), // Small orange particles
      createParticleSystem(100, 0.2, secondaryColor, 0.015), // Medium blue particles
      createParticleSystem(50, 0.1, tertiaryColor, 0.02), // Small contrast particles
    ];

    pointsRef.current = particleGroups;

    // Handle mouse/touch movement for interactivity
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mousePosition.current = {
          x: (event.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: -(event.touches[0].clientY / window.innerHeight) * 2 + 1,
        };
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        const camera = cameraRef.current;
        const renderer = rendererRef.current;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Update pixel ratio based on device
        const newIsMobile = window.innerWidth < 768;
        renderer.setPixelRatio(
          newIsMobile ? 1 : window.devicePixelRatio > 1 ? 2 : 1
        );
      }
    };

    // Animation loop - use less frequent updates on mobile
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Update less frequently on mobile for better performance
      const skipFrames = isMobile && frameIdRef.current % 2 !== 0;
      if (skipFrames) return;

      // Update particles
      pointsRef.current.forEach((points, groupIndex) => {
        const positions = points.geometry.attributes.position
          .array as Float32Array;
        const velocities = points.geometry.attributes.velocity
          .array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          // Update position based on velocity
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Check boundaries and flip velocity if needed
          if (Math.abs(positions[i]) > 50) {
            velocities[i] *= -1;
          }
          if (Math.abs(positions[i + 1]) > 50) {
            velocities[i + 1] *= -1;
          }
          if (Math.abs(positions[i + 2]) > 50) {
            velocities[i + 2] *= -1;
          }

          // Add slight influence from mouse position - reduced on mobile
          const mouseInfluence =
            0.00005 * (groupIndex + 1) * (isMobile ? 0.5 : 1);
          velocities[i] += mousePosition.current.x * mouseInfluence;
          velocities[i + 1] += mousePosition.current.y * mouseInfluence;
        }

        // Update the geometry
        points.geometry.attributes.position.needsUpdate = true;

        // Add gentle rotation to each group - reduced on mobile
        const rotationFactor = isMobile ? 0.00005 : 0.0001;
        points.rotation.x += rotationFactor * (groupIndex + 1);
        points.rotation.y += rotationFactor * (groupIndex + 1);
      });

      renderer.render(scene, camera);
    };

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameIdRef.current);
      pointsRef.current.forEach((points) => {
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
      });
      scene.clear();
      renderer.dispose();
    };
  }, [theme, isMobile]);

  // Update particles when theme changes
  useEffect(() => {
    if (sceneRef.current && pointsRef.current.length > 0) {
      const primaryColor =
        theme === "dark"
          ? new THREE.Color(0xf97316)
          : new THREE.Color(0xf97316);
      const secondaryColor =
        theme === "dark"
          ? new THREE.Color(0x3b82f6)
          : new THREE.Color(0x3b82f6);
      const tertiaryColor =
        theme === "dark"
          ? new THREE.Color(0xffffff)
          : new THREE.Color(0x1a1a1a);

      (pointsRef.current[0].material as THREE.PointsMaterial).color =
        primaryColor;
      (pointsRef.current[1].material as THREE.PointsMaterial).color =
        secondaryColor;
      (pointsRef.current[2].material as THREE.PointsMaterial).color =
        tertiaryColor;
    }
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ThreeJSBackground;

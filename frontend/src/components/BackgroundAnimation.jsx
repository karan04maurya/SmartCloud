import React, { useMemo, useCallback } from 'react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '../contexts/ThemeContext';

const BackgroundAnimation = () => {
  const { isDarkMode } = useTheme();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        grab: {
          distance: 140,
          links: {
            opacity: 0.8,
          }
        },
      },
    },
    particles: {
      color: {
        value: isDarkMode ? "#818cf8" : "#4f46e5",
      },
      links: {
        color: isDarkMode ? "#4f46e5" : "#c7d2fe",
        distance: 150,
        enable: true,
        opacity: isDarkMode ? 0.3 : 0.4,
        width: 1.5,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 800,
          height: 800,
        },
        value: 100,
      },
      opacity: {
        value: isDarkMode ? 0.4 : 0.6,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), [isDarkMode]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-auto -z-10 transition-colors duration-300">
      <ParticlesProvider init={particlesInit}>
        <Particles
          id="tsparticles"
          options={options}
          className="w-full h-full"
        />
      </ParticlesProvider>
    </div>
  );
};

export default BackgroundAnimation;

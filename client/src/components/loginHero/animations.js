// animations.js

// Premium easing (similar to Apple/Framer feel)
export const easeLux = [0.45, 0, 0.2, 1];

/* ===============================
   PHONE FLOAT
================================ */

export const phoneFloat = {
  animate: {
    y: [0, -10, 0],
    rotate: [-0.5, 0.5, -0.5],
  },
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: easeLux,
  },
};

/* ===============================
   GLOW PULSE
================================ */

export const glowPulse = {
  animate: {
    opacity: [0.35, 0.6, 0.35],
    scale: [1, 1.04, 1],
  },
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: easeLux,
  },
};

/* ===============================
   FLOATING FOOD
================================ */

export const foodFloat = ({
  distance = 12,
  rotate = 5,
  duration = 7,
  delay = 0,
} = {}) => ({
  animate: {
    x: [0, distance * 0.35, 0],
    y: [0, -distance, 0],
    rotate: [-rotate, rotate, -rotate],
    scale: [1, 1.02, 1],
  },

  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: easeLux,
  },
});

/* ===============================
   SPARKLES
================================ */

export const sparkleFloat = ({
  duration = 5,
  delay = 0,
} = {}) => ({
  animate: {
    opacity: [0.15, 0.45, 0.15],
    scale: [1, 1.15, 1],
    y: [0, -6, 0],
  },

  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: easeLux,
  },
});

/* ===============================
   FADE UP
================================ */

export const fadeUp = {
  initial: {
    opacity: 0,
    y: 18,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.8,
    ease: easeLux,
  },
};

/* ===============================
   STAGGER
================================ */

export const staggerContainer = {
  initial: {},

  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};
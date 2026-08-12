export const EASE_OUT = [0.25, 0.1, 0.25, 1];

export const fadeUp = (index = 0, delayStep = 0.05) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: {
    duration: 0.35,
    delay: index * delayStep,
    ease: EASE_OUT,
  },
});

export const cardHover = {
  whileHover: { y: -4 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18, ease: EASE_OUT },
};

export const modalPanel = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.98 },
  transition: { duration: 0.22, ease: EASE_OUT },
};

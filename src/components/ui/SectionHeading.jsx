import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../../libs/motion";

const SectionHeading = ({
  badge,
  title,
  subtitle,
  center = true,
  home = false,
}) => (
  <motion.div
    {...fadeUp(0, 0)}
    className={`mb-12 lg:mb-16 ${
      center ? "flex flex-col items-center text-center" : ""
    }`}
  >
    {badge && (
      <span
        className="
          inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4
          bg-primary/10 text-primary border border-primary/20
          dark:bg-dark-primary/10 dark:text-dark-primary dark:border-dark-primary/20
        "
      >
        {badge}
      </span>
    )}

    <h2
      className={`
        font-heading font-bold
        text-foreground dark:text-dark-foreground
        ${
          home
            ? "text-4xl md:text-5xl lg:text-6xl"
            : "text-3xl md:text-4xl lg:text-5xl"
        }
      `}
    >
      {title}
    </h2>

    {subtitle && (
      <p
        className={`
          mt-4 text-base lg:text-lg leading-relaxed
          text-muted-foreground dark:text-dark-muted-foreground
          ${center ? "max-w-2xl" : ""}
        `}
      >
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
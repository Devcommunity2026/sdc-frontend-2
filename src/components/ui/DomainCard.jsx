import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import iconMap from "../../data/iconMap";
import { cardHover, fadeUp } from "../../libs/motion";

const DomainCard = ({ domain, index, center = false }) => {
  const Icon = iconMap[domain.icon] || Globe;

  return (
    <motion.div
      {...fadeUp(index, 0.08)}
      {...cardHover}
      className={`
        group rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all cursor-default
        bg-card text-card-foreground border-border
        dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border
        ${center ? "flex flex-col items-center text-center" : ""}
      `}
    >

      {/* Icon */}
      {domain.icon && <div
        className={`
          w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
          ${domain.color === "purple"
            ? "bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground"
            : "bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground"
          }
        `}
      >
        <Icon size={26} />
      </div>}

      {domain.iconText && <div
        className={` gradient w-14 h-14 rounded-xl text-4xl font-semibold  flex items-center  mb-4 transition-all duration-300`}
      >
        {domain.iconText}
      </div>}

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
        {domain.title}
      </h3>

      {/* Description */}
      <p
        className={`
          text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground
          ${center ? "max-w-xs" : ""}
        `}
      >
        {domain.description}
      </p>
    </motion.div>
  );
};

export default DomainCard;
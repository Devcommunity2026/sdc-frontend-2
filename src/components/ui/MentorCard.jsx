import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";
import { cardHover, fadeUp } from "../../libs/motion";

const MentorCard = ({ mentor, index }) => {
  return (
    <motion.div
      {...fadeUp(index, 0.06)}
      {...cardHover}
      className="
        relative overflow-hidden rounded-3xl
        max-w-sm mx-auto w-full
        border shadow-sm transition-all duration-300
        bg-card text-card-foreground border-border
        hover:shadow-xl hover:border-primary/40
        dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border dark:hover:border-dark-primary/40
      "
    >

      {/* Card Content */}
      <div className="px-5 pt-8 pb-6 text-center">
        {/* Profile Image */}
        <div className="relative w-fit mx-auto mb-4">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="
              w-24 h-24 rounded-full object-cover
              border-[3px]
              border-primary
              shadow-lg
            "
          />

          {/* LinkedIn Button */}
          <a
            href={mentor.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="
              absolute bottom-0 right-0
              w-8 h-8 rounded-full
              flex items-center justify-center
              bg-primary text-white
              shadow-md
              hover:scale-110 transition-all
            "
          >
            <FaLinkedinIn size={14} />
          </a>
        </div>

        {/* Name */}
        <h2
          className="
            text-xl font-bold mb-2
            text-foreground dark:text-dark-foreground
          "
        >
          {mentor.name}
        </h2>

        {/* Position */}
        {mentor.Position && (
          <p
            className="
              text-primary dark:text-dark-primary
              font-medium text-sm mb-3
            "
          >
            {mentor.Position}
          </p>
        )}

        {/* Role Description */}
        <p
          className="
            text-sm leading-relaxed
            text-muted-foreground
            dark:text-dark-muted-foreground
          "
        >
          {mentor.description}
        </p>
      </div>
    </motion.div>
  );
};

export default MentorCard;
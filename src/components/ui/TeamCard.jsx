import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { cardHover, fadeUp } from "../../libs/motion";

const TeamCard = ({ member, index = 0, disableFade = false }) => {
  const motionProps = disableFade
    ? cardHover
    : { ...fadeUp(index, 0.05), ...cardHover };

  return (
    <motion.div
      {...motionProps}
      className="group relative h-full select-none"
    >
      {/* Glow */}
      <div
        className="
          absolute inset-0 rounded-3xl blur-xl opacity-0
          group-hover:opacity-100 transition-all duration-500
          bg-primary/20
        "
      />

      {/* Card */}
      <div
        className="
          relative overflow-hidden rounded-3xl border
          bg-card text-card-foreground border-border
          dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border
          shadow-sm hover:shadow-xl transition-all duration-300
        "
      >
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-primary dark:bg-dark-primary" />

        {/* Content */}
        <div className="px-6 py-8 flex flex-col items-center text-center">

          {/* Profile Image */}
          <div className="relative mb-5">

            <div
              className="
                w-24 h-24 rounded-full overflow-hidden
                border-[3px] border-primary
                shadow-lg
              "
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online Dot */}
            <span
              className="
                absolute bottom-1 right-1
                w-4 h-4 rounded-full
                bg-green-500 border-2 border-white
              "
            />
          </div>

          {/* Name */}
          <h3
            className="
              text-lg font-bold mb-2
              text-foreground dark:text-dark-foreground
            "
          >
            {member.name}
          </h3>

          {/* Post */}
          <span
            className="
              inline-flex items-center gap-2
              px-4 py-1.5 rounded-full
              text-xs font-semibold mb-5
              bg-primary/10 text-primary
            "
          >
            <span className="w-2 h-2 rounded-full bg-primary" />

            {member.post}
          </span>

          {/* Divider */}
          <div className="w-full h-px bg-border dark:bg-dark-border mb-5" />

          {/* LinkedIn */}
          <motion.a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              flex items-center gap-2
              px-5 py-2 rounded-full border text-sm font-semibold
              transition-all duration-300
              border-primary text-primary
              hover:bg-primary hover:text-white
            "
          >
            <FaLinkedin size={14} />

            Connect
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
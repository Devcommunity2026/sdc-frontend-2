import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ContentModal from "./ContentModal";
import { cardHover, fadeUp } from "../../libs/motion";

const ProjectCard = ({ project, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        {...fadeUp(index, 0.06)}
        {...cardHover}
        onClick={() => setOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-dark-border dark:bg-dark-card dark:text-dark-card-foreground dark:hover:shadow-dark-primary/10"
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-6">
          <h2 className="mb-1 text-xl font-bold text-foreground dark:text-dark-foreground">
            {project.name}
          </h2>

          <p className="mb-3 text-sm font-medium text-primary dark:text-dark-primary">
            {project.subHeading}
          </p>

          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground">
            {project.description}
          </p>

          <div className="mb-5 flex flex-wrap gap-2">
            {project.techStack?.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-dark-primary"
              >
                {tech}
              </span>
            ))}
          </div>

          <p className="text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-dark-primary">
            Click to view details →
          </p>
        </div>
      </motion.div>

      <ContentModal open={open} onClose={() => setOpen(false)} maxWidth="max-w-2xl">
        <div className="h-56 w-full shrink-0 bg-muted dark:bg-dark-muted sm:h-72">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="modal-body-scroll custom-scrollbar p-6">
          <h2 className="mb-1 text-xl font-bold leading-snug text-foreground dark:text-dark-foreground sm:text-2xl">
            {project.name}
          </h2>

          {project.subHeading && (
            <p className="mb-4 text-sm font-semibold text-primary dark:text-dark-primary">
              {project.subHeading}
            </p>
          )}

          <p className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground sm:text-base">
            {project.description}
          </p>

          {project.techStack?.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:text-dark-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground"
            >
              <ExternalLink size={18} />
              Live 
            </a>
          )}
        </div>
      </ContentModal>
    </>
  );
};

export default ProjectCard;

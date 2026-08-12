import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Clock } from "lucide-react";
import ContentModal from "./ContentModal";
import { cardHover, fadeUp } from "../../libs/motion";

const EventCard = ({ event, index }) => {
  const [open, setOpen] = useState(false);
  const isEventEnded = new Date(event.date) < new Date();

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <motion.div
        {...fadeUp(index, 0.06)}
        {...cardHover}
        onClick={() => setOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-dark-border dark:bg-dark-card dark:text-dark-card-foreground dark:hover:shadow-dark-primary/10"
      >
        <div className="relative h-52 overflow-hidden bg-muted dark:bg-dark-muted">
          <img
            src={event.thumbnail || event.image}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {isEventEnded && (
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-gray-300 backdrop-blur-sm">
              Ended
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary dark:text-dark-primary">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>

          <h3 className="mb-1 text-base font-semibold leading-snug text-foreground dark:text-dark-foreground">
            {event.name}
          </h3>

          {event.subHeading && (
            <p className="mb-2 text-xs font-medium text-primary/80 dark:text-dark-primary/80">
              {event.subHeading}
            </p>
          )}

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground">
            {event.description}
          </p>

          <p className="mt-3 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-dark-primary">
            Click to read more →
          </p>
        </div>
      </motion.div>

      <ContentModal open={open} onClose={() => setOpen(false)}>
        <div className="h-56 w-full shrink-0 bg-muted dark:bg-dark-muted sm:h-72">
          <img
            src={event.thumbnail || event.image}
            alt={event.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="modal-body-scroll custom-scrollbar p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary dark:text-dark-primary">
            <Calendar size={15} />
            <span>{formattedDate}</span>
          </div>

          <h2 className="mb-1 text-xl font-bold leading-snug text-foreground dark:text-dark-foreground sm:text-2xl">
            {event.name}
          </h2>

          {event.subHeading && (
            <p className="mb-4 text-sm font-semibold text-primary/90 dark:text-dark-primary/90">
              {event.subHeading}
            </p>
          )}

          <p className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground sm:text-base">
            {event.description}
          </p>

          {event.form &&
            (isEventEnded ? (
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-medium text-muted-foreground dark:bg-dark-muted dark:text-dark-muted-foreground"
              >
                <Clock size={16} />
                Event Ended
              </button>
            ) : (
              <a
                href={event.form}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 dark:bg-dark-primary dark:text-dark-primary-foreground"
              >
                Apply Now
                <ExternalLink size={16} />
              </a>
            ))}
        </div>
      </ContentModal>
    </>
  );
};

export default EventCard;

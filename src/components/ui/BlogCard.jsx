import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { cardHover, fadeUp } from "../../libs/motion";

const BlogCard = ({ blog, index, onClick }) => {
  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <motion.div
      {...fadeUp(index, 0.04)}
      {...cardHover}
      onClick={onClick}
      className="group relative flex h-[420px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white text-card-foreground shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5 transition-all duration-300 hover:border-primary/35 hover:shadow-[0_12px_28px_-10px_rgba(37,99,235,0.22)] dark:border-dark-border dark:bg-dark-card dark:text-dark-card-foreground dark:shadow-none dark:ring-white/5 dark:hover:border-dark-primary/45 dark:hover:shadow-lg dark:hover:shadow-dark-primary/10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-dark-muted">
          <img
            src={blog.thumbnail || blog.image}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="absolute left-3 top-3 z-10">
              <span className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary shadow-sm backdrop-blur-md dark:border-dark-border/50 dark:bg-dark-background/85 dark:text-dark-primary">
                {blog.tags[0]}
              </span>
            </div>
          )}

          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-white/95 via-slate-900/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-dark-background/95">
            <span className="flex items-center gap-1 text-xs font-semibold text-primary dark:text-dark-primary">
              Read Article
              <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>

        <div className="flex flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground dark:text-dark-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={12} />
              {formattedDate}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-border dark:bg-dark-border" />
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={12} />
              {blog.readTime || "5 min read"}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary dark:text-dark-foreground dark:group-hover:text-dark-primary">
            {blog.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground dark:text-dark-muted-foreground">
            {blog.subHeading || blog.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/80 px-5 pb-5 pt-3 dark:border-dark-border/60 dark:bg-dark-muted/20">
        <span className="flex items-center gap-2 text-xs font-semibold text-foreground/80 dark:text-dark-foreground/80">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 dark:bg-dark-primary/15">
            <User size={12} className="text-primary dark:text-dark-primary" />
          </div>
          {blog.author || "Admin"}
        </span>

        <span className="flex items-center gap-1 text-xs font-bold text-primary transition-colors duration-200 group-hover:text-accent dark:text-dark-primary">
          Read More
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </motion.div>
  );
};

export default BlogCard;

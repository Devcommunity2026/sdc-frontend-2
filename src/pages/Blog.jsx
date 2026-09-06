import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Layout from '../components/Layout';
import { BlogGridSkeleton } from "../components/ui/Skeletons";
import BlogCard from "../components/ui/BlogCard";
import { fetchBlogs } from "../controllers/detailsRequest";
import { Calendar, Clock, User, BookOpen } from "lucide-react";
import ContentModal from "../components/ui/ContentModal";

function Blogs() {
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeBlog, setActiveBlog] = useState(null);

  const limit = 8;

  useEffect(() => {
    fetchBlogs(currentPage, limit, setBlogsList, setTotalPages, setLoading);
  }, [currentPage]);

  const displayBlogs = blogsList;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Custom inline markdown-to-HTML parser function
  const parseMarkdownToHTML = (markdown) => {
    if (!markdown) return "";
    
    // Inline formatting parser
    const parseInline = (text) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground dark:text-dark-foreground">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted dark:bg-dark-muted font-mono text-sm">$1</code>');
    };

    const lines = markdown.split("\n");
    let inList = false;
    const htmlElements = [];

    for (let line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        if (inList) { htmlElements.push("</ul>"); inList = false; }
        htmlElements.push(`<h2 class="text-2xl font-bold text-foreground dark:text-dark-foreground mt-6 mb-3">${parseInline(trimmed.substring(3))}</h2>`);
      } else if (trimmed.startsWith("### ")) {
        if (inList) { htmlElements.push("</ul>"); inList = false; }
        htmlElements.push(`<h3 class="text-xl font-semibold text-foreground dark:text-dark-foreground mt-5 mb-2">${parseInline(trimmed.substring(4))}</h3>`);
      } else if (trimmed.startsWith("# ")) {
        if (inList) { htmlElements.push("</ul>"); inList = false; }
        htmlElements.push(`<h1 class="text-3xl font-extrabold text-foreground dark:text-dark-foreground mt-7 mb-4">${parseInline(trimmed.substring(2))}</h1>`);
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList) {
          htmlElements.push(`<ul class="list-disc pl-6 space-y-1.5 my-3 text-foreground/80 dark:text-dark-foreground/80">`);
          inList = true;
        }
        htmlElements.push(`<li>${parseInline(trimmed.substring(2))}</li>`);
      } else if (trimmed === "") {
        if (inList) { htmlElements.push("</ul>"); inList = false; }
        htmlElements.push(`<div class="h-3"></div>`);
      } else {
        if (inList) { htmlElements.push("</ul>"); inList = false; }
        htmlElements.push(`<p class="text-base md:text-lg text-foreground/85 dark:text-dark-foreground/85 leading-relaxed my-3 whitespace-pre-wrap">${parseInline(line)}</p>`);
      }
    }

    if (inList) {
      htmlElements.push("</ul>");
    }

    return htmlElements.join("\n");
  };

  return (
    <Layout>
      <Header
        heading1={'Blogs & '}
        heading2={'Resources'}
        subtext={'Stay ahead of the curve with our latest developer insights, tutorials, and community success stories.'}
      />

      <section className="page-section-alt">
      <div className="mx-auto max-w-7xl px-6 py-12">
       

        {loading ? (
          <BlogGridSkeleton count={6} />
        ) : displayBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-muted dark:bg-dark-muted text-muted-foreground dark:text-dark-muted-foreground">
              <BookOpen size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">No blogs available</h2>
            <p className="text-muted-foreground dark:text-dark-muted-foreground max-w-sm leading-relaxed">
              We haven't published any articles yet. Please check back later for exciting developer updates!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBlogs.map((blog, index) => (
                <BlogCard
                  key={blog._id || blog.id || index}
                  blog={blog}
                  index={index}
                  onClick={() => setActiveBlog(blog)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && blogsList.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm animate-all cursor-pointer"
                >
                  Previous
                </button>
                <div className="px-4 py-2 rounded-xl bg-secondary dark:bg-dark-secondary text-secondary-foreground dark:text-dark-secondary-foreground font-semibold text-sm">
                  {currentPage} / {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm animate-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </section>

      <ContentModal
        open={Boolean(activeBlog)}
        onClose={() => setActiveBlog(null)}
        maxWidth="max-w-4xl"
      >
        {activeBlog && (
          <>
              <div className="modal-body-scroll custom-scrollbar">
                {/* Banner Image */}
                <div className="relative h-64 md:h-96 w-full overflow-hidden bg-muted dark:bg-dark-muted">
                  <img
                    src={activeBlog.thumbnail || activeBlog.image}
                    alt={activeBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-dark-background via-black/10 to-transparent" />
                </div>

                {/* Article Wrapper */}
                <div className="px-6 py-8 md:px-10 md:py-10 text-left">
                  {/* Meta Information Row */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground dark:text-dark-muted-foreground mb-4">
                    <span className="flex items-center gap-2 font-medium text-foreground dark:text-dark-foreground">
                      <User className="text-primary dark:text-dark-primary" size={16} />
                      {activeBlog.author || "Admin"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(activeBlog.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      {activeBlog.readTime || "5 min read"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-4xl font-extrabold text-foreground dark:text-dark-foreground mb-4 leading-tight">
                    {activeBlog.title}
                  </h2>

                  {/* Tags */}
                  {activeBlog.tags && activeBlog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {activeBlog.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary border border-primary/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sub Heading */}
                  <p className="text-lg md:text-xl font-medium text-primary dark:text-dark-primary mb-8 border-l-4 border-primary pl-4 py-1">
                    {activeBlog.subHeading || activeBlog.subtitle || activeBlog.desc}
                  </p>

                  {/* Divider */}
                  <hr className="border-border dark:border-dark-border mb-8" />

                  {/* Article Body */}
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 dark:text-dark-foreground/90 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(activeBlog.formattedContent || activeBlog.description) }}
                  />
                </div>
              </div>
          </>
        )}
      </ContentModal>
    </Layout>
  );
}

export default Blogs;
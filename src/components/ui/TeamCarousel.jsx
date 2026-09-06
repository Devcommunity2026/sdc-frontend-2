import React, { useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeamCard from "./TeamCard";

const SPEED_PPS = 42; // Smooth, gentle continuous rotation speed

const TeamCarousel = ({ members = [] }) => {
  const containerRef = useRef(null);
  const scrollPosRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  // Triplicate members array to create seamless infinite loop
  const displayMembers = useMemo(() => {
    if (!members || members.length === 0) return [];
    // If fewer than 4 members, duplicate more to fill wide screens
    if (members.length < 4) {
      return [...members, ...members, ...members, ...members, ...members, ...members];
    }
    return [...members, ...members, ...members];
  }, [members]);

  // Recalculate single set width and initialize position
  const calculateWidth = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const totalSets = members.length < 4 ? 6 : 3;
    const singleWidth = container.scrollWidth / totalSets;

    if (singleWidth > 0) {
      singleSetWidthRef.current = singleWidth;
      // Start in the middle set if uninitialized or near edges
      if (scrollPosRef.current === 0 || scrollPosRef.current < 20) {
        container.scrollLeft = singleWidth;
        scrollPosRef.current = singleWidth;
      }
    }
  };

  useEffect(() => {
    if (!members || members.length === 0) return;

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    // Also recalculate after images or fonts settle
    const t1 = setTimeout(calculateWidth, 150);
    const t2 = setTimeout(calculateWidth, 500);

    let lastTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isPausedRef.current && containerRef.current && singleSetWidthRef.current > 0) {
        const container = containerRef.current;
        const singleWidth = singleSetWidthRef.current;

        scrollPosRef.current += SPEED_PPS * dt;

        // Seamless wrap when reaching upper boundary
        if (scrollPosRef.current >= singleWidth * 2) {
          scrollPosRef.current -= singleWidth;
        } else if (scrollPosRef.current <= 0) {
          scrollPosRef.current += singleWidth;
        }

        container.scrollLeft = scrollPosRef.current;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", calculateWidth);
      clearTimeout(t1);
      clearTimeout(t2);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [members]);

  // Manual left / right rotate buttons
  const handleManualRotate = (direction) => {
    if (!containerRef.current || !singleSetWidthRef.current) return;
    const container = containerRef.current;
    const singleWidth = singleSetWidthRef.current;

    // Temporarily pause continuous motion
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    // Calculate step width based on a single card's outer width
    const cardEl = container.querySelector("[data-team-card-wrapper]");
    const step = cardEl ? cardEl.getBoundingClientRect().width : 300;

    // Boundary protection before smooth scrolling
    if (direction === -1 && container.scrollLeft - step < 20) {
      container.scrollLeft += singleWidth;
      scrollPosRef.current = container.scrollLeft;
    } else if (direction === 1 && container.scrollLeft + step > singleWidth * 2.8) {
      container.scrollLeft -= singleWidth;
      scrollPosRef.current = container.scrollLeft;
    }

    container.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });

    // Resume smooth continuous glide after scroll finishes
    resumeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollLeft;
      }
      isPausedRef.current = false;
    }, 1100);
  };

  // Keep scroll position tracked if user manually scrolls with touchpad or finger
  const handleContainerScroll = () => {
    if (!containerRef.current || !singleSetWidthRef.current) return;
    const container = containerRef.current;
    const singleWidth = singleSetWidthRef.current;

    if (isPausedRef.current) {
      scrollPosRef.current = container.scrollLeft;
      // Seamless wrap on manual scroll
      if (container.scrollLeft >= singleWidth * 2) {
        container.scrollLeft -= singleWidth;
        scrollPosRef.current = container.scrollLeft;
      } else if (container.scrollLeft <= 10) {
        container.scrollLeft += singleWidth;
        scrollPosRef.current = container.scrollLeft;
      }
    }
  };

  // Hover handlers: pause so users can view profile or click LinkedIn
  const handleMouseEnter = () => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
      scrollPosRef.current = containerRef.current.scrollLeft;
    }
    isPausedRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        scrollPosRef.current = containerRef.current.scrollLeft;
      }
      isPausedRef.current = false;
    }, 1200);
  };

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground dark:text-dark-muted-foreground">
        No team members found.
      </div>
    );
  }

  return (
    <div
      className="relative w-full group/carousel select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Edge Gradient Fade for Seamless Infinity Effect */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-background dark:from-dark-background to-transparent z-10"
        aria-hidden="true"
      />

      {/* Right Edge Gradient Fade for Seamless Infinity Effect */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-background dark:from-dark-background to-transparent z-10"
        aria-hidden="true"
      />

      {/* Floating Left Rotate Button */}
      <button
        type="button"
        onClick={() => handleManualRotate(-1)}
        aria-label="Rotate left"
        title="Rotate left"
        className="
          absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 sm:w-12 sm:h-12 rounded-full
          flex items-center justify-center
          bg-background/90 dark:bg-dark-background/90
          border border-border/80 dark:border-dark-border/80
          text-foreground dark:text-dark-foreground
          shadow-lg backdrop-blur-md
          hover:bg-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-white
          hover:border-primary dark:hover:border-dark-primary
          transition-all duration-200 cursor-pointer
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-primary
        "
      >
        <ChevronLeft size={22} />
      </button>

      {/* Floating Right Rotate Button */}
      <button
        type="button"
        onClick={() => handleManualRotate(1)}
        aria-label="Rotate right"
        title="Rotate right"
        className="
          absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20
          w-10 h-10 sm:w-12 sm:h-12 rounded-full
          flex items-center justify-center
          bg-background/90 dark:bg-dark-background/90
          border border-border/80 dark:border-dark-border/80
          text-foreground dark:text-dark-foreground
          shadow-lg backdrop-blur-md
          hover:bg-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-white
          hover:border-primary dark:hover:border-dark-primary
          transition-all duration-200 cursor-pointer
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-primary
        "
      >
        <ChevronRight size={22} />
      </button>

      {/* Continuous Scrolling Viewport */}
      <div
        ref={containerRef}
        onScroll={handleContainerScroll}
        className="
          overflow-x-auto no-scrollbar
          flex items-stretch py-4
          cursor-grab active:cursor-grabbing
          scroll-smooth
        "
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "auto",
        }}
      >
        {displayMembers.map((member, index) => (
          <div
            key={`${member._id || index}-${index}`}
            data-team-card-wrapper
            className="shrink-0 w-[270px] sm:w-[290px] md:w-[310px] px-2.5 sm:px-3.5"
          >
            <TeamCard
              member={member}
              index={index % members.length}
              disableFade={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCarousel;

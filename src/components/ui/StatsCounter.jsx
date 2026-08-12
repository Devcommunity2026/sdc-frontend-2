import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { fadeUp } from "../../libs/motion";

const getNumericValue = (value) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

const StatCounter = ({ stat, index }) => {
    const targetValue = getNumericValue(stat.value);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1200;
        const startTime = performance.now();
        let animationFrameId;

        const animateValue = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutCubic(progress);

            setDisplayValue(Math.round(targetValue * easedProgress));

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animateValue);
            }
        };

        animationFrameId = requestAnimationFrame(animateValue);

        return () => cancelAnimationFrame(animationFrameId);
    }, [targetValue]);

    return (
        <Motion.div
            {...fadeUp(index, 0.08)}
            className="
      rounded-2xl p-6 text-center border transition-all
      bg-card text-card-foreground border-border
      hover:shadow-lg
      dark:bg-dark-card dark:text-dark-card-foreground dark:border-dark-border
    "
        >
            {/* Value */}
            <div
                className="
        text-3xl md:text-4xl font-heading font-bold
        text-primary
        dark:text-dark-primary
      "
            >
                {displayValue}
                {stat.suffix}
            </div>

            {/* Label */}
            <div
                className="
        text-sm mt-1 font-medium
        text-muted-foreground
        dark:text-dark-muted-foreground
      "
            >
                {stat.label}
            </div>
        </Motion.div>
    );
};

export default StatCounter;

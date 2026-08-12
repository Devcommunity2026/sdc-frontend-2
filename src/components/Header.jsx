import React from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import Heading from "./Heading";
import { themeContext } from "../contexts/ThemeProvider";
import { EASE_OUT } from "../libs/motion";

const Header = ({ heading1, heading2, subtext, compact = false }) => {
    const { theme, setTheme } = useContext(themeContext)
    return (
        <section className={`w-full ${compact ? "py-14 md:py-16" : "py-[80px]"} ${theme === 'dark' ? 'darkHeader' : 'header'} `}>
            <div className="h-full w-full flex flex-col items-center justify-center gap-6 p-5">

                {/* Heading animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="text-5xl font-bold w-1/2 max-[1030px]:w-2/3 max-[775px]:w-full max-[775px]:text-3xl text-center"
                >
                    <Heading heading1={heading1} heading2={heading2} />
                </motion.h1>

                {/* Subtext animation (with delay for smooth sequence) */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
                    className="text-xl w-1/2 max-[1030px]:w-2/3 max-[775px]:w-full text-center text-foreground/70 dark:text-dark-foreground/70"
                >
                    {subtext}
                </motion.p>

            </div>
        </section>
    );
};

export default Header;
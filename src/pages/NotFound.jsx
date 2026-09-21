import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg mx-auto"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.1
                    }}
                    className="relative inline-block"
                >
                    <h1 className="text-[9rem] md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent dark:from-dark-primary dark:to-dark-accent leading-none select-none drop-shadow-sm">
                        404
                    </h1>
                </motion.div>

                <div className="mt-8 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-dark-foreground">
                        Page Not Found
                    </h2>
                    
                    <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
                        Oops! The page you're looking for seems to have wandered off. 
                        It might have been moved, deleted, or never existed in the first place.
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/">
                        <Button 
                            variant="default" 
                            size="lg" 
                            className="w-full sm:w-auto flex items-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Button>
                    </Link>
                    
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full sm:w-auto flex items-center gap-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;

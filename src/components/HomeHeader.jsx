import React from 'react'
import { themeContext } from '../contexts/ThemeProvider'
import { useContext } from 'react'
import { motion } from "framer-motion";
import SectionHeading from './ui/SectionHeading';
import Button from './ui/Button';
import { Link } from 'react-router-dom';
const HomeHeader = () => {
    const { theme, setTheme } = useContext(themeContext)
    return (
        <section className={`w-full h-screen/90 ${theme === 'dark' ? 'darkHeader' : 'header'} `}>
            <div className="h-full w-full flex flex-col items-center justify-start gap-6 px-40 py-20 max-[770px]:px-5 max-[400px]:px-2 ">
                <div className=''>
                    <SectionHeading
                        badge="Break · Build · Merge"
                        title={
                            <>
                                Empowering <span className="gradient">Developers</span> Through Community
                            </>
                        }
                        subtitle="Join a thriving community of student developers. Learn, collaborate, and build real-world projects with mentorship from industry experts."
                        home={true}
                    />
                </div>
                <div className='flex  gap-5'>
                    <Link to="/careers">
                        <Button className={'flex items-center justify-center text-xl max-[770px]:text-base max-[770px]:w-auto font-semibold'} size={'xl'}>
                            Apply Now
                        </Button>
                    </Link>
                    <Link to="/about">
                        <Button variant={'outline'} className={'flex items-center justify-center text-xl max-[770px]:text-base  font-semibold'} size={'xl'}>
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HomeHeader

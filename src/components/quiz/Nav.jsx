import React, { useState, useEffect } from 'react';
import sun from '../assets/sun.svg';
import moon from '../assets/moon.svg';
import qb from '../assets/quizB.svg';
import { useContext } from 'react';
import a from '../context/context';

const Nav = () => {
    const { mode, setmode } = useContext(a);
    return (
        <div className='fixed top-0 left-0 z-50 h-12 w-full bg-primary dark:bg-primary-dark box-border px-2 flex items-center justify-start shadow-sm shadow-primary-shadow dark:shadow-[#ffff]'>
            <img src={qb} className='h-10' alt="" />
            <div className='h-4.5 w-9 box-border px-0.5 cursor-pointer rounded-full bg-amber-50 flex items-center justify-start'
                onClick={() => {
                    setmode(mode == 'light' ? 'dark' : 'light');
                }}>
                <img src={mode == 'dark' ? moon : sun} className={'select-none h-3.5 transition-all ease-in-out duration-800 ' + (mode == 'dark' ? " translate-x-4 rotate-360" : " translate-x-0 -rotate-360")} alt="" />
            </div>
        </div>
    );
};

export default Nav;

import React, { useState, useEffect } from 'react';

const Questions = ({ totalQuestion, currQuestion, setcurrQuestion }) => {
    const [questionDetails, setquestionDetails] = useState({});

    useEffect(() => {
        const helper = () => {
            const temp = {};
            for (let i = 1; i <= totalQuestion; i++) {
                if (i === 1) {
                    temp[i] = { visited: true, attempted: false, marked: false };
                } else {
                    temp[i] = { visited: false, attempted: false, marked: false };
                }
            }
            setquestionDetails(temp);
        };
        helper();
    }, []);

    const questionHandeler = (i) => {
        setcurrQuestion(i + 1);
        const temp = { ...questionDetails };
        temp[i + 1].visited = true;
        setquestionDetails(temp);
    };

    const colorSelection = (element, i) => {
        if (i + 1 === currQuestion) return ' bg-primary-button dark:bg-primary-dark-button ';
        if (element.marked) return ' bg-primary ';
        if (element.attempted) return ' bg-destructive ';
        if (element.visited) return ' bg-warning ';
        return 'bg-primary-button/30 dark:bg-primary-dark-button/30 ';
    };

    return (
        <div className='h-full w-full flex flex-col justify-around gap-7'>
            <div className='flex flex-wrap gap-3'>
                {Object.values(questionDetails).map((element, i) => (
                    <div
                        key={i}
                        className={'h-10 w-10 rounded-full cursor-pointer font-semibold flex items-center justify-center transition-all ease-in-out duration-300 ' + colorSelection(element, i)}
                        onClick={() => questionHandeler(i)}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-5'>
                <div className="remaining h-10 w-full flex items-center gap-3 font-semibold">
                    <div className='h-10 w-10 rounded-full bg-primary-button/30 dark:bg-primary-dark-button/30'></div>
                    <div>Not visited</div>
                </div>
                <div className="markforreview h-10 w-full flex items-center gap-2 font-semibold">
                    <div className='h-10 w-10 rounded-full bg-primary'></div>
                    <div>Marked for review</div>
                </div>
                <div className="attempted h-10 w-full flex items-center gap-3 font-semibold">
                    <div className='h-10 w-10 rounded-full bg-destructive'></div>
                    <div>Attempted</div>
                </div>
                <div className="notVisited h-10 w-full flex items-center gap-2 font-semibold">
                    <div className='h-10 w-10 rounded-full bg-warning'></div>
                    <div>Remaining</div>
                </div>
            </div>
        </div>
    );
};

export default Questions;

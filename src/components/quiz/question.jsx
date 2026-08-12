import React from 'react';

const Question = () => {
    const sample = {
        questionNumber: 1,
        question: "Which data structure follows the FIFO (First In First Out) principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: "Queue",
    };
    return (
        <div className='flex flex-col gap-5'>
            <div>{sample.questionNumber}. {sample.question}</div>
            <ul className='list-disc pl-5'>
                {sample.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                ))}
            </ul>
        </div>
    );
};

export default Question;

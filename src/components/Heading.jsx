import React from 'react'

const Heading = ({ heading1, heading2 }) => {
    return (
        <div className='w-full font-bold w-1/2 text-center'>
            {heading1} <span className="gradient">{heading2}</span>
        </div>
    )
}

export default Heading

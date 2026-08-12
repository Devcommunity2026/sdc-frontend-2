import React from 'react'

const DropDown = ({ value, setValue, options }) => {
    return (
        <div className="flex w-full items-center gap-3 lg:ml-auto lg:w-auto">

            <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="px-4 py-2 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground
                                outline-none focus:ring-2 focus:ring-primary
                                w-full min-w-0 lg:min-w-[240px]
                                cursor-pointer
                            "
            >
                {
                    options.map((item, index) => (
                        <option
                            key={index}
                            value={item}
                        >
                            {item}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}

export default DropDown

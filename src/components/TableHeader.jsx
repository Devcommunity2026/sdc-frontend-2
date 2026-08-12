import React from 'react'

const TableHeader = ({ data }) => {
    return (
        <div className="admin-table-header grid grid-cols-5 gap-4 px-6 py-4">
            {data.map((item, i) => (
                <p key={i}>{item}</p>
            ))}
        </div>
    )
}

export default TableHeader

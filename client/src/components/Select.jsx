import React, { useId } from 'react'

function Select({
    options,
    label,
    className = '',
    ...props
}, ref) {
    const id = useId();
    return (
        <div className='w-full text-left'>
            {label &&
                <label className='inline-block mb-1.5 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-300'
                    htmlFor={id}
                >
                    {label}
                </label>}
            <select
                className={`px-4 py-2.5 rounded-xl w-full bg-gray-800/80 text-white outline-none duration-200 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 cursor-pointer ${className}`}
                id={id}
                ref={ref}
                {...props}
            >
                {options?.map((option) => (
                    <option key={option} value={option} className="bg-gray-900 text-white">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Select)

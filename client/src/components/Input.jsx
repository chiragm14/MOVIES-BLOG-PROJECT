import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
}, ref){
    const id = useId();
    return (
        <div className='w-full text-left'>
            { label &&
            <label className='inline-block mb-1.5 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-300'
            htmlFor={id}>
                {label}
            </label> }
            <input
            type={type}
            className={`px-4 py-2.5 rounded-xl w-full bg-gray-800/80 text-white placeholder-gray-500 outline-none duration-200 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:bg-gray-800 transition-all ${className}`}
            id={id}
            ref={ref}
            {...props}
            />
        </div>
    )
})

export default Input
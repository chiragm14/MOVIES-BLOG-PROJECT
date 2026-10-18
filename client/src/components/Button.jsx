import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/40',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button
      type={type}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
import React from 'react'
import favicon from '../../assets/favicon.png'

function Logo({ width = "44px", height = "auto", className = "" }) {
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={favicon}
        alt="CineBlog Logo"
        className="object-contain filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.25)] transition-transform duration-300 hover:scale-105"
        style={{ width: width, height: height }}
      />
    </div>
  )
}

export default Logo
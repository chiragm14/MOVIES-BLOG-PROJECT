import React from 'react'
import postService from '../services/postService'
import { Link } from 'react-router-dom'

function PostCard({ _id, title, featuredImage, status, rating = 5 }) {
  return (
    <Link to={`/post/${_id}`} className="group block h-full">
      <div className='relative h-full flex flex-col bg-gradient-to-b from-gray-900/90 to-gray-950/90 rounded-2xl border border-gray-800/80 overflow-hidden hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 transform group-hover:-translate-y-1.5'>
        {/* Image Container with ample space & no cropped edges */}
        <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-black/80 flex items-center justify-center p-3">
          {/* Status Badge - Stays on top */}
          {status && (
            <span className={`absolute top-3 right-3 z-30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${
              status === 'active' 
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' 
                : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
            }`}>
              {status}
            </span>
          )}

          {featuredImage ? (
            <img
              src={postService.getFilePreview(featuredImage)}
              alt={title}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-600">
              <svg className="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span className="text-xs uppercase tracking-wider font-semibold">CineBlog</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className='p-5 flex-1 flex flex-col justify-between text-left'>
          <div>
            <h2 className='text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug'>
              {title}
            </h2>

            {/* Star Rating Display */}
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= (rating || 5)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-700 fill-gray-700"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="text-xs font-semibold text-amber-400 ml-1">
                {Number(rating || 5).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
            <span className="group-hover:text-gray-300 font-medium flex items-center gap-1">
              Read Review
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard

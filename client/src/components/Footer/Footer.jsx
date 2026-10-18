import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo/Logo'

function Footer() {
    return (
        <footer className="mt-16 border-t border-gray-800/80 bg-gradient-to-b from-gray-950 to-black text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand info */}
                    <div className="md:col-span-2 text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 rounded-xl bg-red-600/10 border border-red-500/20">
                                <Logo width="44px" height="44px" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">
                                Cine<span className="text-red-500">Blog</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-4">
                            Your premier destination for movie reviews, film critiques, cinematic insights, and community discussions.
                        </p>
                        <p className="text-xs text-gray-500">
                            &copy; {new Date().getFullYear()} CineBlog App. All rights reserved.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="text-left">
                        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
                            Explore
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-red-400 transition-colors">Home</Link></li>
                            <li><Link to="/all-posts" className="hover:text-red-400 transition-colors">All Movies</Link></li>
                            <li><Link to="/add-post" className="hover:text-red-400 transition-colors">Write a Review</Link></li>
                        </ul>
                    </div>

                    {/* Community / Auth */}
                    <div className="text-left">
                        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
                            Account
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/login" className="hover:text-red-400 transition-colors">Sign In</Link></li>
                            <li><Link to="/signup" className="hover:text-red-400 transition-colors">Create Account</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
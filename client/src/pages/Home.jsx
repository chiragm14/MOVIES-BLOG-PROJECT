import React, { useEffect, useState } from 'react'
import postService from "../services/postService";
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        postService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts)
            }
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div className='w-full'>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-gray-800/80 bg-gradient-to-b from-red-950/20 via-black to-black">
                {/* Decorative glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <Container>
                    <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
                        <span className="inline-block px-3.5 py-1 mb-4 rounded-full text-xs font-semibold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20">
                            The Ultimate Cinematic Hub
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-5">
                            Discover, Review & Share <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                                Movie Stories
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Dive into authentic critiques, trending reviews, and cinematic analysis from movie lovers around the world.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to={authStatus ? "/add-post" : "/signup"}
                                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-900/30 transition-all hover:scale-105 active:scale-95"
                            >
                                {authStatus ? "Write a Review" : "Get Started Free"}
                            </Link>
                            <Link
                                to="/all-posts"
                                className="px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-gray-700/80 transition-all"
                            >
                                Browse All Movies
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Featured Posts Feed */}
            <section className="py-12 sm:py-16">
                <Container>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Latest Movie Reviews
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                Fresh takes and reviews from our community
                            </p>
                        </div>
                        {posts.length > 0 && (
                            <Link to="/all-posts" className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                                View all <span aria-hidden="true">&rarr;</span>
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Loading movies...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="max-w-md mx-auto my-8 p-8 bg-gray-900/80 border border-gray-800 rounded-2xl text-center shadow-xl">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Movies Posted Yet</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                {authStatus
                                    ? "Be the first one to create a movie review and share your thoughts!"
                                    : "Join CineBlog today to write the very first movie review!"}
                            </p>
                            <Link
                                to={authStatus ? "/add-post" : "/signup"}
                                className="inline-block px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-950/40 transition-all"
                            >
                                {authStatus ? "Create First Post" : "Sign Up to Post"}
                            </Link>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {posts.map((post) => (
                                <div key={post._id} className="h-full">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </div>
    )
}

export default Home
import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import postService from '../services/postService'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        postService.getPosts('').then((posts) => {
            if (posts) setPosts(posts)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div className='w-full py-10 sm:py-12'>
            <Container>
                {/* Header banner */}
                <div className="mb-10 text-left border-b border-gray-800 pb-6 px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                        Explore Collection
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                        All Movie Reviews
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Browse all curated reviews, ratings, and opinions in one place.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Loading all movies...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="max-w-md mx-auto my-12 p-8 bg-gray-900/80 border border-gray-800 rounded-2xl text-center shadow-xl">
                        <h2 className='text-2xl font-bold mb-2 text-white'>No Posts Found</h2>
                        <p className='text-sm text-gray-400'>There are currently no movie posts available in the database.</p>
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
        </div>
    )
}

export default AllPosts
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../services/postService";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const postUserId = post?.userId?._id || post?.userId;
    const currentUserId = userData?._id;
    const isAuthor = Boolean(post && userData && postUserId && currentUserId && String(postUserId) === String(currentUserId));

    useEffect(() => {
        if (slug) {
            setLoading(true);
            postService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            }).catch(() => {
                navigate("/");
            }).finally(() => {
                setLoading(false);
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        const idToDelete = post._id || post.slug;
        postService.deletePost(idToDelete).then((status) => {
            if (status) {
                navigate("/");
            }
        }).catch((err) => {
            console.error("Failed to delete post:", err);
        });
    };

    if (loading) {
        return (
            <div className="py-16 text-center text-gray-400">
                <Container>
                    <p className="text-xl">Loading post details...</p>
                </Container>
            </div>
        );
    }

    return post ? (
        <div className="py-6 sm:py-8">
            <Container>
                {/* Standalone Back Button above card */}
                <div className="max-w-3xl mx-auto mb-4 text-left px-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-gray-700/80 transition-all shadow-md group"
                    >
                        <svg 
                            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform text-red-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                </div>

                <article className="max-w-3xl mx-auto bg-gray-900 border border-gray-700/80 rounded-2xl overflow-hidden shadow-xl">
                    {/* Top Action Bar: Author metadata & Controls */}
                    <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-gray-800 gap-3">
                        {/* Author Info */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center font-bold text-white uppercase text-xs shadow-inner">
                                {post.userId?.name ? post.userId.name[0] : "A"}
                            </div>
                            <span className="text-white text-sm font-medium tracking-wide">
                                {post.userId?.name || "Author"}
                            </span>
                        </div>

                        {/* Right Group: Edit & Delete Action Buttons (Only for post author) */}
                        {isAuthor && (
                            <div className="flex items-center gap-2">
                                <Link to={`/edit-post/${post._id || post.slug}`}>
                                    <Button bgColor="bg-green-600/90 hover:bg-green-600 border border-green-500/40" className="text-xs font-semibold px-3 py-1.5">
                                        Edit Post
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-600/90 hover:bg-red-600 border border-red-500/40" onClick={deletePost} className="text-xs font-semibold px-3 py-1.5">
                                    Delete Post
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Featured Image (Balanced & Centered) */}
                    {post.featuredImage && (
                        <div className="w-full flex justify-center py-5 px-4 bg-black/40 border-b border-gray-800">
                            <img
                                src={postService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="max-h-[340px] w-auto max-w-full rounded-xl object-contain shadow-md border border-gray-700/60"
                            />
                        </div>
                    )}

                    {/* Post Content Area */}
                    <div className="p-5 md:p-7 text-left">
                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-snug tracking-tight">
                            {post.title}
                        </h1>

                        {/* Star Rating Badge */}
                        <div className="flex items-center gap-2 mb-5 py-1">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= (post.rating || 5)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-gray-700 fill-gray-700"
                                        }`}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                                {Number(post.rating || 5).toFixed(1)} / 5.0
                            </span>
                        </div>

                        {/* Rich HTML Content */}
                        <div className="browser-css text-gray-200">
                            {parse(post.content || '')}
                        </div>
                    </div>
                </article>
            </Container>
        </div>
    ) : null;
}

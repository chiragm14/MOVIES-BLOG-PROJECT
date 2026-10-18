import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import postService from "../../services/postService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || post?._id || "",
            content: post?.content || "",
            status: post?.status || "active",
            rating: post?.rating || 5,
        },
    });

    const [currentRating, setCurrentRating] = React.useState(post?.rating || 5);
    const [hoverRating, setHoverRating] = React.useState(0);

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        try {
            if (!userData || !userData._id) {
                console.error("User is not authenticated or user data not loaded.");
                return;
            }

            if (post) {
                const identifier = post._id || post.slug;
                const dbPost = await postService.updatePost(identifier, {
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    featuredImage: data.image[0] || post.featuredImage,
                    status: data.status,
                    rating: currentRating,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost._id || dbPost.slug}`);
                }
            } else {
                const dbPost = await postService.createPost({
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    featuredImage: data.image[0],
                    status: data.status,
                    rating: currentRating,
                    userId: userData._id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost._id || dbPost.slug}`);
                }
            }
        } catch (error) {
            console.error("Submit failed:", error);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s+/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="mb-8 border-b border-gray-800 pb-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                        {post ? "Editor Mode" : "New Publication"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {post ? "Edit Movie Review" : "Publish a New Movie Review"}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Title, Slug & RTE */}
                    <div className="lg:col-span-2 space-y-5 text-left">
                        <Input
                            label="Movie Review Title"
                            placeholder="e.g. Inception: A Mind-Bending Masterpiece"
                            {...register("title", { required: true })}
                        />
                        <Input
                            label="URL Slug (Auto-generated)"
                            placeholder="inception-a-mind-bending-masterpiece"
                            {...register("slug", { required: true })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
                        />
                        <div className="w-full">
                            <label className="inline-block mb-1.5 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Review Content
                            </label>
                            <RTE
                                name="content"
                                control={control}
                                defaultValue={getValues("content")}
                            />
                        </div>
                    </div>

                    {/* Right Column: Featured Image & Status */}
                    <div className="space-y-6 text-left">
                        <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-800 space-y-5">
                            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                                Media & Settings
                            </h3>

                            <Input
                                label="Cover Poster / Image"
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                {...register("image", { required: !post })}
                            />

                            {post && post.featuredImage && (
                                <div className="w-full rounded-xl overflow-hidden border border-gray-700/60 bg-black/50 p-2">
                                    <p className="text-xs text-gray-400 mb-2">Current Cover Image:</p>
                                    <img
                                        src={postService.getFilePreview(post.featuredImage)}
                                        alt={post.title}
                                        className="w-full max-h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            {/* 5-Star Movie Rating */}
                            <div className="w-full text-left">
                                <label className="inline-block mb-1.5 pl-1 text-xs font-semibold uppercase tracking-wider text-gray-300">
                                    Movie Rating ({currentRating}/5 Stars)
                                </label>
                                <div className="flex items-center gap-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setCurrentRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 focus:outline-none transition-transform hover:scale-125"
                                        >
                                            <svg
                                                className={`w-7 h-7 transition-colors ${
                                                    (hoverRating || currentRating) >= star
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-600 fill-transparent"
                                                }`}
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                                />
                                            </svg>
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-bold text-amber-400">
                                        {currentRating}.0
                                    </span>
                                </div>
                            </div>

                            <Select
                                options={["active", "inactive"]}
                                label="Visibility Status"
                                {...register("status", { required: true })}
                            />

                            <Button
                                type="submit"
                                className="w-full py-3 text-base font-semibold"
                            >
                                {post ? "Update Review" : "Publish Review"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

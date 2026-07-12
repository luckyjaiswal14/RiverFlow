"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { ID } from "appwrite";

export default function AskQuestion() {
    const { user, hydrated } = useAuthStore();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsStr, setTagsStr] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (hydrated && !user) {
            router.push("/login");
        }
    }, [hydrated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Title and content are required.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const tags = tagsStr
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            const response = await databases.createDocument(
                db,
                questionCollection,
                ID.unique(),
                {
                    title,
                    content,
                    tags,
                    authorId: user!.$id,
                    attachmentId: null // We will omit file upload for simplicity
                }
            );

            router.push(`/questions/${response.$id}`);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setIsSubmitting(false);
        }
    };

    if (!hydrated || !user) {
        return <div className="text-center py-20">Loading...</div>;
    }

    return (
        <main className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Ask a public question</h1>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">Title</label>
                        <p className="text-xs text-neutral-400 mb-2">Be specific and imagine you're asking a question to another person.</p>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                            maxLength={100}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">What are the details of your problem?</label>
                        <p className="text-xs text-neutral-400 mb-2">Introduce the problem and expand on what you put in the title.</p>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-48 bg-neutral-950 border border-neutral-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                            placeholder="Write your question here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white mb-1">Tags</label>
                        <p className="text-xs text-neutral-400 mb-2">Add up to 5 tags to describe what your question is about. Separate with commas.</p>
                        <input
                            type="text"
                            value={tagsStr}
                            onChange={(e) => setTagsStr(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="e.g. react, nextjs, typescript"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Posting..." : "Post your question"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { Query, Models } from "appwrite";

interface QuestionDoc extends Models.Document {
    title: string;
    content: string;
    tags: string[];
}

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<QuestionDoc[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await databases.listDocuments(db, questionCollection, [
                    Query.orderDesc("$createdAt"),
                    Query.limit(25),
                ]);
                setQuestions(response.documents as unknown as QuestionDoc[]);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">All Questions</h1>
                <Link
                    href="/questions/ask"
                    className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors"
                >
                    Ask Question
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-neutral-400">Loading questions...</div>
            ) : questions.length === 0 ? (
                <div className="text-center py-20 border border-neutral-800 rounded-lg bg-neutral-900/50">
                    <p className="text-neutral-400 mb-4">No questions have been asked yet.</p>
                    <Link
                        href="/questions/ask"
                        className="text-cyan-400 hover:underline"
                    >
                        Be the first to ask!
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {questions.map((q) => (
                        <div key={q.$id} className="p-6 border border-neutral-800 rounded-lg bg-neutral-900/20 hover:bg-neutral-900/40 transition-colors flex gap-6">
                            <div className="flex flex-col items-end gap-2 text-sm text-neutral-400 shrink-0 w-24">
                                <div><span className="font-semibold text-neutral-200">0</span> votes</div>
                                <div><span className="font-semibold text-neutral-200">0</span> answers</div>
                            </div>
                            <div className="flex-1">
                                <Link href={`/questions/${q.$id}`}>
                                    <h2 className="text-lg font-medium text-cyan-400 hover:text-cyan-300 mb-2">
                                        {q.title}
                                    </h2>
                                </Link>
                                <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                                    {q.content}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex gap-2">
                                        {(q.tags || []).map((tag: string) => (
                                            <span key={tag} className="px-2 py-1 bg-neutral-800 text-cyan-300 text-xs rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        asked {new Date(q.$createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

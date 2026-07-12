"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection, voteCollection } from "@/models/name";
import { Query, Models, ID } from "appwrite";
import { useAuthStore } from "@/store/Auth";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";

interface QuestionDoc extends Models.Document {
    title: string;
    content: string;
    tags: string[];
}

interface AnswerDoc extends Models.Document {
    content: string;
}

export default function QuestionDetail() {
    const params = useParams();
    const questionId = params.id as string;
    const { user, hydrated } = useAuthStore();

    const [question, setQuestion] = useState<QuestionDoc | null>(null);
    const [answers, setAnswers] = useState<AnswerDoc[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [answerContent, setAnswerContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qVoteStatus, setQVoteStatus] = useState<"upvoted" | "downvoted" | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Question
                const q = await databases.getDocument(db, questionCollection, questionId);
                setQuestion(q as unknown as QuestionDoc);

                // Fetch Answers
                const a = await databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", questionId),
                    Query.orderDesc("$createdAt")
                ]);
                setAnswers(a.documents as unknown as AnswerDoc[]);

                // Fetch User's Vote on Question
                if (user) {
                    const votes = await databases.listDocuments(db, voteCollection, [
                        Query.equal("type", "question"),
                        Query.equal("typeId", questionId),
                        Query.equal("votedById", user.$id)
                    ]);
                    if (votes.documents.length > 0) {
                        setQVoteStatus(votes.documents[0].voteStatus as "upvoted" | "downvoted");
                    }
                }
            } catch (error) {
                console.error("Error fetching question:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (hydrated) {
            fetchData();
        }
    }, [questionId, hydrated, user]);

    const handleVote = async (type: "question" | "answer", typeId: string, status: "upvoted" | "downvoted") => {
        if (!user) return alert("Please log in to vote.");
        
        // Optimistic UI for question
        if (type === "question") {
            setQVoteStatus(prev => prev === status ? null : status);
        }

        try {
            await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: status,
                    type,
                    typeId
                })
            });
        } catch (error) {
            console.error("Failed to vote", error);
        }
    };

    const submitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Please log in to answer.");
        if (!answerContent.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId,
                    answer: answerContent,
                    authorId: user.$id
                })
            });
            const newAnswer = await res.json();
            
            // Refetch answers or just prepend
            setAnswers(prev => [newAnswer, ...prev]);
            setAnswerContent("");
        } catch (error) {
            console.error("Failed to post answer", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20 text-neutral-400">Loading...</div>;
    if (!question) return <div className="text-center py-20 text-red-400">Question not found.</div>;

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">{question.title}</h1>
                <div className="flex gap-4 text-xs text-neutral-400 pb-4 border-b border-neutral-800">
                    <div>Asked <span className="text-neutral-200">{new Date(question.$createdAt).toLocaleDateString()}</span></div>
                </div>
            </div>

            <div className="flex gap-6 mb-12">
                {/* Voting Sidebar */}
                <div className="flex flex-col items-center gap-2">
                    <button 
                        onClick={() => handleVote("question", question.$id, "upvoted")}
                        className={`p-2 rounded-full border border-neutral-800 ${qVoteStatus === "upvoted" ? "bg-orange-500/20 text-orange-500 border-orange-500/50" : "text-neutral-400 hover:bg-neutral-800"}`}
                    >
                        <IconCaretUpFilled className="w-8 h-8" />
                    </button>
                    {/* We aren't tracking total score easily on client without aggregating all votes, so we leave it hidden or 0 for now */}
                    <span className="text-xl font-bold text-neutral-300"></span>
                    <button 
                        onClick={() => handleVote("question", question.$id, "downvoted")}
                        className={`p-2 rounded-full border border-neutral-800 ${qVoteStatus === "downvoted" ? "bg-cyan-500/20 text-cyan-500 border-cyan-500/50" : "text-neutral-400 hover:bg-neutral-800"}`}
                    >
                        <IconCaretDownFilled className="w-8 h-8" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed mb-8">
                        {question.content}
                    </div>
                    <div className="flex gap-2 mb-8">
                        {(question.tags || []).map((tag: string) => (
                            <span key={tag} className="px-2 py-1 bg-neutral-800 text-cyan-300 text-xs rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">{answers.length} Answers</h2>
                <div className="flex flex-col gap-8">
                    {answers.map(ans => (
                        <div key={ans.$id} className="flex gap-6 pb-8 border-b border-neutral-800">
                            <div className="flex flex-col items-center gap-2">
                                <button 
                                    onClick={() => handleVote("answer", ans.$id, "upvoted")}
                                    className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                                >
                                    <IconCaretUpFilled className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={() => handleVote("answer", ans.$id, "downvoted")}
                                    className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                                >
                                    <IconCaretDownFilled className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed mb-4">
                                    {ans.content}
                                </div>
                                <div className="text-xs text-neutral-500 text-right">
                                    answered {new Date(ans.$createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Answer */}
            {user ? (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Your Answer</h2>
                    <form onSubmit={submitAnswer}>
                        <textarea
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            className="w-full h-48 bg-neutral-900 border border-neutral-800 rounded-md px-4 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none mb-4"
                            placeholder="Write your answer here..."
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-cyan-500 text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Posting..." : "Post Your Answer"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-md text-center">
                    <p className="text-neutral-400 mb-4">You must be logged in to answer this question.</p>
                    <a href="/login" className="text-cyan-400 hover:underline">Log in</a>
                </div>
            )}
        </main>
    );
}

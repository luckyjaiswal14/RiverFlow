"use client";

import React from "react";
import Link from "next/link";

const POPULAR_TAGS = [
    { name: "react", description: "A JavaScript library for building user interfaces." },
    { name: "nextjs", description: "The React Framework for the Web." },
    { name: "typescript", description: "Typed JavaScript at Any Scale." },
    { name: "javascript", description: "The programming language of the Web." },
    { name: "python", description: "A programming language that lets you work quickly and integrate systems more effectively." },
    { name: "appwrite", description: "Open-source backend-as-a-service platform." },
    { name: "tailwindcss", description: "A utility-first CSS framework for rapid UI development." },
    { name: "node.js", description: "JavaScript runtime built on Chrome's V8 JavaScript engine." },
];

export default function TagsPage() {
    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Tags</h1>
            <p className="text-neutral-400 mb-8 max-w-2xl">
                A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {POPULAR_TAGS.map((tag) => (
                    <div key={tag.name} className="p-4 border border-neutral-800 rounded-lg bg-neutral-900/30 hover:border-cyan-500/50 transition-colors">
                        <Link href={`/questions?tag=${tag.name}`} className="inline-block px-2 py-1 bg-neutral-800 text-cyan-300 text-xs rounded mb-3">
                            {tag.name}
                        </Link>
                        <p className="text-sm text-neutral-400 line-clamp-3">
                            {tag.description}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}

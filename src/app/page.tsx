import Link from "next/link";
import React from "react";
import { IconDatabase, IconMessageCircle, IconThumbUp } from "@tabler/icons-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 font-sans text-neutral-50 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Main Content */}

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-32 pb-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Now in Beta
                </div>
                
                <h1 className="max-w-4xl text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-8 leading-[1.1]">
                    Every question has an answer. <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                        Find yours here.
                    </span>
                </h1>
                
                <p className="max-w-2xl text-lg sm:text-xl text-neutral-400 mb-12 leading-relaxed">
                    A modern, fast, and intelligent developer community. Ask questions, share your knowledge, build your reputation, and connect with developers worldwide.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link 
                        href="/questions" 
                        className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        Explore Questions
                    </Link>
                    <Link 
                        href="/login" 
                        className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-colors"
                    >
                        Join the Community
                    </Link>
                </div>

                {/* Features */}
                <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                            <IconMessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Ask & Discuss</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Got stuck? Ask the community. Engage in rich discussions, provide code snippets, and find the exact solution you need to unblock your workflow.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                            <IconThumbUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Vote & Validate</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            The best answers float to the top. Use our voting system to highlight correct and helpful answers, ensuring high-quality solutions are easy to find.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                            <IconDatabase className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Build Reputation</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Your contributions matter. Earn reputation points and unlock privileges as you help others, establishing yourself as an expert in the community.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

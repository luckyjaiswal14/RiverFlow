"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";

export default function Header() {
    const { user, logout, verifySession, hydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <header className="relative z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
                            R
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Riverflow</span>
                    </Link>
                </div>
                
                <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
                    <Link href="/questions" className="hover:text-cyan-400 transition-colors">Questions</Link>
                    <Link href="/tags" className="hover:text-cyan-400 transition-colors">Tags</Link>
                    <Link href="/users" className="hover:text-cyan-400 transition-colors">Users</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {hydrated && user ? (
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-neutral-300 hidden sm:block">
                                <span className="text-neutral-500">Reputation:</span> <span className="font-bold text-white">{user.prefs.reputation || 0}</span>
                            </div>
                            <Link href={`/users/${user.$id}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors">
                                {user.name}
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link 
                                href="/register" 
                                className="px-5 py-2 text-sm font-medium text-black bg-white hover:bg-neutral-200 rounded-full transition-colors"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

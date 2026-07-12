"use client";

import React, { useEffect, useState } from "react";

type UserType = {
    $id: string;
    name: string;
    registration: string;
    prefs: {
        reputation?: number;
    };
};

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-4">Users</h1>
            <p className="text-neutral-400 mb-8 max-w-2xl">
                Browse all the awesome developers building the Riverflow community. Build your reputation by asking and answering questions!
            </p>

            {isLoading ? (
                <div className="text-center py-20 text-neutral-400">Loading users...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <div key={user.$id} className="p-6 border border-neutral-800 rounded-lg bg-neutral-900/30 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-xl font-bold text-cyan-400 mb-4 uppercase">
                                {user.name.charAt(0)}
                            </div>
                            <h2 className="text-lg font-medium text-white mb-1 truncate w-full">{user.name}</h2>
                            <p className="text-sm text-neutral-400 mb-4">
                                Member since {new Date(user.registration).getFullYear()}
                            </p>
                            <div className="mt-auto px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-full text-xs font-semibold text-cyan-400">
                                {user.prefs?.reputation || 0} Rep
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

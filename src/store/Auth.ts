import { create } from "zustand";
import { account } from "@/models/client/config";
import { Models } from "appwrite";

export interface UserPrefs extends Models.Preferences {
    reputation: number;
}

interface AuthStore {
    session: Models.Session | null;
    user: Models.User<UserPrefs> | null;
    jwt: string | null;
    hydrated: boolean;
    setSession: (session: Models.Session | null) => void;
    setUser: (user: Models.User<UserPrefs> | null) => void;
    setJwt: (jwt: string | null) => void;
    verifySession: () => Promise<void>;
    createAccount: (name: string, email: string, password: string) => Promise<{ error?: { message: string } }>;
    login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    session: null,
    user: null,
    jwt: null,
    hydrated: false,
    setSession: (session) => set({ session }),
    setUser: (user) => set({ user }),
    setJwt: (jwt) => set({ jwt }),
    verifySession: async () => {
        try {
            const currentSession = await account.getSession("current");
            const currentUser = await account.get<UserPrefs>();
            const currentJwt = await account.createJWT();

            set({
                session: currentSession,
                user: currentUser,
                jwt: currentJwt.jwt,
                hydrated: true,
            });
        } catch (error) {
            console.error("No active session found", error);
            set({
                session: null,
                user: null,
                jwt: null,
                hydrated: true,
            });
        }
    },
    createAccount: async (name, email, password) => {
        try {
            await account.create("unique()", email, password, name);
            return await get().login(email, password);
        } catch (error: any) {
            return { error };
        }
    },
    login: async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await get().verifySession();
            return {};
        } catch (error: any) {
            return { error };
        }
    },
    logout: async () => {
        await account.deleteSession("current");
        set({ session: null, user: null, jwt: null });
    }
}));

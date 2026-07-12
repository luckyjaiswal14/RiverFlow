import { users } from "@/models/server/config";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const userList = await users.list();
        
        // Map to safe fields, excluding sensitive info
        const safeUsers = userList.users.map(u => ({
            $id: u.$id,
            name: u.name,
            registration: u.registration,
            prefs: u.prefs
        }));

        // Sort by reputation (highest first)
        safeUsers.sort((a, b) => {
            const repA = Number(a.prefs.reputation) || 0;
            const repB = Number(b.prefs.reputation) || 0;
            return repB - repA;
        });

        return NextResponse.json(safeUsers, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Failed to fetch users" },
            { status: error?.code || 500 }
        );
    }
}

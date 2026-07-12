import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const { votedById, voteStatus, type, typeId } = await request.json();

        // Fetch the item to know its author (for reputation)
        const collectionToUse = type === "question" ? questionCollection : answerCollection;
        const item = await databases.getDocument(db, collectionToUse, typeId);
        const authorId = item.authorId;

        // Check for existing vote
        const existingVotes = await databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("votedById", votedById),
        ]);

        const existingVote = existingVotes.documents[0];

        let reputationChange = 0;

        if (existingVote) {
            if (existingVote.voteStatus === voteStatus) {
                // Clicking the same vote toggles it off
                await databases.deleteDocument(db, voteCollection, existingVote.$id);
                // Reverse the previous reputation change
                reputationChange = voteStatus === "upvoted" ? -1 : 1;
            } else {
                // Switching vote
                await databases.updateDocument(db, voteCollection, existingVote.$id, {
                    voteStatus: voteStatus,
                });
                // Switch means reversing old vote AND applying new vote
                // Up -> Down = -2, Down -> Up = +2
                reputationChange = voteStatus === "upvoted" ? 2 : -2;
            }
        } else {
            // New vote
            await databases.createDocument(db, voteCollection, ID.unique(), {
                type: type,
                typeId: typeId,
                voteStatus: voteStatus,
                votedById: votedById,
            });
            reputationChange = voteStatus === "upvoted" ? 1 : -1;
        }

        // Apply reputation change
        if (reputationChange !== 0) {
            const prefs = await users.getPrefs<UserPrefs>(authorId);
            await users.updatePrefs(authorId, {
                reputation: (Number(prefs.reputation) || 0) + reputationChange,
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Error handling vote" },
            { status: error?.code || 500 }
        );
    }
}

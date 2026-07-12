import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
    // Creating Collection
    try {
        await databases.createCollection(db, voteCollection, voteCollection, [
            Permission.create("users"),
            Permission.read("any"),
            Permission.read("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Vote Collection Created");

        // Creating Attributes
        await Promise.all([
            databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
            databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
            databases.createEnumAttribute(
                db,
                voteCollection,
                "voteStatus",
                ["upvoted", "downvoted"],
                true
            ),
            databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
        ]);
        console.log("Vote Attributes Created");

        // create Indexes
        try {
            await Promise.all([
                databases.createIndex(
                    db,
                    voteCollection,
                    "type",
                    "key" as any,
                    ["type"],
                    ["asc" as any]
                ),
                databases.createIndex(
                    db,
                    voteCollection,
                    "typeId",
                    "key" as any,
                    ["typeId"],
                    ["asc" as any]
                ),
                databases.createIndex(
                    db,
                    voteCollection,
                    "votedById",
                    "key" as any,
                    ["votedById"],
                    ["asc" as any]
                )
            ]);
            console.log("Vote Indexes created");
        } catch (error: any) {
            console.log("Error creating Vote Indexes:", error?.message);
        }
    } catch (error: any) {
        console.log("Vote Collection already exists or error:", error?.message);
    }
}

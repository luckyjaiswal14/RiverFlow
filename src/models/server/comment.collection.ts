import { Permission } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    // Creating Collection
    try {
        await databases.createCollection(db, commentCollection, commentCollection, [
            Permission.create("users"),
            Permission.read("any"),
            Permission.read("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Comment Collection Created");

        // Creating Attributes
        await Promise.all([
            databases.createStringAttribute(db, commentCollection, "content", 10000, true),
            databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
            databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
            databases.createStringAttribute(db, commentCollection, "authorId", 50, true),
        ]);
        console.log("Comment Attributes Created");

        // create Indexes
        try {
            await Promise.all([
                databases.createIndex(
                    db,
                    commentCollection,
                    "type",
                    "key" as any,
                    ["type"],
                    ["asc" as any]
                ),
                databases.createIndex(
                    db,
                    commentCollection,
                    "typeId",
                    "key" as any,
                    ["typeId"],
                    ["asc" as any]
                )
            ]);
            console.log("Comment Indexes created");
        } catch (error: any) {
            console.log("Error creating Comment Indexes:", error?.message);
        }
    } catch (error: any) {
        console.log("Comment Collection already exists or error:", error?.message);
    }
}

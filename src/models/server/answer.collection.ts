import { Permission, Role } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  try {
    // Create Collection
    await databases.createCollection(
      db,
      answerCollection,
      answerCollection,
      [
        Permission.create(Role.users()),
        Permission.read(Role.any()),
        Permission.read(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log("✅ Answer Collection Created");

    // Create Attributes
    await Promise.all([
      databases.createStringAttribute(
        db,
        answerCollection,
        "content",
        10000,
        true
      ),
      databases.createStringAttribute(
        db,
        answerCollection,
        "questionId",
        50,
        true
      ),
      databases.createStringAttribute(
        db,
        answerCollection,
        "authorId",
        50,
        true
      ),
    ]);

    console.log("✅ Answer Attributes Created");
  } catch (error) {
    console.error("❌ Error creating Answer Collection:", error);
  }
}


import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

import { databases } from "./config";

import env from "@/env";

export default async function getOrCreateDB(){
  console.log("Using env:", env.appwrite.endpoint, env.appwrite.projectId)
  try {
    await databases.get(db)
    console.log("Database connected")
  } catch (error: any) {
    console.log("Error getting database:", error?.message || error)
    try {
      await databases.create(db, db)
      console.log("database created")
    } catch (error) {
      console.log("Error creating databases", error)
    }
  }

  try {
    await Promise.all([
      createQuestionCollection(),
      createAnswerCollection(),
      createCommentCollection(),
      createVoteCollection(),
    ])
    console.log("Collections created")
  } catch (error) {
    console.log("Error creating collections", error)
  }

  return databases
}
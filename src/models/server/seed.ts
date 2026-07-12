import getOrCreateDB from "./dbSetup";
import getOrCreateStorage from "./storageSetup";

export default async function seed() {
    try {
        console.log("Starting Appwrite Database and Storage Setup...");
        await getOrCreateDB();
        await getOrCreateStorage();
        console.log("Appwrite Database and Storage Setup Completed successfully.");
    } catch (error) {
        console.error("Error setting up Appwrite:", error);
    }
}
seed();

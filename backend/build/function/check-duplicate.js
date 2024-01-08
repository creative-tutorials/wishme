import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../database/xata.js";
// Initialize the xata client
const xata = getXataClient();
/**
 * Function to check if a duplicate product exists in the database
 * @param name - The name of the product
 * @param url - The URL of the product
 * @returns True if a duplicate product is found, otherwise false
 */
export async function checkForDuplicate(name, url) {
    try {
        // Filter the products in the database by the provided name and URL
        const records = await xata.db.products
            .filter({
            productName: name,
            url: url,
        })
            .getMany();
        if (records && records.length !== 0) {
            // If there are records (products) that match the provided name and URL, return true (indicating a duplicate)
            return true;
        }
        else {
            // If no records (products) match the provided name and URL, return false (indicating no duplicate)
            return false;
        }
    }
    catch (error) {
        console.log("error", error);
        throw error;
        // Logging errors that may occur during database operation
    }
}
//# sourceMappingURL=check-duplicate.js.map
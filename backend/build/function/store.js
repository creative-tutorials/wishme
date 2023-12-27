import dotenv from "dotenv";
dotenv.config();
import { randomUUID } from "crypto";
import { getXataClient } from "../database/xata.js";
const xata = getXataClient();
/**
 * The storeData function stores the given product data in the database.
 *
 * @param data - An object containing the _**platform**_, _**URL**_, _**product name**_, and _**price**_ of the product.
 * @param userid - The ID of the user who added the product.
 * @returns - A string indicating that the data was stored successfully.
 * @throws - Throws an error if the data fails to be stored.
 */
export async function storeData(data, userid) {
    try {
        // Create a new record in the products table with the given data
        const record = await xata.db.products.create({
            platform: data.platform,
            productName: data.productName,
            price: data.price,
            url: data.url,
            productID: randomUUID(),
            userid: userid,
        });
        console.log("record", record);
        return "Data stored";
    }
    catch (error) {
        throw new Error("Failed to store data");
    }
}
//# sourceMappingURL=store.js.map
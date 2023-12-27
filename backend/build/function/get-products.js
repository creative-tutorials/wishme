import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../database/xata.js";
const xata = getXataClient();
/**
 * Fetches products for a given user ID.
 *
 * @param {string} userid - The ID of the user.
 * @return {Promise<Readonly<SelectedPick<ProductsRecord, ["*"]>>[]>} - A promise that resolves to an array of product records.
 * @throws {Error} - If no products are found.
 */
export async function fetchProducts(userid) {
    const records = await xata.db.products
        .filter({
        userid: userid,
    })
        .getAll();
    if (records && records.length !== 0) {
        return records;
    }
    else {
        throw new Error("No product found");
    }
}
//# sourceMappingURL=get-products.js.map
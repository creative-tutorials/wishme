import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../database/xata.js";
const xata = getXataClient();
/**
 * Deletes a product by its ID.
 *
 * @param {string} id - The ID of the product to delete.
 * @return {Promise<string>} A Promise that resolves to a success message if the product is deleted successfully.
 * @throws {Error} If the product is not found or if there is an error during the deletion process.
 */
export async function deleteProduct(id) {
    try {
        console.log(id);
        const product = await xata.db.products.delete(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return "Product deleted successfully";
    }
    catch (error) {
        throw new Error(error.message);
    }
}
//# sourceMappingURL=delete-product.js.map
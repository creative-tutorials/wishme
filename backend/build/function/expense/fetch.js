import dotenv from "dotenv";
dotenv.config();
import { getXataClient } from "../../database/xata.js";
const xata = getXataClient();
/**
 * Fetches expenses for a given user.
 *
 * @param {string} userid - The ID of the user.
 * @return {Promise<Readonly<SelectedPick<ExpenseRecord, ["*"]>>[]>} - An array of expense records.
 */
export async function fetchExpenses(userid) {
    const records = await xata.db.expense
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
//# sourceMappingURL=fetch.js.map
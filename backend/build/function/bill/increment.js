import { getXataClient } from "../../database/xata.js";
import dotenv from "dotenv";
dotenv.config();
const xata = getXataClient();
export async function incrementUsage(userid) {
    try {
        const data = await xata.db.usage.update(userid, {
            usage: { $increment: 1 },
        });
        if (data) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to increment usage");
    }
}
//# sourceMappingURL=increment.js.map
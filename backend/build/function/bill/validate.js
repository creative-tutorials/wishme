import { getXataClient } from "../../database/xata.js";
import dotenv from "dotenv";
dotenv.config();
const xata = getXataClient();
export async function validateBill(userid, username) {
    try {
        const data = await xata.db.usage
            .filter({ userid: userid, username: username })
            .getMany();
        if (data.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to validate bill");
    }
}
//# sourceMappingURL=validate.js.map
import { getXataClient } from "../../database/xata.js";
import dotenv from "dotenv";
dotenv.config();

const xata = getXataClient();

export async function createNewInvoice(userid: string, username: string) {
  try {
    const record = await xata.db.usage.create({
      userid: userid,
      username: username,
      usage: 0,
    });

    if (record) {
      return true;
    } else {
      throw new Error("Failed to create new invoice");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create new invoice");
  }
}

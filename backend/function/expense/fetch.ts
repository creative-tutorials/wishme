import dotenv from "dotenv";
dotenv.config();

import { getXataClient, ExpenseRecord } from "../../database/xata.js";
import { SelectedPick } from "@xata.io/client";

const xata = getXataClient();

/**
 * Fetches expenses for a given user.
 *
 * @param {string} userid - The ID of the user.
 * @return {Promise<Readonly<SelectedPick<ExpenseRecord, ["*"]>>[]>} - An array of expense records.
 */

export async function fetchExpenses(
  userid: string
): Promise<Readonly<SelectedPick<ExpenseRecord, ["*"]>>[]> {
  const records = await xata.db.expense
    .filter({
      userid: userid,
    })
    .getAll();

  if (records && records.length !== 0) {
    return records;
  } else {
    throw new Error("No product found");
  }
}

import dotenv from "dotenv";
dotenv.config();

import { getXataClient } from "../../database/xata.js";

const xata = getXataClient();

/**
 * Deletes an expense with the given id.
 *
 * @param {string} id - The id of the expense to delete.
 * @return {Promise<string>} A Promise that resolves to a string indicating the success of the deletion.
 */

export async function deleteExpense(id: string): Promise<string> {
  try {
    console.log(id);

    const expense = await xata.db.expense.delete(id);

    console.log(expense);

    if (!expense) {
      throw new Error("No data found");
    }

    return "Deleted successfully";
  } catch (error: any) {
    throw new Error(error.message);
  }
}

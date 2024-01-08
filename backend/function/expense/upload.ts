import dotenv from "dotenv";
dotenv.config();

import { getXataClient } from "../../database/xata.js";
const xata = getXataClient();

const returnDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export async function UploadExpense(
  userid: string,
  title: string,
  category: string,
  price: string,
  code: string
) {
  try {
    const record = await xata.db.expense.create({
      title: title,
      category: category,
      price: price,
      code: code,
      userid: userid,
      date: returnDate(),
    });

    if (record) {
      return "Expense uploaded";
    } else {
      throw new Error("Failed to upload expense");
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to upload expense");
  }
}

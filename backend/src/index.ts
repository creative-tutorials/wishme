import dotenv from "dotenv";
dotenv.config();
import express, { Express, urlencoded, json } from "express";
import { Request, Response, NextFunction } from "express";

import { IncomingHttpHeaders } from "http";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import { UploadExpense } from "../function/expense/upload.js";
import { fetchExpenses } from "../function/expense/fetch.js";
import { deleteExpense } from "../function/expense/delete.js";

import { validateBill } from "../function/bill/validate.js";
import { incrementUsage } from "../function/bill/increment.js";
import { createNewInvoice } from "../function/bill/create-invoice.js";

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS!);
const corsOptions = {
  origin: allowedOrigins,
};

const app: Express = express();

// middleware
app.use(cors(corsOptions));
app.use(json({ limit: "500kb" }));
app.use(urlencoded({ limit: "500kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "500kb", extended: false }));
const port = process.env.PORT;

if (!port) throw new Error("Port not found");

type CustomHeaders = IncomingHttpHeaders & {
  apikey: string;
  userid: string;
};

const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { apikey, userid } = req.headers as CustomHeaders;
  const serverKey = process.env.SERVER_APIKEY;
  if (apikey === serverKey || userid) next();
  else res.status(401).send({ error: "Unauthorized" });
};

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes api rate limit
  limit: 20, // limit each IP to 20 requests per windowMs
  message: { error: "Too many requests, please try again after 5 minutes." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter); // apply rate limiting to all requests

app.get("/status", async (_, res) => {
  res.send("OK");
});

type Item = {
  title: string;
  category: string;
  price: string;
  code: string;
};

type Bill = {
  username: string;
};

const checkFieldValue = (req: Request, res: Response, next: NextFunction) => {
  const { title, category, price, code }: Item = req.body;

  if (!title || !category || !price || !code) {
    res.status(400).send({ error: "one or more fields are missing" });
  } else {
    next();
  }
};

const checkRecordField = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ error: "id is missing" });
  } else {
    next();
  }
};

const checkBillRequest = (req: Request, res: Response, next: NextFunction) => {
  const { userid } = req.params;
  const { username }: Bill = req.body;

  if (!userid || !username) {
    res.status(400).send({ error: "userid or username is missing" });
  } else {
    next();
  }
};

app.post(
  "/api/upload",
  validateAuth,
  checkFieldValue,
  async (req: Request, res: Response) => {
    const { title, category, price, code }: Item = req.body;
    const { userid } = req.headers as CustomHeaders;
    try {
      const data = await UploadExpense(userid, title, category, price, code);
      res.send({ data });
      console.log("data", { data });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
      console.log("err", err);
    }
  }
);

app.get("/api/expense", validateAuth, async (req: Request, res: Response) => {
  const { userid } = req.headers as CustomHeaders;

  try {
    const data = await fetchExpenses(userid);

    res.send(data);
  } catch (err: any) {
    console.log("err", err);
    res.status(500).send({ error: err.message });
  }
});

app.delete(
  "/api/expense/:id",
  validateAuth,
  checkRecordField,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await deleteExpense(id);
      console.log("delete", data);
      res.send({ data });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
      console.log(err);
    }
  }
);

app.post(
  "/api/bill/:userid",
  validateAuth,
  checkBillRequest,
  async (req: Request, res: Response) => {
    const { userid } = req.params;
    const { username }: Bill = req.body;

    try {
      const isValidBill = await validateBill(userid, username);

      if (isValidBill) {
        const incrementResult = await incrementUsage(userid);
        res.send({ result: incrementResult });
      } else {
        const newInvoice = await createNewInvoice(userid, username);
        res.send({ invoice: newInvoice });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

app.listen(port, () => {
  console.log(
    `🟢 [server] Application is online and listening on port ${port}.`
  );
});

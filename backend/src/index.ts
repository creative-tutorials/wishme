import dotenv from "dotenv";
dotenv.config();
import express, { Express, urlencoded, json } from "express";
import { Request, Response, NextFunction } from "express";

import { IncomingHttpHeaders } from "http";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import { typePlatform } from "../types/app-types.js";
import { scrapeProduct } from "../function/scrape.js";
import { fetchProducts } from "../function/get-products.js";
import { deleteProduct } from "../function/delete-product.js";
// import { randomUUID } from "crypto";
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
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);

app.get("/status", async (_, res) => {
  res.send("OK");
});

type Item = {
  id: string;
  url: string;
  platform: typePlatform;
};

const checkFieldValue = (req: Request, res: Response, next: NextFunction) => {
  const { url, platform }: Item = req.body;

  if (!url || !platform) {
    res.status(400).send({ error: "Missing url or platform" });
  } else if (platform === "amazon" && url.includes("amazon")) {
    next();
  } else if (platform === "ebay" && url.includes("ebay")) {
    next();
  } else if (platform === "jumia" && url.includes("jumia")) {
    next();
  } else {
    res.status(400).send({ error: "Invalid platform" });
  }
};

const checkRecordField = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ error: "userid or productid is missing" });
  } else {
    next();
  }
};

app.post(
  "/api/upload",
  validateAuth,
  checkFieldValue,
  async (req: Request, res: Response) => {
    const { url, platform }: Item = req.body;
    const { userid } = req.headers as CustomHeaders;
    try {
      const data = await scrapeProduct(url, platform, userid);
      res.send({ data });
      console.log("data", { data });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
      console.log("err", err);
    }
  }
);

app.get("/api/products", validateAuth, async (req: Request, res: Response) => {
  const { userid } = req.headers as CustomHeaders;

  try {
    const data = await fetchProducts(userid);

    res.send(data);
  } catch (err: any) {
    console.log("err", err);
    res.status(500).send({ error: err.message });
  }
});

app.delete(
  "/api/products/:id",
  validateAuth,
  checkRecordField,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await deleteProduct(id);
      console.log("delete", data);
      res.send({ data });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
      console.log(err);
    }
  }
);

app.listen(port, () => {
  console.log(
    `🟢 [server] Application is online and listening on port ${port}.`
  );
});

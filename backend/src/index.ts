import dotenv from "dotenv";
dotenv.config();
import express, { Express, urlencoded, json } from "express";
import { Request, Response, NextFunction } from "express";
import { getXataClient } from "./xata.js";
// import { ParamsDictionary } from "express-serve-static-core";
import { typePlatform } from "../types/app-types.js";
import { IncomingHttpHeaders } from "http";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import puppeteer from "puppeteer";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";

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

if (!process.env.PORT) throw new Error("Port not found");

const xata = getXataClient();

type CustomHeaders = IncomingHttpHeaders & {
  apikey: string;
};

const checkAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const { apikey } = req.headers as CustomHeaders;
  const serverKey = process.env.SERVER_APIKEY;
  console.log("headers", apikey);
  if (apikey === serverKey) next();
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

app.post(
  "/api/upload",
  checkAPIKey,
  checkFieldValue,
  async (req: Request, res: Response) => {
    const { url, platform }: Item = req.body;

    scrapeProduct(url, platform)
      .then((data) => {
        res.send(data);
        console.log("data", data);
      })
      .catch((err) => {
        res.status(500).send(err.message);
        console.log("err", err);
      });
  }
);

async function scrapeProduct(url: string, platform: typePlatform) {
  console.log("url", url);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
    });
  } catch (err) {
    throw new Error("Failed to launch browser");
  }
  const page = await browser?.newPage();

  try {
    const website_url = url;
    await page?.goto(website_url, { waitUntil: "networkidle0" });
  } catch (err) {
    throw new Error("Failed to navigate to page");
  }

  const selectors = {
    amazon: ".a-price-whole",
    ebay: ".x-price-primary",
    jumia: ".-prxs",
  };

  let selector = "";

  if (platform === "amazon" || url.includes("amazon")) {
    selector = selectors.amazon;
  } else if (platform === "ebay" || url.includes("ebay")) {
    selector = selectors.ebay;
  } else if (platform === "jumia" || url.includes("jumia")) {
    selector = selectors.jumia;
  } else {
    throw new Error("Platform not found");
  }

  const scrapedData = await page.evaluate(
    (selector, platform, url) => {
      // select elements from the HTML document..
      let productName = document.querySelector("h1")?.textContent as string;
      let price = document.querySelector(selector)?.textContent as string;

      // Check for whitespace and remove if it exists
      if (productName && productName.includes(" ")) {
        productName = productName.replace(/\s/g, ""); // removing all whitespace characters from the `productName` string
      } else {
        return; // Return nothing if no whitespace is found
      }

      // Check if selector contains css class of "a-price-whole" or "x-price-primary"
      if (selector === ".a-price-whole" && price) {
        price = price.replace(/\n/g, "").replace(".", ""); // Removing all whitespace and the full stop
      } else if (selector === ".x-price-primary" && price) {
        price = price.replace(/\s/g, "").replace("US", ""); // Removing all whitespace and the "US" string
      } else if (selector === ".-prxs" && price) {
        price = price.replace(/\s/g, ""); // Removing all whitespace
      }
      console.log({ platform });
      // Return data as an object
      return { platform, url, productName, price };
    },
    selector,
    platform,
    url
  );

  await browser.close();

  if (!scrapedData) {
    throw new Error("Failed to scrape data");
  } else {
    const jsonData = scrapedData;

    return jsonData;

    // TODO: Add data to Xata
  }

  // console.log("data:", jsonData);
}

app.listen(port, () => {
  console.log(
    `🟢 [server] Application is online and listening on port ${port}.`
  );
});

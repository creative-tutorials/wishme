import puppeteer from "puppeteer";
import { storeData } from "./store.js";
import { checkForDuplicate } from "./find-duplicate.js";
export async function scrapeProduct(url, platform, userid) {
    console.log({ url });
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
        });
    }
    catch (err) {
        console.log("err from fail lauch", err);
        throw new Error("Failed to launch browser");
    }
    const page = await browser?.newPage();
    try {
        const website_url = url;
        await page?.goto(website_url, { waitUntil: "load" });
    }
    catch (err) {
        console.log("err from fail page", err);
        throw new Error("TimeoutError: Failed to navigate to page");
    }
    const selectors = {
        amazon: ".a-price-whole",
        ebay: ".x-price-primary",
        jumia: ".-prxs",
    };
    let selector = "";
    if (platform === "amazon" || url.includes("amazon")) {
        selector = selectors.amazon;
    }
    else if (platform === "ebay" || url.includes("ebay")) {
        selector = selectors.ebay;
    }
    else if (platform === "jumia" || url.includes("jumia")) {
        selector = selectors.jumia;
    }
    else {
        throw new Error("Platform not found");
    }
    const scrapedData = await page.evaluate((selector, platform, url) => {
        // select elements from the HTML document..
        let productName = document.querySelector("h1")?.textContent;
        let price = document.querySelector(selector)?.textContent;
        // Check for whitespace and remove if it exists
        if (productName && productName.includes(" ")) {
            productName = productName.replace(/\s/g, ""); // removing all whitespace characters from the `productName` string
        }
        else {
            return; // Return nothing if no whitespace is found
        }
        // .
        // Check if selector contains css class of "a-price-whole" or "x-price-primary"
        if (selector === ".a-price-whole" && price) {
            price =
                "$" +
                    price
                        .replace(/\n/g, "")
                        .replace(".", "")
                        .replace(/[a-zA-Z/]/g, "");
        }
        else if (selector === ".x-price-primary" && price) {
            price = price.replace(/\s/g, "").replace(/[a-zA-Z/]/g, "");
        }
        else if (selector === ".-prxs" && price) {
            price = price.replace(/\s/g, "").replace(/[a-zA-Z/]/g, "");
        }
        console.log({ platform });
        // Return data as an object
        return { platform, url, productName, price };
    }, selector, platform, url);
    await browser.close();
    if (!scrapedData) {
        throw new Error("Failed to scrape data");
    }
    else {
        const jsonData = scrapedData;
        try {
            const isDuplicate = await checkForDuplicate(jsonData.productName, jsonData.url);
            if (isDuplicate)
                throw new Error("You already have this product");
            const data = await storeData(jsonData, userid);
            console.log(jsonData);
            return data;
        }
        catch (error) {
            console.log("Error storing data", error);
            throw error;
        }
    }
}
//# sourceMappingURL=scrape.js.map
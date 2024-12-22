const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Hàm crawl dữ liệu
async function crawlImmediately() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = "https://arxiv.org/list/nlin.CD/recent";
    await page.goto(url, { waitUntil: "networkidle2" });

    // Trích xuất dữ liệu bài báo (chỉ lấy title, authors, pdfLink)
    const articles = await page.$$eval("dl > dt", items =>
      items.map(item => {
        const title = item.nextElementSibling.querySelector(".list-title")
          ?.textContent.trim().replace(/^Title:\s*/, "") || "Unknown Title";
        const authors = item.nextElementSibling.querySelector(".list-authors")
          ?.textContent.trim().replace(/^Authors:\s*/, "") || "Unknown Authors";
        const pdfLink = item.querySelector('a[title="Download PDF"]')
          ?.href || "No PDF Link";

        return { title, authors, pdfLink };
      })
    );

    console.log(`Found ${articles.length} articles.`);

    // Tạo file CSV
    const outputDir = path.join(process.cwd(), "src/public");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const csvPath = path.join(outputDir, "articles.csv");
    const csvContent = [
      "title,authors,pdfLink",
      ...articles.map(article =>
        `"${article.title}","${article.authors}","${article.pdfLink}"`
      ),
    ].join("\n");

    fs.writeFileSync(csvPath, csvContent);
    console.log(`CSV file created: ${csvPath}`);

    await browser.close();
    console.log("Crawling completed!");
  } catch (error) {
    console.error("Error during crawling:", error.message);
  }
}

// Endpoint API (nếu cần kiểm tra qua API)
router.get("/start", async (req, res) => {
  try {
    await crawlImmediately();
    res.status(200).json({ message: "Crawling completed!" });
  } catch (error) {
    res.status(500).json({ message: "Error during crawling", error: error.message });
  }
});

module.exports = { crawlImmediately, router };

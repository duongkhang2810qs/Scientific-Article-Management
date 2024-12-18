const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function crawlImmediately() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = "https://arxiv.org/list/nlin.CD/recent";
    await page.goto(url, { waitUntil: "networkidle2" });

    const pdfLinks = await page.$$eval('a[title="Download PDF"]', links =>
      links.map(link => ({
        href: link.href,
        title: link.closest("dt").nextElementSibling.querySelector(".list-title").textContent.trim(),
      }))
    );

    console.log(`Found ${pdfLinks.length} PDF links.`);

    const outputDir = path.join(__dirname, "../public/pdfs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const { href, title } of pdfLinks) {
      const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
      const pdfPath = path.join(outputDir, `${sanitizedTitle}.pdf`);

      console.log(`Downloading: ${title}`);
      const response = await axios.get(href, { responseType: "stream" });
      const writer = fs.createWriteStream(pdfPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      console.log(`Saved: ${pdfPath}`);
    }

    await browser.close();
    console.log("Crawling completed!");
  } catch (error) {
    console.error("Error during crawling:", error.message);
  }
}

module.exports = crawlImmediately;

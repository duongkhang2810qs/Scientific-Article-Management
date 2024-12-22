const puppeteer = require("puppeteer"); // Import thư viện Puppeteer để tự động hóa trình duyệt
const axios = require("axios"); // Import axios để gửi yêu cầu HTTP
const fs = require("fs"); // Import fs và path để làm việc với tệp tin và đường dẫn
const path = require("path"); 

// Hàm chính để thực hiện quá trình crawl dữ liệu ngay lập tức
async function crawlImmediately() {
  try {
    // Khởi chạy trình duyệt Puppeteer ở chế độ headless
    const browser = await puppeteer.launch({ headless: true }); 
    const page = await browser.newPage();

     // URL của trang web cần crawl
    const url = "https://arxiv.org/list/nlin.CD/recent";
    // Điều hướng đến URL và chờ cho đến khi mạng ổn định
    await page.goto(url, { waitUntil: "networkidle2" });

    // Lấy tất cả các đường dẫn tải PDF và tiêu đề liên quan
    const pdfLinks = await page.$$eval('a[title="Download PDF"]', links =>
      links.map(link => ({
        href: link.href,
        title: link.closest("dt").nextElementSibling.querySelector(".list-title").textContent.trim(),
      }))
    );

    console.log(`Found ${pdfLinks.length} PDF links.`);

    // Thư mục lưu file PDF
    const outputDir = path.join(__dirname, "../public/pdfs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
    }

    // Duyệt qua từng đường dẫn PDF và tải xuống
    for (const { href, title } of pdfLinks) {
      // Thay thế các ký tự không hợp lệ trong tiêu đề bằng "_"
      const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
      const pdfPath = path.join(outputDir, `${sanitizedTitle}.pdf`);

      console.log(`Downloading: ${title}`);
      const response = await axios.get(href, { responseType: "stream" }); // Gửi yêu cầu GET để tải file PDF
      const writer = fs.createWriteStream(pdfPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => { // Đợi cho đến khi ghi tệp hoàn tất
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      console.log(`Saved: ${pdfPath}`);
    }

    await browser.close(); // Đóng trình duyệt Puppeteer
    console.log("Crawling completed!");
  } catch (error) {
    console.error("Error during crawling:", error.message); // Xử lý lỗi xảy ra trong quá trình crawl
  }
}

module.exports = crawlImmediately; // Xuất hàm crawlImmediately để sử dụng ở các file khác

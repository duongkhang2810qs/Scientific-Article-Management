// Import thư viện nodemailer để gửi email
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
   // 1) Tạo một transporter để định cấu hình cách gửi email
  const transport = nodemailer.createTransport({
    service: "gmail", // Sử dụng dịch vụ Gmail để gửi email
    auth: { // Xác thực người gửi bằng tài khoản Gmail
      user: process.env.MAIL_USERNAME, // Email của người gửi, lấy từ biến môi trường
      pass: process.env.MAIL_PASSWORD, // Email của người gửi, lấy từ biến môi trường
    },
  });
  // 2) Định nghĩa các thông tin của email
  const mailOptions = {
    from: "NCKH <trungnguyenraz@gmail.com>", // Địa chỉ email của người gửi
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Thực hiện gửi email với cấu hình và nội dung đã định nghĩa
  await transport.sendMail(mailOptions);
};
// Xuất hàm sendEmail để sử dụng ở các file khác
module.exports = sendEmail;

/* eslint-disable */
// Import các thư viện và hàm cần thiết
import "@babel/polyfill";
import { login, logout } from "./login.js";
import { showAlert } from "./alerts.js";
import { newuser } from "./new_user.js";
import { newtopic } from "./project.js";
import { changePass } from "./changePass.js";
import { new_notify } from "./new_notify.js";
import { fixuser } from "./fixuser.js";
import { forgotPass } from "./forgotPass.js";
import { resetPass } from "./resetPass.js";

// Lấy các phần tử DOM
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".logout");
const forgot = document.querySelector(".form--forgot");
const reset = document.querySelector(".form--reset");
const userfrom = document.querySelector(".new-user");
const projectform = document.querySelector(".newtopic");
const changepass = document.querySelector(".change_pass");
const new_notifyform = document.querySelector(".notify");
const delete_notify = document.querySelector(".delete_notify");

// Xử lý sự kiện thêm thông báo mới
if (new_notifyform) {
  new_notifyform.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn hành động mặc định của form
    const ThongBao = document.getElementById("thongbao").value; // Lấy nội dung thông báo
    const NoiDung = document.getElementById("noidung").value; // Lấy nội dung chi tiết
    new_notify(ThongBao, NoiDung); // Gửi thông báo mới
  });
}

// Xử lý sự kiện thêm người dùng mới
if (userfrom) {
  userfrom.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value; // Lấy ID người dùng
    const password = document.getElementById("password").value; // Lấy mật khẩu
    const name = document.getElementById("name").value; // Lấy tên
    const role = document.getElementById("role").value; // Lấy vai trò
    newuser(id, password, name, role); // Tạo người dùng mới
  });
}

// Xử lý sự kiện đổi mật khẩu
if (changepass) {
  changepass.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("oldpassword").value; // Mật khẩu cũ
    const newPassword = document.getElementById("password").value; // Mật khẩu mới
    changePass(password, newPassword); // Gửi yêu cầu đổi mật khẩu
  });
}

// Xử lý sự kiện chỉnh sửa thông tin người dùng
if (fixuser) {
  fixuser.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("ten").value; // Tên mới
    const email = document.getElementById("email").value; // Email mới
    const gioitinh = document.getElementById("gioitinh").value; // Giới tính
    const sdt = document.getElementById("sodienthoai").value; // Số điện thoại
    const khoa = document.getElementById("khoa").value; // Khoa
    changePass(name, email, gioitinh, sdt, khoa); // Gửi yêu cầu cập nhật thông tin
  });
}

// Xử lý sự kiện tạo đề tài mới
if (projectform) {
  projectform.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(); // Tạo đối tượng FormData
    formData.append("TenDeTai", document.getElementById("tendetai").value); // Tên đề tài
    formData.append("NgayThucHien", document.getElementById("ngaybatdau").value); // Ngày bắt đầu
    formData.append("NgayKetThuc", document.getElementById("ngayketthuc").value); // Ngày kết thúc
    formData.append("GiangVien", document.getElementById("giangvien").value); // Giảng viên hướng dẫn
    formData.append("MaNganh", document.getElementById("MaNganh").value); // Mã ngành

    const files = document.getElementById("file_de_tai"); // File đính kèm
    if (files.files.length > 0) {
      formData.append("files", files.files[0]);
    }

    const ThanhvienElement = document.getElementById("thanhvien");
    const Thanhvien = Array.from(ThanhvienElement.selectedOptions).map(
      (option) => option.value // Danh sách thành viên
    );
    Thanhvien.forEach((item) => {
      formData.append("ThanhVien", item);
    });

    formData.append("MoTa", document.getElementById("mota").value); // Mô tả đề tài

    newtopic(formData); // Gửi yêu cầu tạo đề tài mới
  });
}

// Xử lý sự kiện đăng nhập
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value; // ID đăng nhập
    const password = document.getElementById("password").value; // Mật khẩu
    login(id, password); // Gửi yêu cầu đăng nhập
  });

// Xử lý sự kiện đăng xuất
if (logOutBtn) logOutBtn.addEventListener("click", logout);

// Xử lý sự kiện quên mật khẩu
if (forgot) {
  forgot.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id-forgot").value; // ID người dùng
    forgotPass(id); // Gửi yêu cầu quên mật khẩu
  });
}

// Xử lý sự kiện đặt lại mật khẩu
if (reset) {
  reset.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value; // Mật khẩu mới
    resetPass(password); // Gửi yêu cầu đặt lại mật khẩu
  });
}

// Hiển thị thông báo từ dataset nếu có
const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);

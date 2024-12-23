/* eslint-disable */
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
// DOM ELEMENTS
const loginForm = document.querySelector(".form--login"); // Form đăng nhập
const logOutBtn = document.querySelector(".logout"); // Nút đăng xuất
const forgot = document.querySelector(".form--forgot"); // Form quên mật khẩu
const reset = document.querySelector(".form--reset"); // Form đặt lại mật khẩu

// const userDataForm = document.querySelector(".form-user-data");
// const userPasswordForm = document.querySelector(".form-user-password");
const userfrom = document.querySelector(".new-user"); // Form tạo người dùng mới
const projectform = document.querySelector(".newtopic"); // Form tạo đề tài mới
const changepass = document.querySelector(".change_pass"); // Form đổi mật khẩu
const new_notifyform = document.querySelector(".notify"); // Form thông báo mới
const delete_notify = document.querySelector(".delete_notify"); // Form xóa thông báo
const get_conversation = document.querySelector("#get_conversation"); // Lấy danh sách hội thoại

// Xử lý khi gửi form thông báo mới
if (delete_notify) {
  new_notifyform.addEventListener("submit", (e) => {
    e.preventDefault();
    const ThongBao = document.getElementById("data-id").value;

    new_notify(ThongBao, NoiDung);
  });
}

// Xử lý khi gửi form thông báo mới
if (new_notifyform) {
  new_notifyform.addEventListener("submit", (e) => {
    e.preventDefault();
    const ThongBao = document.getElementById("thongbao").value;
    const NoiDung = document.getElementById("noidung").value;
    new_notify(ThongBao, NoiDung);
  });
}

// Xử lý khi gửi form tạo người dùng mới
if (userfrom) {
  userfrom.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    newuser(id, password, name, role);
  });
}

// Xử lý khi gửi form đổi mật khẩu
if (changepass) {
  changepass.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("oldpassword").value;
    const newPassword = document.getElementById("password").value;
    changePass(password, newPassword);
  });
}

// Xử lý khi gửi form chỉnh sửa người dùng
if (fixuser) {
  fixuser.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("ten").value;
    const email = document.getElementById("email").value;
    const gioitinh = document.getElementById("gioitinh").value;
    const sdt = document.getElementById("sodienthoai").value;
    const khoa = document.getElementById("khoa").value;
    const trinhdo = document.getElementById("trinhdo").value;
    const lop = document.getElementById("lop").value;
    changePass(name, email, gioitinh, sdt, khoa, trinhdo, lop);
  });
}

// Xử lý khi gửi form tạo đề tài mới
if (projectform) {
  projectform.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("TenDeTai", document.getElementById("tendetai").value);
    formData.append(
      "NgayThucHien",
      document.getElementById("ngaybatdau").value
    );
    formData.append(
      "NgayKetThuc",
      document.getElementById("ngayketthuc").value
    );
    formData.append("GiangVien", document.getElementById("giangvien").value);
    formData.append("MaNganh", document.getElementById("MaNganh").value);
    const files = document.getElementById("file_de_tai");
    if (files.files.length > 0) {
      formData.append("files", files.files[0]);
    }
    const ThanhvienElement = document.getElementById("thanhvien");
    const Thanhvien = Array.from(ThanhvienElement.selectedOptions).map(
      (option) => option.value
    );
    Thanhvien.forEach((item) => {
      formData.append("ThanhVien", item);
    });

    formData.append("MoTa", document.getElementById("mota").value);

    newtopic(formData);
  });
}

// Xử lý khi gửi form đăng nhập
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const password = document.getElementById("password").value;
    login(id, password);
  });

// Xử lý khi nhấn nút đăng xuất
if (logOutBtn) logOutBtn.addEventListener("click", logout);

// Xử lý khi gửi form quên mật khẩu
if (forgot) {
  forgot.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id-forgot").value;
    forgotPass(id);
  });
}

// Xử lý khi gửi form đặt lại mật khẩu
if (reset) {
  reset.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value;
    resetPass(password);
  });
}

// Hiển thị thông báo nếu có
const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);

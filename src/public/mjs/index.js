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
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".logout");
const forgot = document.querySelector(".form--forgot");
const reset = document.querySelector(".form--reset");

// const userDataForm = document.querySelector(".form-user-data");
// const userPasswordForm = document.querySelector(".form-user-password");
const userfrom = document.querySelector(".new-user");
const projectform = document.querySelector(".newtopic");
const changepass = document.querySelector(".change_pass");
const new_notifyform = document.querySelector(".notify");
const delete_notify = document.querySelector(".delete_notify");
const get_conversation = document.querySelector("#get_conversation");

if (delete_notify) {
  new_notifyform.addEventListener("submit", (e) => {
    e.preventDefault();
    const ThongBao = document.getElementById("data-id").value;

    new_notify(ThongBao, NoiDung);
  });
}
if (new_notifyform) {
  new_notifyform.addEventListener("submit", (e) => {
    e.preventDefault();
    const ThongBao = document.getElementById("thongbao").value;
    const NoiDung = document.getElementById("noidung").value;
    new_notify(ThongBao, NoiDung);
  });
}
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
if (changepass) {
  changepass.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("oldpassword").value;
    const newPassword = document.getElementById("password").value;
    changePass(password, newPassword);
  });
}
if (fixuser) {
  fixuser.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("ten").value;
    const email = document.getElementById("email").value;
    const gioitinh = document.getElementById("gioitinh").value;
    const sdt = document.getElementById("sodienthoai").value;
    const khoa = document.getElementById("khoa").value;
    changePass(name, email, gioitinh, sdt, khoa);
  });
}
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

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const password = document.getElementById("password").value;
    login(id, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (forgot) {
  forgot.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("id-forgot").value;
    forgotPass(id);
  });
}
if (reset) {
  reset.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("new-password").value;
    resetPass(password);
  });
}
const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);

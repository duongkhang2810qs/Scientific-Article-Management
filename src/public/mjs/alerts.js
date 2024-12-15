/* eslint-disable */

// Hàm ẩn thông báo
export const hideAlert = () => {
  const el = document.querySelector('.alert'); // Tìm phần tử có class "alert"
  if (el) el.parentElement.removeChild(el); // Nếu tìm thấy, xóa phần tử đó khỏi DOM
};

// Hàm hiển thị thông báo
// type: 'success' hoặc 'error'
// msg: Nội dung thông báo
// time: Thời gian hiển thị thông báo (mặc định là 7 giây)
export const showAlert = (type, msg, time = 7) => {
  hideAlert(); // Xóa thông báo cũ (nếu có)
  const markup = `<div class="alert alert--${type}">${msg}</div>`; // Tạo HTML thông báo mới
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // Thêm thông báo vào đầu body
  window.setTimeout(hideAlert, time * 1000); // Tự động ẩn thông báo sau khoảng thời gian đã định
};

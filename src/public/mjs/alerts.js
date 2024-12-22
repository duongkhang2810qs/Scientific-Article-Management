/* eslint-disable */

export const hideAlert = () => {// Hàm để ẩn thông báo (alert)
  const el = document.querySelector('.alert');  // Tìm phần tử HTML có class 'alert'
  if (el) el.parentElement.removeChild(el);  // Nếu phần tử tồn tại, xóa nó khỏi DOM
};

// type is 'success' or 'error'
// Hàm hiển thị thông báo (alert)
// type: kiểu thông báo ('success' hoặc 'error')
// msg: nội dung thông báo
// time: thời gian hiển thị thông báo (mặc định là 7 giây)
export const showAlert = (type, msg, time = 7) => {
  hideAlert();  // Gọi hàm ẩn thông báo để xóa thông báo cũ nếu có
  const markup = `<div class="alert alert--${type}">${msg}</div>`;  // Tạo HTML cho thông báo mới
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);  // Chèn thông báo mới vào đầu thẻ <body>
  window.setTimeout(hideAlert, time * 1000);  // Đặt hẹn giờ để tự động ẩn thông báo sau thời gian đã chỉ định
};

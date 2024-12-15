// Hàm xóa thông báo
function deleteNotify(notifyId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa thông báo này?"); // Hiển thị hộp thoại xác nhận
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/notifys/${notifyId}`) // Gửi yêu cầu DELETE đến API
      .then((response) => {
        location.reload(); // Tải lại trang sau khi xóa thành công
      })
      .catch((error) => {
        console.error("Error deleting notify:", error); // Log lỗi nếu có
        // Xử lý lỗi nếu cần
      });
  }
}

// Hàm xóa một đề tài (Topic)
function deleteTopic(topicId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa Topic này?"); // Hiển thị hộp thoại xác nhận
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/topics/${topicId}`) // Gửi yêu cầu DELETE đến API
      .then((response) => {
        location.reload(); // Tải lại trang sau khi xóa thành công
      })
      .catch((error) => {
        console.error("Error deleting topic:", error); // Log lỗi nếu có
        // Xử lý lỗi nếu cần
      });
  }
}

// Hàm xóa một hội đồng (Council)
function deleteCouncil(councilId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa hội đồng này?"); // Hiển thị hộp thoại xác nhận
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/councils/${councilId}`) // Gửi yêu cầu DELETE đến API
      .then((response) => {
        location.reload(); // Tải lại trang sau khi xóa thành công
      })
      .catch((error) => {
        console.error("Error deleting council:", error); // Log lỗi nếu có
        // Xử lý lỗi nếu cần
      });
  }
}

// Hàm xóa một người dùng (User)
function deleteUser(userId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa user này?"); // Hiển thị hộp thoại xác nhận
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/users/${userId}`) // Gửi yêu cầu DELETE đến API
      .then((response) => {
        location.reload(); // Tải lại trang sau khi xóa thành công
      })
      .catch((error) => {
        console.error("Error deleting user:", error); // Log lỗi nếu có
        // Xử lý lỗi nếu cần
      });
  }
}

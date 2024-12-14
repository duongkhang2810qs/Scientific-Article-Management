function deleteNotify(notifyId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa thông báo này?");
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/notifys/${notifyId}`)
      .then((response) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting notify:", error);
        // Xử lý lỗi nếu có
      });
  }
}
function deleteTopic(topicId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa Topic này?");
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/topics/${topicId}`)
      .then((response) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting topic:", error);
        // Xử lý lỗi nếu có
      });
  }
}

function deleteCouncil(councilId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa hội đồng này?");
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/councils/${councilId}`)
      .then((response) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting council:", error);
        // Xử lý lỗi nếu có
      });
  }
}
function deleteUser(userId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa user này?");
  if (confirmation) {
    // Sử dụng Axios để thực hiện yêu cầu DELETE
    axios
      .delete(`/api/v1/users/${userId}`)
      .then((response) => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        // Xử lý lỗi nếu có
      });
  }
}

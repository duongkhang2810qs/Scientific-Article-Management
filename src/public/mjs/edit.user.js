// Khi người dùng chọn chỉnh sửa
function editUser(userId) {
  // Gửi yêu cầu GET để lấy dữ liệu người dùng hiện tại
  axios
    .get(`/api/v1/users/${userId}`)
    .then((response) => {
      const userData = response.data.data;
      // Hiển thị modal chỉnh sửa và điền dữ liệu vào biểu mẫu
      showEditFormUser(userData);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error); // Log lỗi nếu không lấy được dữ liệu
    });
}

// Hàm hiển thị modal chỉnh sửa và điền dữ liệu vào biểu mẫu
function showEditFormUser(userData) {
  const editName = document.getElementById(`editName-${userData._id}`); // Lấy trường tên
  const editEmail = document.getElementById(`editEmail-${userData._id}`); // Lấy trường email
  const editSdt = document.getElementById(`editSdt-${userData._id}`); // Lấy trường số điện thoại
  const editGioiTinh = document.getElementById(`editGioiTinh-${userData._id}`); // Lấy trường giới tính
  const editKhoa = document.getElementById(`editKhoa-${userData._id}`); // Lấy trường khoa

  // Điền dữ liệu vào biểu mẫu chỉnh sửa
  if (userData.name) editName.value = userData.name;
  if (userData.email) editEmail.value = userData.email;
  if (userData.sdt) editSdt.value = userData.sdt;
  if (userData.gioitinh != undefined) editGioiTinh.value = userData.gioitinh;
  if (userData.khoa) editKhoa.value = userData.khoa;

  // Hiển thị modal chỉnh sửa
  const editModal = document.getElementById(`editUser-${userData._id}`);
  editModal.style.display = "block";
}

// Hàm đóng modal chỉnh sửa
function closeEditModalUser(userId) {
  const editModal = document.getElementById(`editUser-${userId}`); // Lấy modal chỉnh sửa
  editModal.style.display = "none"; // Ẩn modal
  location.reload(); // Tải lại trang để cập nhật dữ liệu mới
}

// Hàm lưu thông tin người dùng chỉnh sửa
function saveEditFormUser(userId) {
  const editName = document.getElementById(`editName-${userId}`); // Lấy tên từ biểu mẫu
  const editEmail = document.getElementById(`editEmail-${userId}`); // Lấy email từ biểu mẫu
  const editSdt = document.getElementById(`editSdt-${userId}`); // Lấy số điện thoại từ biểu mẫu
  const editGioiTinh = document.getElementById(`editGioiTinh-${userId}`); // Lấy giới tính từ biểu mẫu
  const editKhoa = document.getElementById(`editKhoa-${userId}`); // Lấy khoa từ biểu mẫu
  const file = document.getElementById(`photo-${userId}`); // Lấy file ảnh đại diện

  // Tạo đối tượng FormData để gửi dữ liệu
  const formData = new FormData();
  formData.append("name", editName.value);
  formData.append("email", editEmail.value);
  formData.append("sdt", editSdt.value);
  formData.append("gioitinh", editGioiTinh.value);
  formData.append("khoa", editKhoa.value);
  if (file.files[0]) {
    formData.append("avatar", file.files[0]); // Thêm ảnh đại diện nếu có
  }

  // Gửi yêu cầu PATCH để cập nhật thông tin người dùng
  axios
    .patch(`/api/v1/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Đặt header cho dữ liệu đa phương tiện
      },
    })
    .then((response) => {
      closeEditModalUser(userId); // Đóng modal và tải lại trang sau khi cập nhật thành công
    })
    .catch((error) => {
      console.error("Error updating user:", error); // Log lỗi nếu có
    });
}

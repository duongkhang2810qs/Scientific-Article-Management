// Khi người dùng chọn chỉnh sửa
function editUser(userId) {
  // Gửi yêu cầu GET để lấy dữ liệu  hiện tại
  axios
    .get(`/api/v1/users/${userId}`)
    .then((response) => {
      const userData = response.data.data;
      // Hiển thị modal chỉnh sửa và điền dữ liệu vào biểu mẫu
      showEditFormUser(userData);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// Hàm hiển thị modal chỉnh sửa và điền dữ liệu vào biểu mẫu
function showEditFormUser(userData) {
  const editName = document.getElementById(`editName-${userData._id}`);
  const editEmail = document.getElementById(`editEmail-${userData._id}`);
  const editSdt = document.getElementById(`editSdt-${userData._id}`);
  const editGioiTinh = document.getElementById(`editGioiTinh-${userData._id}`);
  const editKhoa = document.getElementById(`editKhoa-${userData._id}`);
  const editTrinhDo = document.getElementById(`editTrinhDo-${userData._id}`);
  const editLop = document.getElementById(`editLop-${userData._id}`);
  // Điền dữ liệu vào biểu mẫu chỉnh sửa
  if (userData.name) editName.value = userData.name;
  if (userData.email) editEmail.value = userData.email;
  if (userData.sdt) editSdt.value = userData.sdt;
  if (userData.gioitinh) editGioiTinh.value = userData.gioitinh;
  if (userData.khoa) editKhoa.value = userData.khoa;
  if (userData.trinhdo) editTrinhDo.value = userData.trinhdo;
  if (userData.lop) editLop.value = userData.lop;

  // Hiển thị modal chỉnh sửa
  const editModal = document.getElementById(`editUser-${userData._id}`);
  editModal.style.display = "block";
}

// Hàm đóng modal chỉnh sửa
function closeEditModalUser(userId) {
  const editModal = document.getElementById(`editUser-${userId}`);
  editModal.style.display = "none";
  location.reload();
}

// Hàm lưu thông báo chỉnh sửa
function saveEditFormUser(userId) {
  const editName = document.getElementById(`editName-${userId}`);
  const editEmail = document.getElementById(`editEmail-${userId}`);
  const editSdt = document.getElementById(`editSdt-${userId}`);
  const editGioiTinh = document.getElementById(`editGioiTinh-${userId}`);
  const editKhoa = document.getElementById(`editKhoa-${userId}`);
  const editTrinhDo = document.getElementById(`editTrinhDo-${userId}`);
  const editLop = document.getElementById(`editLop-${userId}`);
  const file = document.getElementById(`photo-${userId}`);

  const formData = new FormData();
  formData.append("name", editName.value);
  formData.append("email", editEmail.value);
  formData.append("sdt", editSdt.value);
  formData.append("gioitinh", editGioiTinh.value);
  formData.append("khoa", editKhoa.value);
  formData.append("trinhdo", editTrinhDo.value);
  formData.append("lop", editLop.value);
  if (file.files[0]) {
    formData.append("avatar", file.files[0]); // Nếu có file ảnh, thêm vào form data
  }

  // Gửi yêu cầu PUT/PATCH để cập nhật
  axios
    .patch(`/api/v1/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Tiêu đề để gửi dữ liệu dạng form
      },
    })
    .then((response) => {
      closeEditModalUser(userId); // Đóng modal sau khi cập nhật thành công
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
}

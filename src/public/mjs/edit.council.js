// Hàm chỉnh sửa hội đồng
function edit_council(councilId) {
  // Gửi yêu cầu GET để lấy dữ liệu hội đồng hiện tại
  axios
    .get(`/api/v1/councils/${councilId}`)
    .then((response) => {
      const councilData = response.data.data;
      // Hiển thị modal chỉnh sửa và điền dữ liệu vào biểu mẫu
      showEditForm(councilData);
    })
    .catch((error) => {
      console.error("Error fetching council data:", error); // Log lỗi nếu không lấy được dữ liệu
    });
}

// Hàm hiển thị biểu mẫu chỉnh sửa
function showEditForm(councilData) {
  const TenHoiDong = document.getElementById(`editName-${councilData._id}`); // Lấy trường tên hội đồng
  const ChuTich = document.getElementById(
    `userDropdown-editChuTich-${councilData._id}` // Lấy trường Chủ tịch
  );
  const ThuKy = document.getElementById(
    `userDropdown-editThuKy-${councilData._id}` // Lấy trường Thư ký
  );
  const UyVien1 = document.getElementById(
    `userDropdown-editUyVien1-${councilData._id}` // Lấy trường Ủy viên 1
  );
  const UyVien2 = document.getElementById(
    `userDropdown-editUyVien2-${councilData._id}` // Lấy trường Ủy viên 2
  );

  // Kiểm tra và xử lý nếu không có dữ liệu cho Ủy viên 1 và 2
  if (!councilData.UyVien2) {
    councilData.UyVien2 = "";
  }
  if (!councilData.UyVien1) {
    councilData.UyVien1 = "";
  }

  // Điền dữ liệu vào các trường
  TenHoiDong.value = councilData.TenHoiDong;
  ChuTich.value = councilData.ChuTich;
  ThuKy.value = councilData.ThuKy;
  UyVien1.value = councilData.UyVien1;
  UyVien2.value = councilData.UyVien2;

  // Hiển thị modal chỉnh sửa
  const editNotify = document.getElementById(`council-${councilData._id}`);
  editNotify.style.display = "block";
}

// Hàm đóng modal chỉnh sửa
function closeEditCouncil(councilId) {
  const editNotify = document.getElementById(`council-${councilId}`); // Lấy modal chỉnh sửa
  editNotify.style.display = "none"; // Ẩn modal
  location.reload(); // Tải lại trang để cập nhật dữ liệu mới
}

// Hàm lưu dữ liệu hội đồng chỉnh sửa
function saveEditCouncil(councilId) {
  const TenHoiDong = document.getElementById(`editName-${councilId}`); // Lấy tên hội đồng
  const ChuTich = document.getElementById(
    `userDropdown-editChuTich-${councilId}` // Lấy Chủ tịch
  );
  const ThuKy = document.getElementById(`userDropdown-editThuKy-${councilId}`); // Lấy Thư ký
  const UyVien1 = document.getElementById(
    `userDropdown-editUyVien1-${councilId}` // Lấy Ủy viên 1
  );
  const UyVien2 = document.getElementById(
    `userDropdown-editUyVien2-${councilId}` // Lấy Ủy viên 2
  );

  // Tạo object chứa dữ liệu chỉnh sửa
  const editedData = {
    TenHoiDong: TenHoiDong.value,
    ChuTich: ChuTich.value,
    ThuKy: ThuKy.value,
    UyVien1: UyVien1.value,
    UyVien2: UyVien2.value,
  };

  // Gửi yêu cầu PATCH để cập nhật dữ liệu hội đồng
  axios
    .patch(`/api/v1/councils/${councilId}`, editedData)
    .then((response) => {
      closeEditCouncil(councilId); // Đóng modal và tải lại trang sau khi cập nhật thành công
    })
    .catch((error) => {
      console.error("Error updating council:", error); // Log lỗi nếu có
    });
}

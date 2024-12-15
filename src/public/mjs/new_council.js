// Khi người dùng chọn thêm hội đồng
function new_council() {
  // Hiển thị modal thêm hội đồng
  const editcouncil = document.getElementById(`newcouncil`);
  editcouncil.style.display = "block";
}

// Hàm đóng modal thêm hội đồng
function closeNewcouncil() {
  const editcouncil = document.getElementById(`newcouncil`);
  editcouncil.style.display = "none";
  location.reload(); // Tải lại trang để cập nhật giao diện
}

// Hàm lưu thông tin hội đồng mới
function saveNewcouncil() {
  // Lấy các giá trị từ biểu mẫu
  const TenHoiDong = document.getElementById(`TenHoiDong`); // Tên hội đồng
  const ChuTich = document.getElementById("userDropdown-ChuTich"); // Chủ tịch
  const ThuKy = document.getElementById("userDropdown-ThuKy"); // Thư ký
  const UyVien1 = document.getElementById("userDropdown-UyVien1"); // Ủy viên 1
  const UyVien2 = document.getElementById("userDropdown-UyVien2"); // Ủy viên 2

  // Tạo dữ liệu để gửi đến API
  const Data = {
    TenHoiDong: TenHoiDong.value,
    ChuTich: ChuTich.value,
    Thuky: ThuKy.value,
  };

  // Kiểm tra và thêm dữ liệu của Ủy viên nếu có
  if (UyVien2.value) {
    Data.UyVien2 = UyVien2.value;
  }
  if (UyVien1.value) {
    Data.UyVien1 = UyVien1.value;
  }

  // Gửi yêu cầu POST để tạo hội đồng mới
  axios
    .post(`/api/v1/councils`, Data)
    .then((response) => {
      console.log("Tạo hội đồng thành công", response.data);

      // Đóng modal và cập nhật giao diện hoặc tải lại trang
      closeNewcouncil();
    })
    .catch((error) => {
      console.error("Lỗi khi tạo hội đồng:", error); // Log lỗi nếu có
    });
}

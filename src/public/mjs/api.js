// Các hằng số cấu hình dự án
const PROJECT_ID = "SK.0.FB6FVAFS2WsgCfITrpw1bJxDE6VqqjHF"; // ID của dự án Stringee
const PROJECT_SECRET = "aHZPMzRwam44OEhDazBybVN4S3FGV2o1T2UyWWZnNjQ="; // Secret của dự án Stringee
const BASE_URL = "https://api.stringee.com/v1/room2"; // URL cơ sở của API

// Lớp API để làm việc với các dịch vụ của Stringee
class API {
  constructor(projectId, projectSecret) {
    this.projectId = projectId; // Lưu ID dự án
    this.projectSecret = projectSecret; // Lưu Secret của dự án
    this.restToken = ""; // Token REST, sẽ được thiết lập khi cần
  }

  // Tạo phòng họp mới
  async createRoom() {
    const roomName = Math.random().toFixed(4); // Tạo tên phòng ngẫu nhiên
    const response = await axios.post(
      `${BASE_URL}/create`,
      {
        name: roomName, // Tên phòng
        uniqueName: roomName, // Tên phòng duy nhất
      },
      {
        headers: this._authHeader(), // Thêm token REST vào headers
      }
    );

    const room = response.data; // Nhận dữ liệu phản hồi từ API
    console.log({ room }); // Log thông tin phòng tạo ra
    return room; // Trả về dữ liệu phòng
  }

  // Lấy danh sách các phòng họp
  async listRoom() {
    const response = await axios.get(`${BASE_URL}/list`, {
      headers: this._authHeader(), // Thêm token REST vào headers
    });

    const rooms = response.data.list; // Lấy danh sách phòng từ phản hồi
    console.log({ rooms }); // Log danh sách phòng
    return rooms; // Trả về danh sách phòng
  }

  // Xóa một phòng họp theo ID
  async deleteRoom(roomId) {
    const response = await axios.put(
      `${BASE_URL}/delete`,
      {
        roomId, // ID của phòng cần xóa
      },
      {
        headers: this._authHeader(), // Thêm token REST vào headers
      }
    );

    console.log({ response }); // Log phản hồi từ API
    return response.data; // Trả về dữ liệu phản hồi
  }

  // Xóa tất cả các phòng họp
  async clearAllRooms() {
    const rooms = await this.listRoom(); // Lấy danh sách phòng
    const response = await Promise.all(
      rooms.map((room) => this.deleteRoom(room.roomId)) // Xóa từng phòng trong danh sách
    );

    return response; // Trả về phản hồi sau khi xóa tất cả phòng
  }

  // Thiết lập token REST cho các API tiếp theo
  async setRestToken() {
    const tokens = await this._getToken({ rest: true }); // Lấy token REST
    const restToken = tokens.rest_access_token; // Lưu token REST
    this.restToken = restToken;

    return restToken; // Trả về token REST
  }

  // Lấy token cho một user cụ thể
  async getUserToken(userId) {
    const tokens = await this._getToken({ userId }); // Lấy token cho user
    return tokens.access_token; // Trả về token của user
  }

  // Lấy token cho một phòng cụ thể
  async getRoomToken(roomId) {
    const tokens = await this._getToken({ roomId }); // Lấy token cho phòng
    return tokens.room_token; // Trả về token của phòng
  }

  // Lấy token từ API token_helper
  async _getToken({ userId, roomId, rest }) {
    const response = await axios.get(
      "https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php",
      {
        params: {
          keySid: this.projectId, // ID dự án
          keySecret: this.projectSecret, // Secret của dự án
          userId, // ID người dùng (nếu có)
          roomId, // ID phòng (nếu có)
          rest, // Đánh dấu yêu cầu token REST
        },
      }
    );

    const tokens = response.data; // Nhận token từ phản hồi
    console.log({ tokens }); // Log token nhận được
    return tokens; // Trả về token
  }

  // Kiểm tra trình duyệt có phải Safari không
  isSafari() {
    const ua = navigator.userAgent.toLowerCase(); // Lấy thông tin userAgent
    return !ua.includes("chrome") && ua.includes("safari"); // Kiểm tra trình duyệt
  }

  // Tạo headers chứa token REST cho API
  _authHeader() {
    return {
      "X-STRINGEE-AUTH": this.restToken, // Thêm token REST vào headers
    };
  }
}

// Tạo instance API để sử dụng
const api = new API(PROJECT_ID, PROJECT_SECRET);

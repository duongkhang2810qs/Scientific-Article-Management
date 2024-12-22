// Khai báo các hằng số chứa thông tin dự án và URL API của Stringee
const PROJECT_ID = "SK.0.FB6FVAFS2WsgCfITrpw1bJxDE6VqqjHF";
const PROJECT_SECRET = "aHZPMzRwam44OEhDazBybVN4S3FGV2o1T2UyWWZnNjQ=";
const BASE_URL = "https://api.stringee.com/v1/room2";

// Lớp API để tương tác với Stringee API
class API {
  constructor(projectId, projectSecret) {
    this.projectId = projectId;
    this.projectSecret = projectSecret;
    this.restToken = "";
  }

  // Tạo một phòng mới
  async createRoom() {
    const roomName = Math.random().toFixed(4); // Tạo tên phòng ngẫu nhiên
    const response = await axios.post(
      `${BASE_URL}/create`,
      {
        name: roomName, // Tên phòng
        uniqueName: roomName // Tên phòng duy nhất
      },
      {
        headers: this._authHeader() // Thêm tiêu đề xác thực
      }
    );

    const room = response.data; // Lấy dữ liệu phản hồi
    console.log({ room });
    return room;
  }

  // Lấy danh sách các phòng
  async listRoom() {
    const response = await axios.get(`${BASE_URL}/list`, {
      headers: this._authHeader() // Thêm tiêu đề xác thực
    });

    const rooms = response.data.list; // Lấy danh sách phòng từ dữ liệu phản hồi
    console.log({ rooms });
    return rooms;
  }
    
  // Xóa một phòng cụ thể
  async deleteRoom(roomId) {
    const response = await axios.put(`${BASE_URL}/delete`, {
      roomId // ID của phòng cần xóa
    }, {
      headers: this._authHeader() // Thêm tiêu đề xác thực
    })
    
    console.log({response})
    
    return response.data;
  }
    
  // Xóa tất cả các phòng
  async clearAllRooms() {
    const rooms = await this.listRoom() // Lấy danh sách các phòng
    const response = await Promise.all(rooms.map(room => this.deleteRoom(room.roomId))) // Xóa từng phòng
    
    return response;
  }

  // Đặt REST token để xác thực các yêu cầu API
  async setRestToken() {
    const tokens = await this._getToken({ rest: true }); // Lấy token REST
    const restToken = tokens.rest_access_token; // Lấy giá trị token
    this.restToken = restToken;

    return restToken;
  }

  // Lấy token cho người dùng cụ thể
  async getUserToken(userId) {
    const tokens = await this._getToken({ userId }); // Gửi yêu cầu lấy token
    return tokens.access_token; // Trả về token của người dùng
  }

  async getRoomToken(roomId) {
    const tokens = await this._getToken({ roomId }); // Gửi yêu cầu lấy token
    return tokens.room_token; // Trả về token của phòng
  }

  // Hàm nội bộ để lấy token từ API
  async _getToken({ userId, roomId, rest }) {
    const response = await axios.get(
      "https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php",
      {
        params: {
          keySid: this.projectId, // ID dự án
          keySecret: this.projectSecret, // Secret dự án
          userId, // ID người dùng (nếu có)
          roomId, // ID phòng (nếu có)
          rest // Có phải lấy token REST không
        }
      }
    );

    const tokens = response.data; // Lấy dữ liệu token từ phản hồi
    console.log({ tokens });
    return tokens;
  }

  // Kiểm tra xem trình duyệt có phải là Safari không
  isSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return !ua.includes('chrome') && ua.includes('safari'); // Nếu không phải Chrome nhưng là Safari
  }
  
  // Tạo tiêu đề xác thực cho các yêu cầu API
  _authHeader() {
    return {
      "X-STRINGEE-AUTH": this.restToken // Sử dụng REST token
    };
  }
}

// Tạo một instance của lớp API
const api = new API(PROJECT_ID, PROJECT_SECRET);
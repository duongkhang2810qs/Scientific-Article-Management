document.addEventListener("DOMContentLoaded", function () {
  // Lắng nghe sự kiện submit từ form gửi tin nhắn
  const messageForm = document.getElementById("messageForm");

  if (messageForm) {
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Ngăn hành động mặc định của form
      const chatName = document.getElementById("chatName");
      const formData = new FormData(this); // Lấy dữ liệu từ form
      const message = formData.get("message").trim(); // Lấy nội dung tin nhắn và loại bỏ khoảng trắng thừa
      formData.append("conversation", chatName.dataset.conversationId); // Gắn ID cuộc trò chuyện vào formData
      if (message) {
        sendMessage(formData); // Gửi tin nhắn qua API
        addMessageToChatWindow("Bạn", message || "File đã gửi", true); // Hiển thị tin nhắn lên cửa sổ chat
        this.reset(); // Reset form
      }
    });
  }

  // Lắng nghe sự kiện tìm kiếm người dùng
  const searchButton = document.querySelector(".input-group-append button");

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      const searchInput = document.querySelector(
        '.input-group input[type="text"]'
      );
      const searchTerm = searchInput.value.toLowerCase(); // Lấy từ khóa tìm kiếm và chuyển thành chữ thường

      const userList = document.getElementById("userList"); // Danh sách người dùng

      if (userList) {
        const users = userList.querySelectorAll(".list-group-item");
        users.forEach((user) => {
          const userName = user.textContent.toLowerCase(); // Lấy tên người dùng
          user.style.display = userName.includes(searchTerm) ? "" : "none"; // Hiển thị hoặc ẩn người dùng dựa trên từ khóa
        });
      }
    });
  }
});

// Hàm gửi tin nhắn qua API
function sendMessage(formData) {
  const formDataObj = Object.fromEntries(formData.entries()); // Chuyển formData thành object

  axios
    .post("/api/v1/messages", formDataObj) // Gửi yêu cầu POST để tạo tin nhắn
    .then(function (response) {
      console.log(response.data); // Log phản hồi từ API
      socket.emit("send message", response.data.data); // Phát sự kiện gửi tin nhắn qua socket
    })
    .catch(function (error) {
      console.error("Lỗi khi gửi tin nhắn:", error); // Log lỗi nếu có
    });
}

// Hàm thêm tin nhắn vào cửa sổ chat
function addMessageToChatWindow(username, message, isSender, fileUrl) {
  const chatWindow = document.getElementById("chatWindow");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isSender ? "sender" : "receiver"); // Gán class cho tin nhắn (sender/receiver)

  let messageContent = "";

  if (!isSender) {
    messageContent += `<strong>${username}:</strong> `; // Hiển thị tên người gửi nếu không phải sender
  }

  if (fileUrl) {
    messageContent += `<a href="${fileUrl}" target="_blank">${message}</a>`; // Thêm file nếu có fileUrl
  } else {
    messageContent += message; // Thêm nội dung tin nhắn
  }

  messageElement.innerHTML = messageContent; // Chèn nội dung vào thẻ div
  chatWindow.appendChild(messageElement); // Thêm tin nhắn vào cửa sổ chat
  chatWindow.scrollTop = chatWindow.scrollHeight; // Cuộn xuống cuối cửa sổ chat
}

// Hàm tải một cuộc hội thoại
function loadConversation(conversationId, index, userId) {
  axios
    .get(`/api/v1/conversations/${conversationId}`) // Gửi yêu cầu GET để lấy dữ liệu cuộc hội thoại
    .then(function (response) {
      const { data } = response; // Lấy dữ liệu từ phản hồi
      const chatName = document.getElementById("chatName");
      const chatWindow = document.getElementById("chatWindow");
      if (index == 2) {
        chatName.textContent = data.data.name; // Tên nhóm
      } else {
        chatName.textContent = data.data.participants[index].name; // Tên người dùng
      }
      chatName.dataset.conversationId = conversationId; // Gắn ID cuộc hội thoại vào dataset
      chatWindow.innerHTML = ""; // Xóa nội dung cũ trong cửa sổ chat
      console.log(data.data);
      const messages = data.data.messages; // Lấy danh sách tin nhắn
      messages.forEach((message) => {
        let isSender = false;
        if (message.sender._id == userId) {
          isSender = true; // Xác định nếu tin nhắn thuộc về người dùng hiện tại
        }
        addMessageToChatWindow(message.sender.name, message.message, isSender); // Thêm tin nhắn vào cửa sổ chat
      });
      socket.emit("join conversation", conversationId); // Tham gia phòng hội thoại qua socket
    })
    .catch(function (error) {
      console.error("Lỗi khi tải cuộc hội thoại:", error); // Log lỗi nếu có
    });
}

// Hàm tạo một cuộc trò chuyện mới
function saveCreateChat() {
  const recipientElement = document.getElementById("nguoi-dung");
  const recipient = recipientElement.value; // Lấy người nhận từ input
  axios
    .post(`/api/v1/conversations`, { recipient }) // Gửi yêu cầu POST để tạo cuộc trò chuyện mới
    .then((response) => {
      console.log("create conversation successfully", response.data); // Log phản hồi từ API
      closeCreateChat(); // Đóng cửa sổ tạo chat
    })
    .catch((error) => {
      console.error("Error create conversation:", error); // Log lỗi nếu có
    });
}

// Hàm mở cửa sổ tạo nhóm chat
document
  .getElementById("openCreateGroupChat")
  .addEventListener("click", function () {
    document.getElementById("createUserChat").style.display = "none"; // Ẩn form tạo chat đơn
    document.getElementById("createGroupChat").style.display = "block"; // Hiển thị form tạo nhóm chat
  });

// Hàm lưu nhóm chat mới
function saveGroupChat() {
  const formData = new FormData();
  formData.append("name", document.getElementById("ten-nhom").value); // Lấy tên nhóm
  formData.append("isGroup", true); // Đánh dấu là nhóm chat
  const ThanhvienElement = document.getElementById("thanhvien");
  const Thanhvien = Array.from(ThanhvienElement.selectedOptions).map(
    (option) => option.value // Lấy danh sách ID thành viên
  );
  Thanhvien.forEach((item) => {
    formData.append("participants", item); // Thêm từng thành viên vào formData
  });
  console.log(...formData);
  axios
    .post(`/api/v1/conversations`, ...formData) // Gửi yêu cầu POST để tạo nhóm chat
    .then((response) => {
      console.log("create conversation successfully", response.data); // Log phản hồi từ API
      closeCreateChat(); // Đóng cửa sổ tạo nhóm chat
    })
    .catch((error) => {
      alert(error); // Hiển thị lỗi nếu có
      console.error("Error create conversation:", error);
    });
}

// Lắng nghe sự kiện nhận tin nhắn qua socket
socket.on("receive message", (data) => {
  const { conversation, message, sender } = data;

  const chatName = document.getElementById("chatName");
  const conversationId = chatName.dataset.conversationId;

  if (conversationId == conversation) {
    addMessageToChatWindow(sender.name, message, false); // Thêm tin nhắn nhận được vào cửa sổ chat
  }
});

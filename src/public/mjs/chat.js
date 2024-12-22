document.addEventListener("DOMContentLoaded", function () {// Khi DOM đã được tải xong, thiết lập các event listeners
  // Event listener for form submission
  const messageForm = document.getElementById("messageForm");  // Event listener cho việc gửi tin nhắn từ form

  if (messageForm) {
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Ngăn trình duyệt reload trang
      const chatName = document.getElementById("chatName");
      const formData = new FormData(this); // Lấy dữ liệu từ form
      const message = formData.get("message").trim(); // Lấy nội dung tin nhắn
      formData.append("conversation", chatName.dataset.conversationId); // Gắn ID cuộc trò chuyện
      if (message) {
        sendMessage(formData); // Gửi tin nhắn
        addMessageToChatWindow("Bạn", message || "File đã gửi", true); // Hiển thị tin nhắn lên cửa sổ chat 
        this.reset(); // Reset form
      }
    });
  }

  // Event listener for search button
    // Event listener cho nút tìm kiếm người dùng
  const searchButton = document.querySelector(".input-group-append button");

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      const searchInput = document.querySelector(
        '.input-group input[type="text"]'
      );
      const searchTerm = searchInput.value.toLowerCase();

      const userList = document.getElementById("userList");

      if (userList) {
        const users = userList.querySelectorAll(".list-group-item");
        users.forEach((user) => {
          const userName = user.textContent.toLowerCase();
          user.style.display = userName.includes(searchTerm) ? "" : "none"; // Hiển thị hoặc ẩn các người dùng khớp với tìm kiếm
        });
      }
    });
  }
});

// Function to send a message using axios
// Hàm gửi tin nhắn sử dụng axios
function sendMessage(formData) {
  const formDataObj = Object.fromEntries(formData.entries()); // Chuyển FormData thành object

  axios
    .post("/api/v1/messages", formDataObj)
    .then(function (response) {
      console.log(response.data);
      socket.emit("send message", response.data.data); // Gửi tin nhắn qua socket
    })
    .catch(function (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    });
}

// Hàm hiển thị tin nhắn lên cửa sổ chat
function addMessageToChatWindow(username, message, isSender, fileUrl) {
  const chatWindow = document.getElementById("chatWindow");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isSender ? "sender" : "receiver");

  let messageContent = "";

  if (!isSender) {
    messageContent += `<strong>${username}:</strong> `;
  }

  if (fileUrl) {  // Hiển thị file nếu có URL
  } else {
    messageContent += message; // Hiển thị nội dung tin nhắn
  }

  messageElement.innerHTML = messageContent;
  chatWindow.appendChild(messageElement); // Thêm tin nhắn vào cửa sổ chat
  chatWindow.scrollTop = chatWindow.scrollHeight; // Cuộn xuống cuối cửa sổ chat
}

// Function to load a conversation using axios
// Hàm tải một cuộc hội thoại
function loadConversation(conversationId, index, userId) {
  axios
    .get(`/api/v1/conversations/${conversationId}`)
    .then(function (response) {
      const { data } = response;
      const chatName = document.getElementById("chatName");
      const chatWindow = document.getElementById("chatWindow");
      if (index == 2) {
        chatName.textContent = data.data.name;
      } else {
        chatName.textContent = data.data.participants[index].name;
      }
      chatName.dataset.conversationId = conversationId;
      chatWindow.innerHTML = ""; // Xóa nội dung cũ
      console.log(data.data);
      const messages = data.data.messages;
      messages.forEach((message) => {
        let isSender = false;
        if (message.sender._id == userId) {
          isSender = true;
        }
        addMessageToChatWindow(message.sender.name, message.message, isSender);
      });
      socket.emit("join conversation", conversationId); // Tham gia cuộc trò chuyện qua socket
    })
    .catch(function (error) {
      console.error("Lỗi khi tải cuộc hội thoại:", error);
    });
}

// Hàm lưu một cuộc trò chuyện mới
function saveCreateChat() {
  const recipientElement = document.getElementById("nguoi-dung");
  const recipient = recipientElement.value;
  axios
    .post(`/api/v1/conversations`, { recipient })
    .then((response) => {
      console.log("create conversation successfully", response.data);
      closeCreateChat();
    })
    .catch((error) => {
      console.error("Error create conversation:", error);
    });
}
document
  .getElementById("openCreateGroupChat")
  .addEventListener("click", function () {
    document.getElementById("createUserChat").style.display = "none";
    document.getElementById("createGroupChat").style.display = "block";
  });

// Hàm lưu một cuộc trò chuyện nhóm
  function saveGroupChat() {
  const formData = new FormData();
  formData.append("name", document.getElementById("ten-nhom").value);
  formData.append("isGroup", true);
  const ThanhvienElement = document.getElementById("thanhvien");
  const Thanhvien = Array.from(ThanhvienElement.selectedOptions).map(
    (option) => option.value
  );
  Thanhvien.forEach((item) => {
    formData.append("participants", item);
  });
  console.log(...formData);
  axios
    .post(`/api/v1/conversations`, ...formData)
    .then((response) => {
      console.log("create conversation successfully", response.data);
      closeCreateChat();
    })
    .catch((error) => {
      alert(error);
      console.error("Error create conversation:", error);
    });
}

// Nhận tin nhắn mới từ socket
socket.on("receive message", (data) => {
  const { conversation, message, sender } = data;

  const chatName = document.getElementById("chatName");
  const conversationId = chatName.dataset.conversationId;

  if (conversationId == conversation) {
    addMessageToChatWindow(sender.name, message, false); // Thêm tin nhắn vào cửa sổ chat
  }
});

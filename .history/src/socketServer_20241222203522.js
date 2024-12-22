module.exports = function (socket, io) {
  // Lắng nghe sự kiện "join conversation" từ client
  socket.on("join conversation", (conversation) => {
  // Tham gia vào một room cụ thể dựa trên ID cuộc trò chuyện
    socket.join(conversation);
  });
  // Lắng nghe sự kiện "send message" từ client
  socket.on("send message", (data) => {
    const { conversation } = data; // Trích xuất ID cuộc trò chuyện từ dữ liệu gửi lên
    // Gửi tin nhắn tới tất cả client khác trong room (ngoại trừ người gửi)
    socket.to(conversation).emit("receive message", data);
  });
  // Lắng nghe sự kiện "disconnect" khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

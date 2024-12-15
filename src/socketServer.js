module.exports = function (socket, io) {
  // Khi một client tham gia vào một cuộc hội thoại
  socket.on("join conversation", (conversation) => {
    // socket.join: Tham gia vào một room (nhóm kết nối) với tên là ID của cuộc hội thoại
    socket.join(conversation);
  });

  // Khi một client gửi tin nhắn
  socket.on("send message", (data) => {
    const { conversation } = data; // Lấy ID của cuộc hội thoại từ dữ liệu
    // socket.to: Gửi tin nhắn tới tất cả các client trong room ngoại trừ người gửi
    socket.to(conversation).emit("receive message", data);
  });

  // Khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

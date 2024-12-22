module.exports = function (socket, io) {
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });
  socket.on("send message", (data) => {
    const { conversation } = data;
    socket.to(conversation).emit("receive message", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};

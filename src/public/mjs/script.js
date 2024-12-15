const videoContainer = document.querySelector("#videos");

const vm = new Vue({
  el: "#app",
  data: {
    userToken: "", // Token của người dùng hiện tại
    roomId: "", // ID của phòng
    roomToken: "", // Token để tham gia phòng
    room: undefined, // Đối tượng phòng hiện tại
    callClient: undefined, // Đối tượng StringeeClient để xử lý cuộc gọi
  },
  computed: {
    // URL của phòng dựa trên ID
    roomUrl: function () {
      return `https://${location.hostname}?room=${this.roomId}`;
    },
  },
  async mounted() {
    // Thiết lập RestToken cho API
    api.setRestToken();

    // Kiểm tra xem URL có chứa roomId không
    const urlParams = new URLSearchParams(location.search);
    const roomId = urlParams.get("room");
    if (roomId) {
      this.roomId = roomId;

      await this.join(); // Tham gia phòng nếu roomId tồn tại
    }
  },
  methods: {
    // Xác thực người dùng và kết nối StringeeClient
    authen: function () {
      return new Promise(async (resolve) => {
        const userId = `${(Math.random() * 100000).toFixed(6)}`; // Tạo userId ngẫu nhiên
        const userToken = await api.getUserToken(userId); // Lấy userToken từ API
        this.userToken = userToken;

        if (!this.callClient) {
          const client = new StringeeClient();

          client.on("authen", function (res) {
            console.log("on authen: ", res);
            resolve(res);
          });
          this.callClient = client;
        }
        this.callClient.connect(userToken); // Kết nối với StringeeClient
      });
    },
    // Phát video hoặc chia sẻ màn hình
    publish: async function (screenSharing = false) {
      const localTrack = await StringeeVideo.createLocalVideoTrack(
        this.callClient,
        {
          audio: true,
          video: true,
          screen: screenSharing,
          videoDimensions: { width: 640, height: 360 },
        }
      );

      const videoElement = localTrack.attach();
      this.addVideo(videoElement); // Thêm video vào giao diện

      const roomData = await StringeeVideo.joinRoom(
        this.callClient,
        this.roomToken
      );
      const room = roomData.room;
      console.log({ roomData, room });

      if (!this.room) {
        this.room = room;
        room.clearAllOnMethos();
        room.on("addtrack", (e) => {
          const track = e.info.track;

          console.log("addtrack", track);
          if (track.serverId === localTrack.serverId) {
            console.log("local");
            return;
          }
          this.subscribe(track); // Đăng ký lắng nghe track mới
        });
        room.on("removetrack", (e) => {
          const track = e.track;
          if (!track) {
            return;
          }

          const mediaElements = track.detach();
          mediaElements.forEach((element) => element.remove()); // Gỡ track khi bị xóa
        });

        // Tham gia các track hiện có
        roomData.listTracksInfo.forEach((info) => this.subscribe(info));
      }

      await room.publish(localTrack); // Phát track local
      console.log("room publish successful");
    },
    // Tạo phòng mới
    createRoom: async function () {
      const room = await api.createRoom();
      const { roomId } = room;
      const roomToken = await api.getRoomToken(roomId);

      this.roomId = roomId;
      this.roomToken = roomToken;
      console.log({ roomId, roomToken });

      await this.authen();
      await this.publish();
    },
    // Tham gia phòng hiện có
    join: async function () {
      const roomToken = await api.getRoomToken(this.roomId);
      this.roomToken = roomToken;

      await this.authen();
      await this.publish();
    },
    // Tham gia phòng bằng ID nhập vào
    joinWithId: async function () {
      const roomId = prompt("Dán Room ID vào đây nhé!");
      if (roomId) {
        this.roomId = roomId;
        await this.join();
      }
    },
    // Đăng ký track mới trong phòng
    subscribe: async function (trackInfo) {
      const track = await this.room.subscribe(trackInfo.serverId);
      track.on("ready", () => {
        console.log("Track is ready:", track);
        const videoElement = track.attach();
        this.addVideo(videoElement); // Thêm video vào giao diện
      });
    },
    // Thêm video vào giao diện
    addVideo: function (video) {
      video.setAttribute("controls", "true");
      video.setAttribute("playsinline", "true");
      document.getElementById("videos").appendChild(video);
    },
  },
});

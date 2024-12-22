const videoContainer = document.querySelector("#videos");

const vm = new Vue({
  el: "#app", // Gắn Vue vào phần tử HTML có ID là "app"
  data: {
    userToken: "", // Token người dùng
    roomId: "", // ID của phòng
    roomToken: "",// Token của phòng
    room: undefined, // Đối tượng phòng
    callClient: undefined, // Đối tượng StringeeClient
  },
  computed: {
    roomUrl: function () {    // Tạo URL của phòng dựa trên roomId
      return `https://${location.hostname}?room=${this.roomId}`;
    },
  },
  async mounted() {
    api.setRestToken();    // Thiết lập RestToken cho API

    // Lấy roomId từ URL nếu có
    const urlParams = new URLSearchParams(location.search);
    const roomId = urlParams.get("room");
    if (roomId) {
      this.roomId = roomId;

      // Tự động tham gia phòng nếu roomId tồn tại
      await this.join();
    }
  },
  methods: {
    authen: function () {    // Xác thực người dùng
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
        this.callClient.connect(userToken); // Kết nối với Stringee
      });
    },
    publish: async function (screenSharing = false) {    // Phát video (có thể chia sẻ màn hình)
      const localTrack = await StringeeVideo.createLocalVideoTrack(
        this.callClient,
        {
          audio: true,
          video: true,
          screen: screenSharing,
          videoDimensions: { width: 640, height: 360 },
        }
      );

      const videoElement = localTrack.attach(); // Gắn video vào DOM
      this.addVideo(videoElement);

      const roomData = await StringeeVideo.joinRoom(
        this.callClient,
        this.roomToken
      );
      const room = roomData.room;
      console.log({ roomData, room });

      if (!this.room) {
        this.room = room;
        room.clearAllOnMethos(); // Xóa các phương thức cũ
        room.on("addtrack", (e) => {
          const track = e.info.track;

          console.log("addtrack", track);
          if (track.serverId === localTrack.serverId) {
            console.log("local");
            return;
          }
          this.subscribe(track);
        });
        room.on("removetrack", (e) => {
          const track = e.track;
          if (!track) {
            return;
          }

          const mediaElements = track.detach();
          mediaElements.forEach((element) => element.remove());
        });

        // Join existing tracks
        // Tham gia các track hiện có trong phòng
        roomData.listTracksInfo.forEach((info) => this.subscribe(info));
      }

      await room.publish(localTrack); // Phát track lên phòng
      console.log("room publish successful");
    },
    createRoom: async function () {
      const room = await api.createRoom();// Tạo phòng qua API
      const { roomId } = room;
      const roomToken = await api.getRoomToken(roomId); // Lấy token của phòng

      this.roomId = roomId;
      this.roomToken = roomToken;
      console.log({ roomId, roomToken });

      await this.authen(); // Xác thực người dùng
      await this.publish(); // Phát video
    },
    join: async function () {    // Tham gia phòng hiện có
      const roomToken = await api.getRoomToken(this.roomId); // Lấy token của phòng
      this.roomToken = roomToken;

      await this.authen();// Xác thực người dùng
      await this.publish(); // Phát video
    },
    joinWithId: async function () {    // Tham gia phòng bằng ID
      const roomId = prompt("Dán Room ID vào đây nhé!");
      if (roomId) {
        this.roomId = roomId;
        await this.join();
      }
    },
    subscribe: async function (trackInfo) {    // Đăng ký một track từ phòng
      const track = await this.room.subscribe(trackInfo.serverId);
      track.on("ready", () => {
        console.log("Track is ready:", track);
        const videoElement = track.attach();
        this.addVideo(videoElement);
      });
    },
    addVideo: function (video) {    // Thêm video vào container
      video.setAttribute("controls", "true");
      video.setAttribute("playsinline", "true");
      document.getElementById("videos").appendChild(video);
    },
  },
});
/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts.js";

export const login = async (id, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        id,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    } else {
      showAlert("error", "Login failed. Please check your credentials.");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    // Handle network errors or unexpected server responses
    showAlert("error", "An error occurred during the login process.");
    console.error(err);
    window.setTimeout(() => {
      location.assign("/");
    }, 1000);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      showAlert("success", "Đăng xuất thành công!");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", "Đăng xuất không thành công!");
  }
};

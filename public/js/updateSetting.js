/* eslint-disable */

//updateData
import axios from "axios";
import { showAlert, hideAlert } from "./alert";

export const updateData = async (updateData, type) => {
  const url =
    type === "password"
      ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword"
      : "http://127.0.0.1:3000/api/v1/users/updateMe";
  try {
    if (type && type === "password") {
    }
    const res = await axios({
      method: "PATCH",
      url: url,
      data: updateData,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} update in successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

import axios from "axios";
import localforage from "localforage";

export const register = async (userData) => {
  const res = await axios.post(
    "http://localhost:8000/users/register",
    userData
  );
  return res.data;
};

export const login = async (userData) => {
  const res = await axios.post("http://localhost:8000/users/login", userData);
  if (res.data) {
    await localforage.setItem("token", res.data);
  }
  return res.data.token;
};

export const logout = async () => {
  await localforage.removeItem("token");
  localStorage.removeItem("token");
};

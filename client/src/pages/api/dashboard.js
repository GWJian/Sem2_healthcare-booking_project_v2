//this is dashboard.js

import axios from "axios";
import localforage from "localforage";

//get all user
export const getAllUsers = async () => {
  let tok = await localforage.getItem("token");
  const res = await axios.get("http://localhost:8000/dashboard", {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//create a new user
export const createUser = async (user) => {
  let tok = await localforage.getItem("token");
  const res = await axios.post("http://localhost:8000/dashboard", user, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//read a user by id
export const getUserById = async (id) => {
  let tok = await localforage.getItem("token");
  const res = await axios.get(`http://localhost:8000/dashboard/${id}`, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//update a user by id
export const updateUserById = async (id, user) => {
  let tok = await localforage.getItem("token");
  const res = await axios.put(`http://localhost:8000/dashboard/${id}`, user, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//delete a user by id
export const deleteUserById = async (id) => {
  let tok = await localforage.getItem("token");
  const res = await axios.delete(`http://localhost:8000/dashboard/${id}`, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

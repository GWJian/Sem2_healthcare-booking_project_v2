//this is the profile.js

import axios from "axios";
import localforage from "localforage";

// get profile
export const getProfile = async () => {
  let tok = await localforage.getItem("token");
  const res = await axios.get("http://localhost:8000/profile", {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//update profile
export const updateProfile = async (profile) => {
  let tok = await localforage.getItem("token");
  const res = await axios.put("http://localhost:8000/profile", profile, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//this is the api for the user appoiment page

import axios from "axios";
import localforage from "localforage";

//customer can view own appointments
export const getOwnAppointments = async () => {
  let tok = await localforage.getItem("token");
  const res = await axios.get("http://localhost:8000/appointment", {
    headers: {
      "x-auth-token": tok.token,
    },
    params: {
      populate: "doctor",
      select: "doctor -_id username",
    },
  });
  return res.data;
};

//customer can create own appointments
export const createAppointment = async (appointmentData) => {
  let tok = await localforage.getItem("token");
  const res = await axios.post(
    "http://localhost:8000/appointment",
    appointmentData,
    {
      headers: {
        "x-auth-token": tok.token,
      },
    }
  );
  return res.data;
};

///customer can update own appointments
export const updateStatus = async (id, appointmentData) => {
  let tok = await localforage.getItem("token");
  const res = await axios.put(
    `http://localhost:8000/appointment/${id}`,
    appointmentData,
    {
      headers: {
        "x-auth-token": tok.token,
      },
    }
  );
  return res.data;
};

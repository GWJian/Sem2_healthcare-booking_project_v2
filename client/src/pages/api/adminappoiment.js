//this is the api for the admin appoiment page

import axios from "axios";
import localforage from "localforage";

//admin can view all appointments
export const getAllAppointments = async () => {
  let tok = await localforage.getItem("token");
  const res = await axios.get("http://localhost:8000/adminappointment", {
    headers: {
      "x-auth-token": tok.token,
    },
    params: {
      populate: "doctor",
      // select: "doctor -_id username",
    },
  });
  return res.data;
};

//doctor can view own appointments
export const getOwnAppointments = async () => {
  let tok = await localforage.getItem("token");
  const res = await axios.get("http://localhost:8000/adminappointment", {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

//admin and doctor can delete appointments
export const deleteAppointment = async (id) => {
  let tok = await localforage.getItem("token");
  const res = await axios.delete(
    `http://localhost:8000/adminappointment/${id}`,
    {
      headers: {
        "x-auth-token": tok.token,
      },
    }
  );
  return res.data;
};

//admin and doctor can create appointments
export const createAppointment = async (appointmentData) => {
  let tok = await localforage.getItem("token");
  const res = await axios.post(
    "http://localhost:8000/adminappointment",
    appointmentData,
    {
      headers: {
        "x-auth-token": tok.token,
      },
    }
  );
  return res.data;
};

//doctor can update own appointments
export const updateStatus = async (id, appointmentData) => {
  let tok = await localforage.getItem("token");
  const res = await axios.put(
    `http://localhost:8000/adminappointment/${id}`,
    appointmentData,
    {
      headers: {
        "x-auth-token": tok.token,
      },
    }
  );
  return res.data;
};

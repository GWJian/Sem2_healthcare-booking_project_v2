//this is customer create appointment

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { getAllAppointments } from "@/pages/api/adminappoiment";
import { createAppointment } from "@/pages/api/userappoiment";
import Select from "react-select";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import { getAllUsers } from "@/pages/api/dashboard";
import { getProfile } from "@/pages/api/profile";

export default function UserCreateAppoitment({ onClose }) {
  const queryClient = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, onChange] = useState("10:00");
  const [doctor, setDoctor] = useState([]);

  //========== Doctor& Customer:req.user._id Map Start================

  //get all doctor
  useEffect(() => {
    getAllUsers().then((data) => {
      const doctorUsers = data.filter((user) => user.role === "doctor");
      setDoctor(doctorUsers);
    });
  }, []);

  //get doctor .id and name
  const optionsDoctor = doctor.map((doctor) => ({
    value: doctor._id,
    label: doctor.name,
  }));

  //get self .id and name
  const { data: optionsCustomer } = useQuery("profile", getProfile);

  // console.log(optionsCustomer?.name);
  // console.log(data);
  // console.log(data._id);
  // console.log(data.name);

  //========== Doctor& Customer:req.user._id Map End================

  //==========Create Appointment Start================
  const { mutate } = useMutation(createAppointment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("appointments");
      onClose();
      Swal.fire("Success", data.message, "success");
    },
    onError: (error) => {
      Swal.fire(
        "Failed to add appointment",
        error.response.data.message,
        "error"
      );
    },
  });

  const handleAddAppointmentFormSubmit = (event) => {
    queryClient.invalidateQueries("appointments");
    if (!selectedDoctor) {
      return Swal.fire("Failed", "Doctor is required", "error");
    }

    const addAppointmentFormData = {
      customerId: optionsCustomer._id,
      doctorId: selectedDoctor.value,
      date: selectedDate,
      time: value,
    };
    mutate(addAppointmentFormData);
  };
  //==========Create Appointment End================

  //========== Get All Appointments and TimeSetting Start================

  const { data: allAppointments } = useQuery(
    "appointments",
    getAllAppointments
  );

  // console.log(allAppointments);

  const optionsAppointments = allAppointments?.map((appointment) => ({
    value: appointment.time,
    name: appointment.doctor.name,
    doctorId: appointment.doctor._id,
  }));

  // console.log(optionsAppointments);

  const isTimeDisabled = optionsAppointments?.some(
    (appointment) =>
      appointment.value === value &&
      selectedDoctor &&
      appointment.doctorId === selectedDoctor.value
  );

  //========== Get All Appointments  and TimeSetting End================

  return (
    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Add Member</h2>
        <form onSubmit={handleAddAppointmentFormSubmit}>
          <div className="mb-4">
            <div className="mb-4">
              <div className="App">
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  disabled
                  defaultValue={optionsCustomer?.name}
                />
              </div>
            </div>
            <div className="App">
              <p>Doctor</p>
              <Select
                defaultValue={optionsDoctor}
                onChange={setSelectedDoctor}
                options={optionsDoctor}
              />
            </div>
          </div>
          <div className="mb-4">
            <p>Date</p>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>
          <div>
            <label>Choose a time:</label>
            <TimePicker
              onChange={onChange}
              value={value}
              format="HH:mm"
              use12Hours={false}
            />
            {isTimeDisabled && (
              <span className="text-red-500 ml-2">Time not available</span>
            )}
          </div>
          <div className="mb-4"></div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-lg mr-2 focus:outline-none bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white focus:outline-none"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

//this is the admin and doctor create appoitment page

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import {
  createAppointment,
  getAllAppointments,
} from "@/pages/api/adminappoiment";
import Select from "react-select";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import { getAllUsers } from "@/pages/api/dashboard";

export default function AdminCreateAppoitment({ onClose }) {
  const queryClient = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [value, onChange] = useState("10:00");
  const [doctor, setDoctor] = useState([]);
  const [customer, setCustomer] = useState([]);

  //========== Doctor&Customer Map Start================
  useEffect(() => {
    getAllUsers().then((data) => {
      const doctorUsers = data.filter((user) => user.role === "doctor");
      setDoctor(doctorUsers);
    });
  }, []);
  const optionsDoctor = doctor?.map((doctor) => ({
    value: doctor._id,
    label: doctor.name,
  }));

  useEffect(() => {
    getAllUsers().then((data) => {
      const customerUsers = data.filter((user) => user.role === "customer");
      setCustomer(customerUsers);
    });
  }, []);
  const optionsCustomer = customer?.map((customer) => ({
    value: customer._id,
    label: customer.name,
  }));
  //========== Doctor&Customer Map End================

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
    event.preventDefault();

    if (!selectedDoctor || !selectedCustomer) {
      return Swal.fire(
        "Failed to add appointment",
        "Please select a doctor and a customer",
        "error"
      );
    }

    const addAppointment = {
      doctorId: selectedDoctor.value,
      customerId: selectedCustomer.value,
      date: startDate,
      time: value,
    };

    mutate(addAppointment);
  };
  //==========Create Appointment End================
  //========== Get All Appointments  and TimeSetting Start================
  const { data: allAppointments } = useQuery(
    "appointments",
    getAllAppointments
  );

  const optionsAppointments = allAppointments.map((appointment) => ({
    value: appointment.time,
    name: appointment.doctor.name,
    doctorId: appointment.doctor._id,
  }));

  // console.log(optionsAppointments);

  const isTimeDisabled = optionsAppointments.some(
    (appointment) =>
      appointment.value === value &&
      selectedDoctor &&
      appointment.doctorId === selectedDoctor.value
  );

  //========== Get All Appointments  and TimeSetting End================

  return (
    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Add Patient</h2>
        <form onSubmit={handleAddAppointmentFormSubmit}>
          <div className="mb-4">
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
            <div className="App">
              <p>User</p>
              <Select
                defaultValue={optionsCustomer}
                onChange={setSelectedCustomer}
                options={optionsCustomer}
              />
            </div>
          </div>
          <div className="mb-4">
            <p>Date</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          <div>
            <label>Choose a time:</label>

            <TimePicker
              onChange={onChange}
              value={value}
              format="HH:mm"
              use12Hours={false}
              minTime="10:00"
              maxTime="18:00"
              className="hide-minute-selector"
            />
            {isTimeDisabled && (
              <span className="text-red-500 ml-2">Time not available</span>
            )}
          </div>
          <div className="mb-4"></div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg mr-2 focus:outline-none bg-gray-200 hover:bg-gray-300"
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

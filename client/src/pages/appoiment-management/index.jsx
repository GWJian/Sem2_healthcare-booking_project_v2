//this is the appoiment page
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  getAllAppointments,
  deleteAppointment,
  updateStatus,
} from "@/pages/api/adminappoiment";
import Moment from "react-moment";
import AdminCreateAppoitment from "@/components/appoitment/AdminCreateAppoitment";
import localforage from "localforage";

export default function Appoimentmanagement() {
  const queryClient = useQueryClient();
  const [showAddAppointmentForm, setShowAddAppointmentForm] = useState(false);
  const [user, setUser] = useState(); //role
  const [selectedStatus, setSelectedStatus] = useState({
    status: "",
  });
  const [editModes, setEditModes] = useState({});

  // ================= Update Appoiment Start =================

  const handleEditForm = (id) => {
    setEditModes((prevModes) => ({
      ...prevModes,
      [id]: true,
    }));
    setSelectedStatus((prevStatus) => ({
      ...prevStatus, // 保留之前的状态 不然会被覆盖
      [id]: "", // 初始化选中状态为空字符串
    }));
  };

  const handleCancelEdit = (id) => {
    setEditModes((prevModes) => ({
      ...prevModes,
      [id]: false,
    }));
  };

  const handleUpdateStatus = async (id) => {
    try {
      await updateStatus(id, { status: selectedStatus[id] });
      queryClient.invalidateQueries("appointments");
      Swal.fire(
        "Updated!",
        "Your appointment has been updated.",
        "success"
      ).then((result) => {
        if (result.isConfirmed) {
          handleCancelEdit(id); // 取消编辑模式
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };
  // ================= Update Appoiment End =================

  //================ Role Start =================
  useEffect(() => {
    const getToken = async () => {
      const token = await localforage.getItem("token");
      if (token) {
        setUser(token.user);
      }
    };
    getToken();
  }, []);
  // console.log(user);
  //================ Role End =================

  // ================= Show appointments Start =================
  const { data } = useQuery("appointments", getAllAppointments, {
    select: (data) => data.sort((a, b) => new Date(b.date) - new Date(a.date)),
  });

  // console.log(data);

  // ================= Show appointments End =================

  // ================= Delete Appoiment  Start =================
  const handleDeleteMember = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this appoiment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteAppointment(id);
        queryClient.invalidateQueries("appointments");
        Swal.fire("Deleted!", "Your appoiment has been deleted.", "success");
      }
    });
  };

  // ================= Delete Appoiment End =================

  // ================= Create Appoitment Start =================
  const handleAddAppointment = () => {
    setShowAddAppointmentForm(true);
  };

  const handleCloseAddAppointmentForm = () => {
    setShowAddAppointmentForm(false);
  };

  if (showAddAppointmentForm) {
    return <AdminCreateAppoitment onClose={handleCloseAddAppointmentForm} />;
  }
  // ================= Create Appoitment End =================

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Appointment Management
          </h3>
          <p className="text-gray-600 mt-2">
            This is the appoiment management page
          </p>
        </div>

        {/* ================= Create Appoiment Button Start =================  */}
        <div className="mt-3 md:mt-0">
          <button
            onClick={handleAddAppointment}
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            Create Appointment
          </button>
        </div>
        {/* ================= Create Appoiment Button End =================  */}
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Username</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Doctor</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Time</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {data?.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.customer?.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.customer?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.doctor?.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Moment format="YYYY/MM/DD">{item?.date}</Moment>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item?.time}</td>

                {/* =================== Select Status Start ===================    */}

                <td className="px-6 py-4 whitespace-nowrap">
                  {editModes[item._id] ? (
                    <select
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={selectedStatus[item._id]}
                      onChange={(e) =>
                        setSelectedStatus((prevStatus) => ({
                          ...prevStatus,
                          [item._id]: e.target.value, // 更新选中状态
                        }))
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    item.status
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {editModes[item._id] ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCancelEdit(item._id)}
                        className="inline-flex items-center justify-center px-4 py-2 text-white duration-150 font-medium bg-red-600 rounded-lg hover:bg-red-500 active:bg-red-700 md:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item._id)}
                        className="inline-flex items-center justify-center px-4 py-2 text-white duration-150 font-medium bg-green-600 rounded-lg hover:bg-green-500 active:bg-green-700 md:text-sm"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      {user?.role === "doctor" ? (
                        <button
                          onClick={() => handleEditForm(item._id)}
                          disabled={
                            item.status === "accepted" ||
                            item.status === "cancelled"
                          }
                          className="btn"
                        >
                          Edit
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDeleteMember(item._id)}
                        className="inline-flex items-center justify-center px-4 py-2 text-white duration-150 font-medium bg-red-600 rounded-lg hover:bg-red-500 active:bg-red-700 md:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>

                {/* =================== Select Status End ===================     */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

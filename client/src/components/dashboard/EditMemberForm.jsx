import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getUserById, updateUserById } from "@/pages/api/dashboard";

export default function EditMemberForm({ id, onClose }) {
  const [editFormData, seteditFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        seteditFormData(user); //解释：当user变化时，seteditFormData会重新执行 -从而更新页面
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [id]); //解释：当id变化时，useEffect会重新执行

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    seteditFormData((prevData) => ({ ...prevData, [name]: value }));
  }; //解释：当name变化时，seteditFormData会重新执行

  const handleSubmit = async (event) => {
    try {
      await updateUserById(id, editFormData);
      Swal.fire("Success!", "Member updated successfully", "success").then(() =>
        onClose(true)
      ); // 解释：onClose(true)会触发Dashboard.jsx中的useEffect，从而重新获取members
    } catch (error) {
      Swal.fire(
        "Failed to update member",
        error.response.data.message,
        "error"
      );
    }
  };

  return (
    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Edit Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
              value={editFormData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
              disabled
              value={editFormData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
              value={editFormData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-gray-700 font-medium mb-2"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="border border-gray-300 px-4 py
                -2 rounded-lg w-full focus:outline-none focus:border-blue-500"
              value={editFormData.role}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
              value={editFormData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
            >
              Update
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

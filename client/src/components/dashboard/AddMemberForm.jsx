import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { createUser } from "@/pages/api/dashboard";

export default function AddMemberForm({ onClose }) {
  const queryClient = useQueryClient(); //解释：当queryClient变化时，useMutation会重新执行

  const [addFormData, setAddFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddFormData((prevData) => ({ ...prevData, [name]: value })); //解释：设置addFormData state - 当name变化时，setAddFormData会重新执行 -从而更新页面
  };

  const { mutate } = useMutation(createUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("users"); //解释：当queryClient变化时，useQuery会重新执行
      onClose();
      Swal.fire("Success", data.message, "success");
    },
    onError: (error) => {
      Swal.fire("Failed to add user", error.response.data.message, "error");
    },
  });

  const handleAddMemberFormSubmit = (event) => {
    event.preventDefault();
    mutate(addFormData); //解释：当addFormData变化时，mutate会重新执行
  };

  return (
    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Add Member</h2>
        <form onSubmit={handleAddMemberFormSubmit}>
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
              value={addFormData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
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
              value={addFormData.username}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
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
              value={addFormData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
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
              value={addFormData.role}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
            >
              <option value="">Select role</option>
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
              value={addFormData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="border border-gray-300 px-4 py-2 rounded-lg mr-2 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

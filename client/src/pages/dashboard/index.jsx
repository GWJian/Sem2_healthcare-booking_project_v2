//this is the dashboard page
import Swal from "sweetalert2";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getAllUsers, deleteUserById } from "@/pages/api/dashboard";
import AddMemberForm from "@/components/dashboard/AddMemberForm";
import EditMemberForm from "@/components/dashboard/EditMemberForm";

export default function Dashboard() {
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showEditMemberForm, setShowEditMemberForm] = useState(false);

  const queryClient = useQueryClient();

  // ================= Show Profile Start =================
  const { data } = useQuery("users", getAllUsers);
  // console.log(data);

  // ================= Show Profile End =================

  // ================= Add Member and use AddMemberForm Start =================

  const handleAddMember = () => {
    setShowAddMemberForm(true);
  };

  const handleCloseAddMemberForm = () => {
    setShowAddMemberForm(false);
  };

  if (showAddMemberForm) {
    return <AddMemberForm onClose={handleCloseAddMemberForm} />;
  }
  // ================= Add Member and use AddMemberForm End =================

  // ================= Edit Member and use EditMemberForm Start =================

  const handleEditMember = (id) => {
    setShowEditMemberForm(id);
  };

  const handleCloseEditMemberForm = () => {
    setShowEditMemberForm(false);
  };

  if (showEditMemberForm) {
    return (
      <EditMemberForm
        id={showEditMemberForm}
        onClose={handleCloseEditMemberForm}
      />
    );
  }
  // ================= Edit Member and use EditMemberForm End =================

  // ================= Delete Member Start =================

  //can use de code
  const handleDeleteMember = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUserById(id);
        queryClient.invalidateQueries("users");
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  // ================= Delete Member End =================

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 pt-20 ">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Dashboard
          </h3>
        </div>

        {/* ================= Add Member Start =================  */}
        <div className="mt-3 md:mt-0">
          <button
            onClick={() => handleAddMember()}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
          >
            Add Member
          </button>
        </div>
        {/* ================= Add Member End =================  */}
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          {/* ================= Table Header Start =================  */}
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Username</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          {/* ================= Table Header End =================  */}

          <tbody className="text-gray-600 divide-y">
            {/* ================= Table Item Start =================  */}
            {data?.map((item, idx) => (
              <tr key={idx}>
                <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                  <div>
                    <span className="block text-gray-700 text-sm font-medium">
                      {item.name}
                    </span>
                    <span className="block text-gray-700 text-xs">
                      {item.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.role}</td>
                <td className="text-right px-6 whitespace-nowrap">
                  {/* ================= Edit Button Start =================  */}
                  <button
                    onClick={() => handleEditMember(item._id)}
                    className="py-2 leading-none px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                  >
                    Edit
                  </button>
                  {/* ================= Edit Button End =================  */}

                  {/* ================= Delete Button Start =================   */}
                  <button
                    href=""
                    className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                    onClick={() => handleDeleteMember(item._id)}
                  >
                    Delete
                  </button>
                  {/* ================= Delete Button End =================  */}
                </td>
              </tr>
            ))}
            {/* ================= Table Item End =================  */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

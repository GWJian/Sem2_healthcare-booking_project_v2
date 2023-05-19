import Swal from "sweetalert2";
import { useState } from "react";
import { Input, Button } from "react-daisyui";
import { useQuery, useMutation } from "react-query";
import { getProfile, updateProfile } from "@/pages/api/profile";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  //==================== Show Profile Start ======================
  const { data: profileData, isLoading } = useQuery("profile", getProfile);
  //==================== Show Profile End ======================

  //==================== Update Profile Start ======================
  const { mutate } = useMutation(updateProfile, {
    onSuccess: () => {
      Swal.fire("Success", "Profile updated", "success");
    },
    onError: (error) => {
      Swal.fire("Failed to update profile", error.response.data.msg, "error");
    },
  });
  //==================== Update Profile End ======================

  //==================== Handle Submit Start ======================
  const handleSubmit = (event) => {
    event.preventDefault();
    if (profileData.password !== profileData.password2) {
      Swal.fire("Failed to update profile", "Passwords do not match", "error");
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to update your profile",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          mutate(profileData);
          setIsEditing(false);
        }
      });
    }
  };
  //==================== Handle Submit End ======================

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12">
      <div className="sm:col-start-5 sm:col-span-4 col-span-10 col-start-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <small>
              <b>Full Name</b>
            </small>
            <Input
              className="w-full"
              type="text"
              placeholder="Full Name"
              name="name"
              disabled={true}
              defaultValue={profileData.name}
              onChange={(event) => (profileData.name = event.target.value)}
            />
          </div>
          <div className="mb-4">
            <small>
              <b>Username</b>
            </small>
            <Input
              className="w-full"
              type="text"
              placeholder="Username"
              name="username"
              defaultValue={profileData.username}
              disabled={true}
            />
          </div>
          <div className="mb-4">
            <small>
              <b>Email</b>
            </small>
            <Input
              className="w-full"
              type="email"
              placeholder="Email"
              name="email"
              defaultValue={profileData.email}
              readOnly={!isEditing}
              onChange={(event) => (profileData.email = event.target.value)}
            />
          </div>
          <div className="mb-4">
            <small>
              <b>Password</b>
            </small>
            <Input
              className="w-full"
              type="password"
              placeholder="Password"
              name="password"
              defaultValue=""
              readOnly={!isEditing}
              onChange={(event) => (profileData.password = event.target.value)}
            />
          </div>
          <div className="mb-4">
            <small>
              <b>Confirm Password</b>
            </small>
            <Input
              className="w-full"
              type="password"
              placeholder="Confirm Password"
              name="password2"
              defaultValue=""
              readOnly={!isEditing}
              onChange={(event) => (profileData.password2 = event.target.value)}
            />
          </div>
          <div className="mt-4">
            {!isEditing && <Button onClick={handleEdit}>Edit Profile</Button>}
            {isEditing && (
              <>
                <Button type="submit" className="mr-2">
                  Confirm
                </Button>
                <Button onClick={handleCancel} className="mr-2">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

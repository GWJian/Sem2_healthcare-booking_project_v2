import { Input, Button } from "react-daisyui";
import { useState } from "react";
import Swal from "sweetalert2";
import { register } from "../api/user";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

export default function Register() {
  const [user, setUser] = useState({});
  const { push } = useRouter();

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const { mutate } = useMutation(register, {
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Register Success!",
      });
      push("/login");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (user.password !== user.password2)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password not match!",
      });
    mutate(user);
  };

  return (
    <div className="grid grid-cols-12">
      <div className="sm:col-start-5 sm:col-span-4 col-span-10 col-start-2">
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <Input
              className="w-full"
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-4">
            <Input
              className="w-full"
              type="text"
              placeholder="Username"
              name="username"
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-4">
            <Input
              className="w-full"
              type="email"
              placeholder="Email"
              name="email"
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-4">
            <Input
              className="w-full"
              type="password"
              placeholder="Password"
              name="password"
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-4">
            <Input
              className="w-full"
              type="password"
              placeholder="Confirm Password"
              name="password2"
              onChange={onChangeHandler}
            />
          </div>
          <Button className="block w-full">Register</Button>
        </form>
      </div>
    </div>
  );
}

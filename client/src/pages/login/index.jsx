import { Input, Button } from "react-daisyui";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { login } from "../api/user";
import Swal from "sweetalert2";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const onChangeHandler = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      if (!localStorage.getItem("token")) {
        //解释: 如果localStorage里面没有token, 就把token存进去
        localStorage.setItem("token", data.token); //解释: 如果localStorage里面有token, 就把token删掉
        localStorage.setItem("user", JSON.stringify(data.user));
        queryClient.invalidateQueries("token", data.token); //queryClient.invalidateQueries("token", data) 会触发useQuery里面的queryKey: ["token", data]重新执行
      }

      window.location.href = "/"; // this will reload the page
    },
    onError: (error) => {
      Swal.fire("Failed to login", error.response.data.msg, "error");
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    mutate(user);
  };

  return (
    <div className="grid grid-cols-12">
      <div className="sm:col-start-5 sm:col-span-4 col-span-10 col-start-2">
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <Input
              onChange={onChangeHandler}
              className="w-full"
              type="text"
              placeholder="Username"
              name="username"
            />
          </div>
          <div className="mb-4">
            <Input
              onChange={onChangeHandler}
              className="w-full"
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>

          <Button className="block w-full">Login</Button>

          {/* <Button
            //blue button
            className="block w-full mt-5"
            color="primary"
            onClick={() => signIn()}
          >
            Google
          </Button> */}
        </form>
      </div>
    </div>
  );
}

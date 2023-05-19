import axios from "axios";
import { useQuery } from "react-query";
import { getProfile } from "@/pages/api/profile";

export default function AuthPage(props) {
  const { data: profileData } = useQuery("profile", getProfile);

  const onSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target[0];
    // console.log(value);
    axios
      .post("http://localhost:8000/authenticate", {
        username: value,
      })
      .then((r) => props.onAuth({ username: value, secret: value }))
      .catch((err) => console.log(err));
  };

  return (
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <form onSubmit={onSubmit}>
        <div class="mx-auto max-w-lg text-center">
          <h1 class="text-2xl font-bold sm:text-3xl">Welcome 👋</h1>

          <p class="mt-4 mb-4 text-gray-500">Click Enter to get started</p>
          <input
            type="text"
            name="username"
            disabled
            value={profileData?.username}
            className="input input-bordered w-full max-w-xs"
          />
          <div className="mt-5">
            <button
              class="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
              type="submit"
            >
              <span class="block rounded-full bg-white px-8 py-3 text-sm font-medium hover:bg-transparent">
                Enter
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

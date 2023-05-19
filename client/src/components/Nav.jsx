import { Navbar, Button, Dropdown } from "react-daisyui";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import localforage from "localforage";
import { logout } from "@/pages/api/user";
import { useSession } from "next-auth/react";

export default function Nav() {
  // const { data: session } = useSession();
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  //===== check is user login start =====
  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuth(token);
        setLoading(false);
      }
    };
    getToken();
  }, []);
  //===== check is user login end =====

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

  return (
    <div className="pb-1 flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
      <Navbar>
        <Navbar.Start>
          <Dropdown>
            <Button color="ghost" shape="circle" tabIndex={0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </Button>

            {/* =================================Dropdown Menu Start ==================================== */}
            <Dropdown.Menu tabIndex={0} className="menu-compact w-52">
              {/* everyone can see this page */}
              <Dropdown.Item href="/">Homepage</Dropdown.Item>

              {/* only Login user can see this page Start*/}
              {auth && (
                <>
                  <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="/appoiment">Appoiment</Dropdown.Item>
                  <Dropdown.Item href="/chat">Chat</Dropdown.Item>

                  {user?.role === "admin" && (
                    <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                  )}

                  {(user?.role === "doctor" || user?.role === "admin") && (
                    <Dropdown.Item href="/appoiment-management">
                      Appointment Manage
                    </Dropdown.Item>
                  )}
                </>
              )}
              {/* only Login user can see this page End*/}
            </Dropdown.Menu>
            {/* =================================Dropdown Menu End==================================== */}
          </Dropdown>
        </Navbar.Start>

        {/* ================================= Login,Register/Logout ==================================== */}
        <Navbar.End className="navbar-end">
          {!auth ? (
            <>
              <Button color="ghost" href="/login">
                Login
              </Button>
              <Button color="ghost" href="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button
                color="ghost"
                onClick={() => {
                  logout();
                  setAuth(false);
                  push("/");
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Navbar.End>
        {/* ================================= Login/Logout End ==================================== */}
      </Navbar>
    </div>
  );
}

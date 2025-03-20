import Logo from "../assets/Logo.png";
import { Button } from "antd";
import { useAuth } from "../context/Context";
import { MdOutlineAccountCircle } from "react-icons/md";
import CustomDrawer from "./Drawer";

function NavBar() {
  const { username, setOpen } = useAuth();

  return (
    <div className=" bg-gray-200">
      <div className="flex flex-row justify-between items-center p-4 sm:w-11/12 w-full mx-auto">
        <img
          src={Logo}
          alt="Logo"
          className="h-15 w-15 rounded-lg"
          onClick={() => (window.location.href = "/")}
        />

        <div className="flex">
          {username ? (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center h-10 w-10 bg-white rounded-full mr-4"
            >
              <MdOutlineAccountCircle className="w-10 h-10" />
            </button>
          ) : (
            <Button
              onClick={() => window.location.replace("/login")}
              className="mr-4"
            >
              Login
            </Button>
          )}
          {!username && (
            <Button
              onClick={() => window.location.replace("/register")}
              type="primary"
            >
              Register
            </Button>
          )}
        </div>
      </div>
      <CustomDrawer />
    </div>
  );
}

export default NavBar;

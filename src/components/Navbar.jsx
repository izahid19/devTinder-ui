import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../utils/config";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { successToaster, errorToaster } from "./Toaster";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      successToaster("Logged Out Successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      errorToaster("Logout failed");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md border-b border-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
          Dev Tinder
        </Link>
      </div>
      {user && (
        <div className="flex gap-3 items-center">
          <span className="hidden md:inline text-sm font-medium text-base-content/80">
            Welcome {user.firstName}
          </span>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  alt="User Avatar"
                  src={user.profilePicture || "https://i.pravatar.cc/100"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="justify-between" to="/profile">
                  Profile
                  <span className="badge badge-primary">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">My Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li
                onClick={handleLogout}
                className="cursor-pointer text-error font-semibold"
              >
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

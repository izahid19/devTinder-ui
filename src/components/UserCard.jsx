import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { successToaster, errorToaster } from "./Toaster";

const UserCard = ({ user }) => {

    const dispatch = useDispatch();
    const handleSendRequest = async (status, userId) => {
      try {
        await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {
          withCredentials: true,
        });
        dispatch(removeUserFromFeed(userId));
        successToaster("Request sent successfully!");
      } catch (err) {
        console.error(err);
        errorToaster("Failed to send request");
      }
    }
    
  return (
    <div className="card w-80 bg-base-200 shadow-xl">
      {/* Profile Image */}
      <figure>
        <img
          src={user?.profilePicture}
          alt={`${user?.firstName} ${user?.lastName}`}
          className="h-60 w-full object-cover"
        />
      </figure>

      {/* Card Body */}
      <div className="card-body items-center text-center">
        {/* Name + Age */}
        <h2 className="card-title capitalize">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-sm text-gray-400">
          {user?.age} years • {user?.gender}
        </p>

        {/* Optional Desc */}
        {user?.desc && <p className="text-sm">{user?.desc}</p>}

        {/* Hobbies */}
        {user?.hobbies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {user.hobbies.map((hobby, idx) => (
              <span key={idx} className="badge badge-outline">
                {hobby}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-center mt-4">
          <button
            className="btn btn-success text-white"
            onClick={() => handleSendRequest("interested", user?._id)}
          >
            Interested
          </button>
          <button
            className="btn btn-error text-white"
            onClick={() => handleSendRequest("rejected", user?._id)}
          >
            Rejected
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

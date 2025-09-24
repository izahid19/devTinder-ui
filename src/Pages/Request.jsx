import { useEffect } from "react";
import Curve from "../components/RouteAnimation/Curve";
import { BASE_URL } from "../utils/config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/requestSlice";
import { successToaster, errorToaster } from "../components/Toaster";

const Request = () => {
  const requests = useSelector((state) => state?.request) || [];
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/request/review`, {
        withCredentials: true,
      });
      dispatch(addRequest(response?.data?.data || []));
    } catch (err) {
      console.error(err);
      errorToaster("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId, userName) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );
      successToaster(`✅ Accepted request from ${userName}`);
      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      errorToaster("❌ Failed to accept request");
    }
  };

  const handleReject = async (requestId, userName) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true }
      );
      successToaster(`🚫 Rejected request from ${userName}`);
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      errorToaster("❌ Failed to reject request");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getHobbiesText = (hobbies) => {
    if (!hobbies || hobbies.length === 0) return "No hobbies listed";
    return hobbies.join(", ");
  };

  return (
    <Curve>
      <div className="min-h-screen bg-base-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Connection Requests
            </h1>
            <p className="text-base-content/70 text-lg">
              {requests?.length === 0
                ? "No pending requests"
                : `${requests?.length || 0} pending request${
                    (requests?.length || 0) > 1 ? "s" : ""
                  }`}
            </p>
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {requests?.length === 0 ? (
              <div className="bg-base-300 rounded-3xl shadow-md p-12 text-center border border-base-100">
                <div className="w-24 h-24 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">👥</span>
                </div>
                <h3 className="text-2xl font-semibold text-base-content mb-2">
                  No Pending Requests
                </h3>
                <p className="text-base-content/70">
                  You're all caught up! New connection requests will appear here.
                </p>
              </div>
            ) : (
              requests?.map((request) => (
                <div
                  key={request?._id}
                  className="bg-base-300 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-100"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0 self-center md:self-start">
                        <div className="relative">
                          <img
                            src={request?.fromUserId?.profilePicture}
                            alt={`${request?.fromUserId?.firstName || "User"} ${
                              request?.fromUserId?.lastName || ""
                            }`}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-base-200 shadow-md"
                            onError={(e) => {
                              e.target.src =
                                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-base-100"></div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-grow space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-2xl font-bold text-base-content mb-1">
                              {request?.fromUserId?.firstName || "Unknown"}{" "}
                              {request?.fromUserId?.lastName || ""}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-base-content/70">
                              <span className="flex items-center gap-1">
                                🎂 {request?.fromUserId?.age || "N/A"} years old
                              </span>
                              <span className="flex items-center gap-1 capitalize">
                                👤{" "}
                                {request?.fromUserId?.gender || "Not specified"}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-base-content/50">
                            {formatDate(request?.createdAt)}
                          </div>
                        </div>

                        {/* Description */}
                        {request?.fromUserId?.desc && (
                          <div className="bg-base-200 rounded-xl p-4 border border-base-100 shadow-sm">
                            <p className="text-base-content/80 italic">
                              "{request?.fromUserId?.desc}"
                            </p>
                          </div>
                        )}

                        {/* Hobbies */}
                        <div className="bg-base-200 rounded-xl p-4 border border-base-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">💝</span>
                            <span className="font-medium text-purple-400">
                              Interests
                            </span>
                          </div>
                          <p className="text-base-content/80">
                            {getHobbiesText(request?.fromUserId?.hobbies)}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium capitalize">
                            {request?.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-base-100">
                      <button
                        onClick={() =>
                          handleAccept(
                            request?._id,
                            `${request?.fromUserId?.firstName || "Unknown"} ${
                              request?.fromUserId?.lastName || ""
                            }`
                          )
                        }
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-2"
                      >
                        ✓ Accept Request
                      </button>
                      <button
                        onClick={() =>
                          handleReject(
                            request?._id,
                            `${request?.fromUserId?.firstName || "Unknown"} ${
                              request?.fromUserId?.lastName || ""
                            }`
                          )
                        }
                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-500 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-2"
                      >
                        ✕ Decline Request
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Curve>
  );
};

export default Request;

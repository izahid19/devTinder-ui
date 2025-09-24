import { useEffect } from 'react'
import { BASE_URL } from '../utils/config'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../utils/connectionSlice'
import Curve from "../components/RouteAnimation/Curve";
import { errorToaster } from "../components/Toaster"

const Connections = () => {
  const connections = useSelector((state) => state?.connection) || []
  const dispatch = useDispatch()

  const fetchConnections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/connection`, {
        withCredentials: true,
      })
      dispatch(addConnection(response?.data?.data || []))
    } catch (err) {
      console.error(err)
      errorToaster("Failed to fetch connections")
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getHobbiesText = (hobbies) => {
    if (!hobbies || hobbies.length === 0) return "No hobbies listed"
    return hobbies.join(", ")
  }

  const handleMessage = (userId, userName) => {
    console.log(`Opening chat with ${userName}`, userId)
  }

  const handleViewProfile = (userId, userName) => {
    console.log(`Viewing profile of ${userName}`, userId)
  }

  return (
    <Curve>
      <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              My Connections
            </h1>
            <p className="text-base-content/70 text-lg">
              {connections?.length === 0
                ? "No connections yet"
                : `${connections?.length || 0} connection${
                    (connections?.length || 0) !== 1 ? "s" : ""
                  }`}
            </p>
          </div>

          {/* Connections Grid */}
          {connections?.length === 0 ? (
            <div className="card bg-base-200 shadow-xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Connections Yet</h3>
              <p className="text-base-content/70">
                Start connecting with people to see them here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections?.map((connection) => {
                const connectedUser =
                  connection?.fromUserId || connection?.toUserId || connection

                return (
                  <div
                    key={connection?._id || Math.random()}
                    className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <div className="card-body items-center text-center">
                      {/* Avatar */}
                      <div className="avatar relative">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={
                              connectedUser?.profilePicture ||
                              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            }
                            alt={`${connectedUser?.firstName || "User"} ${
                              connectedUser?.lastName || ""
                            }`}
                            onError={(e) => {
                              e.target.src =
                                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            }}
                          />
                        </div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-base-100"></div>
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-bold mt-4">
                        {connectedUser?.firstName || "Unknown"}{" "}
                        {connectedUser?.lastName || ""}
                      </h3>

                      {/* Info */}
                      <div className="flex gap-4 text-sm text-base-content/70 mt-2">
                        <span>🎂 {connectedUser?.age || "N/A"} yrs</span>
                        <span className="capitalize">
                          👤 {connectedUser?.gender || "Not specified"}
                        </span>
                      </div>

                      {connection?.createdAt && (
                        <p className="text-xs text-base-content/50 mt-1">
                          Connected {formatDate(connection.createdAt)}
                        </p>
                      )}

                      {/* Desc */}
                      {connectedUser?.desc && (
                        <div className="bg-base-300 rounded-lg p-3 mt-4">
                          <p className="text-sm italic">
                            "{connectedUser.desc}"
                          </p>
                        </div>
                      )}

                      {/* Hobbies */}
                      <div className="bg-base-300 rounded-lg p-3 w-full mt-4">
                        <h4 className="font-medium text-sm mb-1">💝 Interests</h4>
                        <p className="text-sm text-base-content/70">
                          {getHobbiesText(connectedUser?.hobbies)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="card-actions justify-center mt-4 w-full">
                        <button
                          className="btn btn-primary btn-sm w-1/2"
                          onClick={() =>
                            handleMessage(
                              connectedUser?._id,
                              `${connectedUser?.firstName || "Unknown"} ${
                                connectedUser?.lastName || ""
                              }`
                            )
                          }
                        >
                          💬 Message
                        </button>
                        <button
                          className="btn btn-secondary btn-sm w-1/2"
                          onClick={() =>
                            handleViewProfile(
                              connectedUser?._id,
                              `${connectedUser?.firstName || "Unknown"} ${
                                connectedUser?.lastName || ""
                              }`
                            )
                          }
                        >
                          👤 Profile
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Curve>
  )
}

export default Connections

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { successToaster, errorToaster } from "../components/Toaster";
import Curve from "../components/RouteAnimation/Curve";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

// Always include credentials for JWT cookies
axios.defaults.withCredentials = true;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    emailId: user?.emailId || "",
    age: user?.age || "",
    gender: user?.gender || "",
    profilePicture: user?.profilePicture || "",
    hobbies: user?.hobbies || [],
    desc: user?.desc || "",
  });

  const [newHobby, setNewHobby] = useState("");

  // ✅ Compare original vs current form data
  const getChangedFields = (original, updated) => {
    const changes = {};
    for (let key in updated) {
      if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
        changes[key] = updated[key];
      }
    }
    return changes;
  };

  // ✅ Save (PUT)
  const updateProfile = async () => {
    try {
      setIsSaving(true);

      // remove emailId before sending to backend (read-only field)
      const { emailId, ...dataToSend } = formData;

      const response = await axios.put(`${BASE_URL}/profile/update`, dataToSend);

      dispatch(addUser(response.data.data)); // backend sends { message, data }
      successToaster("Profile updated successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg =
        error.response?.data?.error || "Failed to update profile. Try again.";
      errorToaster(msg);
    } finally {
      setIsSaving(false);
      setShowConfirmModal(false);
    }
  };

  // ✅ Detect if there are any changes
  useEffect(() => {
    if (user) {
      const changes = getChangedFields(user, formData);
      setHasChanges(Object.keys(changes).length > 0);
    }
  }, [formData, user]);

  // ✅ Reset formData when Redux user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        emailId: user.emailId || "",
        age: user.age || "",
        gender: user.gender || "",
        profilePicture: user.profilePicture || "",
        hobbies: user.hobbies || [],
        desc: user.desc || "",
      });
      setHasChanges(false);
    }
  }, [user]);

  // ✅ Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || "" : value,
    }));
  };

  // ✅ Hobby Add/Remove
  const handleAddHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()],
      }));
      setNewHobby("");
    }
  };

  const handleRemoveHobby = (hobbyToRemove) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((hobby) => hobby !== hobbyToRemove),
    }));
  };

  // ✅ Cancel changes
  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      age: user.age || "",
      gender: user.gender || "",
      profilePicture: user.profilePicture || "",
      hobbies: user.hobbies || [],
      desc: user.desc || "",
    });
    setHasChanges(false);
  };

  // ✅ Loading state (no user data yet)
  if (!user) {
    return (
      <Curve>
        <div className="min-h-screen flex justify-center items-center bg-base-100">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Curve>
    );
  }

  return (
    <Curve>
      <div className="min-h-screen bg-base-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">My Profile</h1>
            <p className="text-base-content/70">
              Manage your personal information
            </p>
          </div>

          <div className="card bg-base-200 shadow-2xl">
            <div className="card-body p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0 text-center">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 mx-auto">
                      <img
                        src={formData.profilePicture}
                        alt="Profile"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src =
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-control mt-4">
                    <input
                      type="url"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full max-w-xs"
                      placeholder="Profile picture URL"
                    />
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          First Name
                        </span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="Enter first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Last Name
                        </span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="Enter last name"
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        readOnly
                        className="input input-bordered w-full bg-base-100 cursor-not-allowed opacity-70"
                      />
                    </div>

                    {/* Age */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Age</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        min="1"
                        max="120"
                        placeholder="Enter age"
                      />
                    </div>

                    {/* Gender */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Gender</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Member Since */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Member Since
                        </span>
                      </label>
                      <div className="p-3 bg-base-100 rounded-lg border">
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* About Me */}
                  <div className="form-control mt-6">
                    <label className="label">
                      <span className="label-text font-semibold">About Me</span>
                    </label>
                    <textarea
                      name="desc"
                      value={formData.desc}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-24 w-full"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  {/* Hobbies */}
                  <div className="form-control mt-6">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Hobbies & Interests
                      </span>
                    </label>
                    <div>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newHobby}
                          onChange={(e) => setNewHobby(e.target.value)}
                          className="input input-bordered flex-1"
                          placeholder="Add a hobby..."
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddHobby()
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAddHobby}
                          className="btn btn-primary"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.hobbies.map((hobby, index) => (
                          <div
                            key={index}
                            className="badge badge-primary gap-2 p-3"
                          >
                            {hobby}
                            <button
                              type="button"
                              onClick={() => handleRemoveHobby(hobby)}
                              className="btn btn-ghost btn-xs text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ✅ Action Buttons */}
                  <div className="flex justify-end gap-3 mt-10">
                    <button
                      className="btn btn-success"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!hasChanges || isSaving}
                    >
                      {isSaving && (
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                      )}
                      Save Changes
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={handleCancel}
                      disabled={!hasChanges || isSaving}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Confirm Save Modal */}
      {showConfirmModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Save</h3>
            <p className="py-4">
              Are you sure you want to save the changes to your profile?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={updateProfile}
                disabled={isSaving}
              >
                {isSaving && (
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                )}
                Yes, Save
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </Curve>
  );
};

export default ProfilePage;

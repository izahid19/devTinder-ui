// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { successToaster, errorToaster } from "../components/Toaster";
import Curve from "../components/RouteAnimation/Curve";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    emailId: user?.emailId || "",
    age: user?.age || "",
    gender: user?.gender || "",
    profilePicture: user?.profilePicture || "",
    hobbies: user?.hobbies || [],
    desc: user?.desc || ""
  });
  const [newHobby, setNewHobby] = useState("");

  // ✅ Utility: Get only changed fields
  const getChangedFields = (original, updated) => {
    const changes = {};
    for (let key in updated) {
      if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
        changes[key] = updated[key];
      }
    }
    return changes;
  };

  // ✅ Update profile (only changed fields)
  const updateProfile = async () => {
    try {
      setIsSaving(true);

      const changes = getChangedFields(user, formData);

      if (Object.keys(changes).length === 0) {
        successToaster("No changes to update");
        setIsEditing(false);
        setIsSaving(false);
        return;
      }

      const response = await axios.patch(`${BASE_URL}/profile/update`, changes);
      dispatch(addUser(response.data));
      setIsEditing(false);
      successToaster("Profile updated successfully!");
    } catch (error) {
      errorToaster("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Sync formData with user from Redux
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
        desc: user.desc || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" ? (parseInt(value) || "") : value
    }));
  };

  const handleAddHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }));
      setNewHobby("");
    }
  };

  const handleRemoveHobby = (hobbyToRemove) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(hobby => hobby !== hobbyToRemove)
    }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      age: user.age || "",
      gender: user.gender || "",
      profilePicture: user.profilePicture || "",
      hobbies: user.hobbies || [],
      desc: user.desc || ""
    });
    setIsEditing(false);
  };

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
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">My Profile</h1>
            <p className="text-base-content/70">Manage your personal information</p>
          </div>

          {/* Main Profile Card */}
          <div className="card bg-base-200 shadow-2xl">
            <div className="card-body p-8">
              
              {/* Action Buttons */}
              <div className="flex justify-end mb-6">
                {!isEditing ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success"
                      onClick={updateProfile}
                      disabled={isSaving}
                    >
                      {isSaving && <span className="loading loading-spinner loading-sm mr-2"></span>}
                      Save Changes
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Profile Picture Section */}
                <div className="flex-shrink-0 text-center">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 mx-auto">
                      <img 
                        src={isEditing ? formData.profilePicture : user?.profilePicture} 
                        alt="Profile"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                        }}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
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
                  )}

                  {!isEditing && (
                    <div className="mt-4">
                      <h2 className="text-2xl font-bold text-base-content">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <div className="badge badge-primary mt-2 capitalize">
                        {user?.gender || "Not specified"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Information */}
                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">First Name</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <div className="p-3 bg-base-100 rounded-lg border">
                          {user?.firstName || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Last Name</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <div className="p-3 bg-base-100 rounded-lg border">
                          {user?.lastName || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="emailId"
                          value={formData.emailId}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <div className="p-3 bg-base-100 rounded-lg border">
                          {user?.emailId}
                        </div>
                      )}
                    </div>

                    {/* Age */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Age</span>
                      </label>
                      {isEditing ? (
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
                      ) : (
                        <div className="p-3 bg-base-100 rounded-lg border">
                          {user?.age || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Gender</span>
                      </label>
                      {isEditing ? (
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
                      ) : (
                        <div className="p-3 bg-base-100 rounded-lg border capitalize">
                          {user?.gender || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Member Since</span>
                      </label>
                      <div className="p-3 bg-base-100 rounded-lg border">
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-control mt-6">
                    <label className="label">
                      <span className="label-text font-semibold">About Me</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered h-24 w-full"
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    ) : (
                      <div className="p-3 bg-base-100 rounded-lg border min-h-[96px]">
                        {user?.desc || "No description provided"}
                      </div>
                    )}
                  </div>

                  {/* Hobbies */}
                  <div className="form-control mt-6">
                    <label className="label">
                      <span className="label-text font-semibold">Hobbies & Interests</span>
                    </label>
                    
                    {isEditing ? (
                      <div>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newHobby}
                            onChange={(e) => setNewHobby(e.target.value)}
                            className="input input-bordered flex-1"
                            placeholder="Add a hobby..."
                            onKeyPress={(e) => e.key === "Enter" && handleAddHobby()}
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
                            <div key={index} className="badge badge-primary gap-2 p-3">
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
                    ) : (
                      <div className="p-3 bg-base-100 rounded-lg border">
                        {user?.hobbies?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.hobbies.map((hobby, index) => (
                              <span key={index} className="badge badge-primary badge-outline">
                                {hobby}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-base-content/60">No hobbies added yet</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Curve>
  );
};

export default ProfilePage;

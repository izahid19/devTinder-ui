// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import * as Yup from "yup";
import Curve from "../components/RouteAnimation/Curve";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

// ✅ Import toaster helpers
import { successToaster, errorToaster } from "../components/Toaster";

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  emailId: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUpPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await SignUpSchema.validate(form, { abortEarly: false });

      const response = await axios.post(`${BASE_URL}/signup`, form, {
        withCredentials: true,
      });
      dispatch(addUser(response?.data?.data));

      // ✅ Show success toaster
      successToaster("Signup successful! Redirecting...", {
        onClose: () => navigate("/login"),
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        const formattedErrors = {};
        err.inner.forEach((e) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      } else if (err.response) {
        errorToaster(err.response.data.message || "Signup failed");
      } else {
        errorToaster("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Curve>
      <div className="flex justify-center items-center mt-10">
        <div className="w-96 min-h-[520px] rounded-2xl bg-neutral text-white shadow-2xl flex flex-col">
          <div className="p-6 flex flex-col gap-4 flex-grow">
            <h2 className="text-3xl font-bold text-center">Sign Up</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
              {/* First Name */}
              <fieldset className="flex flex-col">
                <label htmlFor="firstName" className="mb-1 font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input input-bordered text-black"
                  placeholder="Enter First Name"
                />
                {errors.firstName && (
                  <div className="text-red-400 text-sm mt-1">{errors.firstName}</div>
                )}
              </fieldset>

              {/* Last Name */}
              <fieldset className="flex flex-col">
                <label htmlFor="lastName" className="mb-1 font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input input-bordered text-black"
                  placeholder="Enter Last Name"
                />
                {errors.lastName && (
                  <div className="text-red-400 text-sm mt-1">{errors.lastName}</div>
                )}
              </fieldset>

              {/* Email */}
              <fieldset className="flex flex-col">
                <label htmlFor="emailId" className="mb-1 font-medium">
                  Email
                </label>
                <input
                  id="emailId"
                  name="emailId"
                  type="email"
                  value={form.emailId}
                  onChange={handleChange}
                  className="input input-bordered text-black"
                  placeholder="Enter Email"
                />
                {errors.emailId && (
                  <div className="text-red-400 text-sm mt-1">{errors.emailId}</div>
                )}
              </fieldset>

              {/* Password */}
              <fieldset className="flex flex-col">
                <label htmlFor="password" className="mb-1 font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input input-bordered text-black"
                  placeholder="Enter Password"
                />
                {errors.password && (
                  <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                )}
              </fieldset>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="btn w-32 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>

            <div className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="underline cursor-pointer hover:text-blue-300"
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </Curve>
  );
};

export default SignUpPage;

// src/pages/LoginPage.jsx
import React from "react";
import * as Yup from "yup";
import Curve from "../components/RouteAnimation/Curve";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

// ✅ Import toaster helpers
import { successToaster, errorToaster } from "../components/Toaster";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const [emailId, setEmailId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await LoginSchema.validate(
        { email: emailId, password },
        { abortEarly: false }
      );
      setErrors({});

      const response = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(response?.data?.data));

      // ✅ Show success toaster
      successToaster("Login Successfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      if (err.name === "ValidationError") {
        const formattedErrors = {};
        err.inner.forEach((e) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      } else if (err.response) {
        errorToaster(err.response.data.message || "Login failed");
      } else {
        errorToaster("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Curve>
      <div className="flex justify-center items-center mt-10 px-4">
        <div className="card w-96 bg-base-200 shadow-2xl rounded-2xl text-base-content">
          <div className="card-body">
            <h2 className="text-3xl font-bold text-center">Login</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              {/* Email */}
              <fieldset className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-base-content"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="text-error text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </fieldset>

              {/* Password */}
              <fieldset className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full bg-base-100 text-base-content"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <span className="text-error text-sm mt-1">
                    {errors.password}
                  </span>
                )}
              </fieldset>

              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-32"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            {/* ✅ Add Signup Link */}
            <div className="text-center mt-4 text-sm opacity-80">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="underline cursor-pointer hover:text-primary"
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    </Curve>
  );
};

export default LoginPage;

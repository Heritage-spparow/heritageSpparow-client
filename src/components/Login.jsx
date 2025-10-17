import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import logo from "../assets/login.png";
import { FcGoogle } from "react-icons/fc";
import favicon from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData);

      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }; 

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h2
        className="flex items-start flex-col justify-start  font-semibold
                       border-l-[5px] border-solid px-3 ml-[3%] text-white
                       text-lg sm:text-2xl tracking-wide "
     
      >
        <img
          src={favicon}
          alt="Logo"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain cursor-pointer transform scale-[2.5] origin-left"
        />
        <span className="whitespace-nowrap cursor-pointer" onClick={() => navigate("/")}>HERITAGE SPARROW</span>
      </h2>

      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="flex flex-col sm:flex-row bg-[#f9f6ef]  rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
          {/* Left Section (Form) */}
          <div className="flex flex-col justifiy-center mt-[4%] w-full sm:w-1/2 px-8 py-10 lg:px-14">
            <h2 className="text-2xl font-semibold border-l-[8px] border-solid px-[7px] text-[var(--color-bg)] mb-8">
              Welcome back
            </h2>

            <form className="space-y-5 mt-[13%]" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-bg)] mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#23423b] sm:text-sm ${
                      errors.email ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--color-bg)] mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#23423b] sm:text-sm ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-[var(--color-bg)]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[var(--color-bg)] border-gray-300 rounded focus:ring-[#23423b]"
                  />
                  <span className="ml-2">Remember Me</span>
                </label>
                <a href="#" className="text-[var(--color-bg)] hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-2.5 px-4 bg-[var(--color-bg)] text-[var(--color-white)] rounded-lg font-medium cursor-pointer transition duration-200"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[var(--color-bg)] hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
            <hr className="my-6 border-gray-300" />
            {/* Google Sign-In Button */}
            <button className="w-full py-2.5 px-4 bg-[var(--color-bg)] text-[var(--color-white)] rounded-lg font-medium cursor-pointer transition duration-200">
              Continue with <FcGoogle className="inline ml-2 mb-1" />
            </button>
          </div>

          {/* Right Section (Image) */}
          <div className="hidden flex items-center justify-center sm:block sm:w-1/2">
            <img
              src={logo}
              alt="Art collage"
              className="w-[75%] ml-5 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

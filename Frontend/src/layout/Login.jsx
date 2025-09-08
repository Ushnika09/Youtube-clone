import React, { useState } from "react";
import { AiFillYoutube, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheck } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;
      localStorage.setItem("jwtYT", token);
      localStorage.setItem("userYT", JSON.stringify(user));

      setIsSubmitted(true);
      setIsLoading(false);

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
          <div className="bg-red-600 py-6 px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AiFillYoutube className="text-3xl text-white" />
              <h1 className="text-2xl font-bold text-white">YouTube</h1>
            </div>
          </div>
          
          <div className="py-10 px-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineCheck className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Successful!</h3>
            <p className="text-gray-600 mb-6">Redirecting to your YouTube dashboard...</p>
            <div className="mt-8">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Continue
                <FiArrowRight className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
      >
        <FiArrowLeft className="text-lg" />
        Go Back
      </Link>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
        {/* Header */}
        <div className="bg-red-600 py-6 px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AiFillYoutube className="text-3xl text-white" />
            <h1 className="text-2xl font-bold text-white">YouTube</h1>
          </div>
          <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
          <p className="text-red-200 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {/* Form Container */}
        <div className="py-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </>
                ) : (
                  <>
                    <BiLogIn className="text-lg" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { API_BASE_URL } from '../services/apiClient';

const OtpVerification = ({
  email: initialEmail = "",
  mode = "reset",
  onVerificationSuccess,
}) => {
  const navigate = useNavigate();

  const isRegisterMode = mode === "register";
  const [step, setStep] = useState(isRegisterMode ? 2 : 1);
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/users/forgot-password`, { email });

      setMessage(response.data.message || "OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    if (!otp) return setError("Please enter the OTP");

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/users/verify-otp`, {
        email,
        otp,
      });

      setMessage(response.data.message || "Email verified successfully!");

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }

      if (onVerificationSuccess) {
        onVerificationSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter the OTP");

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/users/verify-reset-otp`, { email, otp });

      setMessage(response.data.message || "OTP verified successfully. Enter your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendRegisterOtp = async () => {
    if (!email) return setError("Please enter your email");

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/users/resend-otp`, { email });
      setMessage(response.data.message || "A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return setError("Please fill all fields");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_BASE_URL}/users/reset-password`, {
        email,
        otp,
        newPassword,
      });

      toast.success("Password updated successfully! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const title = isRegisterMode ? "Verify Email" : "Reset Password";

  return (
    <div className="max-w-md mx-auto my-12 p-6 border border-white/20 rounded-2xl bg-gray-900/60 text-white backdrop-blur-md">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>

      {error && (
        <div className="bg-red-900/40 border border-red-500 text-red-300 text-sm p-3 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-900/40 border border-green-500 text-green-300 text-sm p-3 rounded-xl mb-4 text-center">
          {message}
        </div>
      )}

      {isRegisterMode ? (
        <form onSubmit={handleRegisterVerifyOtp} className="flex flex-col gap-4">
          <p className="text-xs text-gray-300 text-center">
            Enter the 6-digit OTP sent to <span className="text-white font-semibold">{email}</span>
          </p>

          <input
            type="email"
            value={email}
            readOnly
            className="px-3 py-2 border border-white/20 rounded-xl bg-slate-950/40 text-white outline-none text-sm"
          />

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="px-3 py-2 text-center tracking-widest text-lg border border-white/20 rounded-xl bg-transparent text-white outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="h-10 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendRegisterOtp}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-white underline cursor-pointer disabled:opacity-50"
          >
            Resend OTP
          </button>
        </form>
      ) : (
        <>
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <p className="text-xs text-gray-300 text-center">
                Enter your email address and we will send you a verification OTP.
              </p>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-xl bg-transparent text-white outline-none focus:border-purple-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <p className="text-xs text-gray-300 text-center">
                Enter the 6-digit OTP sent to <span className="text-white font-semibold">{email}</span>
              </p>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="px-3 py-2 text-center tracking-widest text-lg border border-white/20 rounded-xl bg-transparent text-white outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Change Email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <p className="text-xs text-gray-300 text-center">Enter your new password below.</p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-xl bg-transparent text-white outline-none focus:border-purple-500 text-sm"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-xl bg-transparent text-white outline-none focus:border-purple-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default OtpVerification;
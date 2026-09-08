import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
const OTP_LENGTH = 6;
const TIMER_SECONDS = 60;

const OtpVerification = ({ email, onVerificationSuccess }) => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const inputRefs = useRef([]);

  // Derive canResend directly without extra state
  const canResend = timer === 0;

  // Fixed Timer Effect (Removed non-existent 'step' variable)
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Formik manages form submission state & validation
  const formik = useFormik({
    initialValues: { otpString: "" },
    validate: () => {
      const errors = {};
      const enteredOtp = otp.join("");
      if (enteredOtp.length !== OTP_LENGTH) {
        errors.otpString = `Please enter all ${OTP_LENGTH} digits`;
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      setApiMessage("");

      try {
        const response = await fetch("http://localhost:5000/api/users/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otp.join("") }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Verification failed");

        setApiMessage(data.message);
        if (onVerificationSuccess) onVerificationSuccess(data);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Native input navigation logic
  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    formik.setFieldValue("otpString", newOtp.join(""));

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, OTP_LENGTH).split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      newOtp[index] = digit;
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = digit;
      }
    });

    setOtp(newOtp);
    formik.setFieldValue("otpString", newOtp.join(""));
    const nextFocusIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = async () => {
    if (!canResend) return;

    setApiError("");
    setApiMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/users/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to resend OTP");

      setApiMessage(data.message);
      setTimer(TIMER_SECONDS); // Automatically sets canResend back to false
      setOtp(new Array(OTP_LENGTH).fill(""));
      formik.setFieldValue("otpString", "");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Email Verification</h2>
      <p>Enter the 6-digit code sent to <strong>{email}</strong></p>

      {apiError && <div style={styles.error}>{apiError}</div>}
      {apiMessage && <div style={styles.success}>{apiMessage}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div style={styles.otpContainer} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={styles.inputBox}
            />
          ))}
        </div>

        {formik.touched.otpString && formik.errors.otpString && (
          <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
            {formik.errors.otpString}
          </div>
        )}

        <button type="submit" disabled={formik.isSubmitting} style={styles.submitBtn}>
          {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div style={styles.resendContainer}>
        {canResend ? (
          <button onClick={handleResend} style={styles.resendBtn} disabled={formik.isSubmitting}>
            Resend OTP
          </button>
        ) : (
          <p style={styles.timerText}>
            Resend code in: <span>{timer}s</span>
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0",
  },
  inputBox: {
    width: "45px",
    height: "50px",
    fontSize: "20px",
    textAlign: "center",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  resendContainer: {
    marginTop: "20px",
  },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#007BFF",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  },
  timerText: {
    fontSize: "14px",
    color: "#666",
  },
  error: {
    color: "#D8000C",
    backgroundColor: "#FFBABA",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  success: {
    color: "#4F8A10",
    backgroundColor: "#DFF2BF",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
};

export default OtpVerification;
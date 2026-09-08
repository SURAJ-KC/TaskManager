import { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import OtpVerification from '../OtpVerification';

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (values.firstName.length > 15) {
    errors.firstName = '15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (values.lastName.length > 20) {
    errors.lastName = '20 characters or less';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phone) {
    errors.phone = 'Required';
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Must be 10 digits';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(values.password)) {
    errors.password = 'Must include letters, numbers & 6+ chars';
  }

  return errors;
};

const SignupPage = ({ onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [submittedUser, setSubmittedUser] = useState(null);
  const [apiError, setApiError] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError('');
      const payload = {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };

      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.message || 'Registration failed');
          return;
        }

        setSubmittedUser(values);
        setRegisteredEmail(values.email);
        setStep(2);
      } catch (error) {
        console.error('Submission error:', error);
        setApiError('Server error. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleVerificationSuccess = (data) => {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }

    if (onRegisterSuccess && submittedUser) {
      onRegisterSuccess(submittedUser);
    }

    navigate('/dashboard');
  };

  return (
    <div className="w-full">
      {step === 1 ? (
        <form
          className="w-full flex flex-col gap-3 text-white"
          onSubmit={formik.handleSubmit}
        >
          {apiError && (
            <div className="text-red-400 bg-red-900/40 border border-red-500/30 p-2.5 rounded-xl text-center text-xs">
              {apiError}
            </div>
          )}

          {/* First Name & Last Name (2 Columns on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-400 text-xs px-1 mt-1">{formik.errors.firstName}</div>
              )}
            </div>

            <div>
              <input
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-400 text-xs px-1 mt-1">{formik.errors.lastName}</div>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div>
            <input
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-400 text-xs px-1 mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <input
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number (10 digits)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-400 text-xs px-1 mt-1">{formik.errors.phone}</div>
            )}
          </div>

          {/* Password Input with Embedded Show/Hide Toggle */}
          <div>
            <div className="relative flex items-center">
              <input
                className="w-full px-3.5 py-2 pr-14 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-xs text-gray-400 hover:text-white transition select-none cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400 text-xs px-1 mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={formik.isSubmitting}
            className="w-full py-2.5 mt-2 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition cursor-pointer shadow-lg shadow-purple-500/20"
            type="submit"
          >
            {formik.isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
      ) : (
        <OtpVerification
          email={registeredEmail}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default SignupPage;
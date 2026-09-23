import { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Resolve environment variable or fallback to live Render URL
import {API_BASE_URL} from '../../services/apiClient';

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const SigninForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;

        if (!data.accessToken) {
          throw new Error('Login succeeded without an access token.');
        }

        localStorage.setItem('accessToken', data.accessToken);
        toast.success(`Welcome back, ${data.user?.username || 'User'}!`);

        resetForm();
        
        // Clean redirect to Dashboard
        navigate('/dashboard');

      } catch (error) {
        console.error('Submission error:', error);
        
        // Handle Axios HTTP error responses
        const errorMessage =
          error.response?.data?.message || error.message || 'Server error. Please ensure backend is running.';
        
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      className="w-full flex flex-col gap-3.5 text-white"
      onSubmit={formik.handleSubmit}
    >
      {/* Email Input */}
      <div>
        <input
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
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

      {/* Password Input with Embedded Show/Hide Toggle */}
      <div>
        <div className="relative flex items-center">
          <input
            className="w-full px-3.5 py-2.5 pr-14 rounded-xl text-sm border border-white/20 bg-slate-950/40 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition"
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
            className="absolute right-3.5 text-xs text-gray-400 hover:text-white transition select-none cursor-pointer"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-400 text-xs px-1 mt-1">{formik.errors.password}</div>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end px-1 -mt-1">
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer bg-transparent border-none"
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        disabled={formik.isSubmitting}
        className="w-full py-2.5 mt-1 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition cursor-pointer shadow-lg shadow-purple-500/20"
        type="submit"
      >
        {formik.isSubmitting ? 'Logging in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SigninForm;
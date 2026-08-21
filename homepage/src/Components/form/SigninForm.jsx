import { useFormik } from 'formik';
import { loginUser } from '../../Utils/auth';

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required : Email Address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required : Password';
  }

  return errors;
};

const SigninForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Login failed');
          return;
        }

        // 1. Save JWT token returned from backend
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          
          // 2. Dispatch event so other components (like RightLog) know token changed
          window.dispatchEvent(new Event("storage"));
        }

        alert('Login successful!');
        resetForm();
        
        // 3. Reload page or redirect so RightLog re-mounts and fetches contacts
        window.location.reload();

      } catch (error) {
        console.error('Submission error:', error);
        alert('Server error. Please ensure backend is running.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      className="flex flex-col px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
      onSubmit={formik.handleSubmit}
    >
      <input
        className="px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
        id="email"
        name="email"
        type="email"
        placeholder="Email ID"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-red-500 text-sm px-2">{formik.errors.email}</div>
      )}

      <input
        className="px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
        id="password"
        name="password"
        type="password"
        placeholder="Enter Password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password && (
        <div className="text-red-500 text-sm px-2">{formik.errors.password}</div>
      )}

      <button
        disabled={formik.isSubmitting}
        onClick={loginUser}
        className="h-8 m-2 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold disabled:opacity-50 cursor-pointer"
        type="submit"
      >
        {formik.isSubmitting ? 'Logging in...' : 'Submit'}
      </button>
    </form>
  );
};

export default SigninForm;
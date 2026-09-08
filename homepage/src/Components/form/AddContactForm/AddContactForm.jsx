import { useFormik } from 'formik';
import { getValidToken } from '../../../Utils/auth';

const validate = (values) => {
  const errors = {};

  if (!values.firstname) errors.firstname = 'Required : First Name';
  if (!values.lastname) errors.lastname = 'Required : Last Name';

  if (!values.email) {
    errors.email = 'Required : Email Address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phone) errors.phone = 'Required : Phone Number';

  return errors;
};

const AddContactForm = ({ onContactAdded }) => {
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
    },
    validate,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        const token = getValidToken();

        if (!token) {
          alert('Session expired. Please log in again.');
          return;
        }

        const response = await fetch('http://localhost:5000/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to add contact');
        }

        alert('Contact added successfully!');
        resetForm();

        // Callback to refresh the contact list in parent component / RightLog
        if (onContactAdded) {
          onContactAdded(data);
        }
      } catch (error) {
        console.error('Error adding contact:', error);
        setFieldError('email', error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Contact</h2>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        {/* Firstname & Lastname Row */}
        <div className="flex gap-2 flex-col ">
          <div className="flex-1 flex flex-col w-full">
            <input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="First Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstname}
              className="px-3 py-2 bg-black/30 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <span className="text-red-400 text-xs mt-1 pl-1">{formik.errors.firstname}</span>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Last Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastname}
              className="px-3 py-2 bg-black/30 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <span className="text-red-400 text-xs mt-1 pl-1">{formik.errors.lastname}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="px-3 py-2 bg-black/30 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-400 text-xs mt-1 pl-1">{formik.errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Phone Number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="px-3 py-2 bg-black/30 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
          />
          {formik.touched.phone && formik.errors.phone && (
            <span className="text-red-400 text-xs mt-1 pl-1">{formik.errors.phone}</span>
          )}
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-2 h-10 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {formik.isSubmitting ? 'Saving Contact...' : 'Add Contact'}
        </button>
      </form>
    </div>
  );
};

export default AddContactForm;
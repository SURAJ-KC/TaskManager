import React from 'react';
import { useFormik } from 'formik';

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required First Name';
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required : Last Name';
  } else if (values.lastName.length > 20) {
    errors.lastName = 'Must be 20 characters or less';
  }

  if (!values.email) {
    errors.email = 'Required : Email Address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phone) {
    errors.phone = 'Required : Phone Number';
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Phone Number must contain only  10 digits ';
  }

  if (!values.password) {
    errors.password = 'Required : Password';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(values.password)) {
    errors.password = 'Password must contain letters, numbers, and be at least 6 characters long';
  }

  return errors;
};

const AddContactForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
    validate,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const token = localStorage.getItem('accessToken');

        // Map payload keys to match backend expectations
        const payload = {
          firstname: values.firstName,
          lastname: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        };

        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Failed to save contact');
          return;
        }

        alert('Contact saved successfully!');
        resetForm();
      } catch (error) {
        console.error('Submission error:', error);
        alert('Server error. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form className="flex flex-col px-2 m-2 py-1 border border-white/20 rounded-xl text-white" onSubmit={formik.handleSubmit}>
      <input
        className="px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
        id="firstName"
        name="firstName"
        type="text"
        placeholder="First Name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div className="text-red-500 text-sm px-2">{formik.errors.firstName}</div>
      ) : null}

      <input
        className="px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
        id="lastName"
        name="lastName"
        type="text"
        placeholder="Last Name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div className="text-red-500 text-sm px-2">{formik.errors.lastName}</div>
      ) : null}

      <input
        className="px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
        id="email"
        name="email"
        type="email"
        placeholder="Email Address"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div className="text-red-500 text-sm px-2">{formik.errors.email}</div>
      ) : null}

      <input
        className="px-2 m-2 py-1 border border-white/20 rounded-xl text-white"
        id="phone"
        name="phone"
        type="tel"
        placeholder="Enter Phone Number"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.phone}
      />
      {formik.touched.phone && formik.errors.phone ? (
        <div className="text-red-500 text-sm px-2">{formik.errors.phone}</div>
      ) : null}

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
      {formik.touched.password && formik.errors.password ? (
        <div className="text-red-500 text-sm px-2">{formik.errors.password}</div>
      ) : null}

      <button
        disabled={formik.isSubmitting}
        className="h-8 m-2 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold disabled:opacity-50"
        type="submit"
      >
        {formik.isSubmitting ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
};

export default AddContactForm;
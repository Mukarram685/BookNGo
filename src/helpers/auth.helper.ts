import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  cnic: Yup.string()
    .matches(/^[0-9]{5}[-\/]?[0-9]{7}[-\/]?[0-9]{1}$/, 'Invalid CNIC format (e.g. 12345-1234567-1)')
    .required('CNIC is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Phone number must be 10 or 11 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const forgotPasswordEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'Verification code must be 6 digits')
    .required('Verification code is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

export const feedbackSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  description: Yup.string()
    .min(10, 'Feedback must be at least 10 characters')
    .required('Feedback description is required'),
});


import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const formatCNIC = (text: string): string => {
  const cleaned = (text || '').replace(/\D/g, '').slice(0, 13);
  if (cleaned.length > 12) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
  } else if (cleaned.length > 5) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return cleaned;
};

export const cleanPhoneNumber = (text: string): string => {
  let cleaned = (text || '').replace(/\D/g, '');
  if (cleaned.startsWith('92') && cleaned.length > 10) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned.slice(0, 10);
};

export const signupSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  cnic: Yup.string()
    .matches(/^[0-9]{5}[-\/]?[0-9]{7}[-\/]?[0-9]{1}$/, 'Invalid CNIC format (e.g. 12345-1234567-1)')
    .required('CNIC is required'),
  phoneNumber: Yup.string()
    .matches(/^3[0-9]{9}$/, 'Phone number must be 10 digits starting with 3 (e.g. 3001234567)')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const forgotPasswordEmailSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, 'Verification code must be 6 digits')
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
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  description: Yup.string()
    .trim()
    .min(10, 'Feedback must be at least 10 characters')
    .required('Feedback description is required'),
});

export const companyRegistrationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .required('Company name is required'),
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Company email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .required('Address is required'),
});


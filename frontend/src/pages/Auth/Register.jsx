import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, reset } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker', // Changed to lowercase
    phone: '',
    companyName: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'recruiter' && !formData.companyName) {
      toast.error('Company name is required for recruiters');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const result = await dispatch(register(registerData)).unwrap();
      
      // Reset any previous error states
      dispatch(reset());
      
      toast.success('Registration successful!');
      
      if (formData.role === 'recruiter') {
        toast.info('Your account is pending admin approval');
      }
      
      // Force navigation with small delay to ensure state updates
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our job portal today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              I am a
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
                className={`p-4 border-2 rounded-lg transition ${
                  formData.role === 'jobseeker'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <p className="font-semibold" style={{ color: '#1f2937' }}>Job Seeker</p>
                <p className="text-sm" style={{ color: '#4b5563' }}>Looking for jobs</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                className={`p-4 border-2 rounded-lg transition ${
                  formData.role === 'recruiter'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <p className="font-semibold" style={{ color: '#1f2937' }}>Recruiter</p>
                <p className="text-sm" style={{ color: '#4b5563' }}>Hiring talent</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            {/* Company Name (if recruiter) */}
            {formData.role === 'recruiter' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Company Name
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    placeholder="Acme Inc."
                    required={formData.role === 'recruiter'}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: '#4b5563' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
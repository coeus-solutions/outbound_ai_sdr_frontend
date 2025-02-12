import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { motion } from 'framer-motion';
import { Footer } from '../shared/Footer';
import { verifyInviteToken, setupInvitePassword } from '../../services/auth';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';

export function InviteSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        showToast('Invalid or missing invite token', 'error');
        navigate('/login');
        return;
      }

      try {
        const response = await verifyInviteToken(token);
        setFormData(prev => ({
          ...prev,
          email: response.email
        }));
      } catch (error) {
        console.error('Error verifying invite token:', error);
        showToast(error instanceof Error ? error.message : 'Invalid invite token', 'error');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token, navigate, showToast]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await setupInvitePassword(token, formData.password);
      showToast(response.message || 'Account setup completed successfully', 'success');
      
      // Navigate to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error setting up password:', error);
      showToast(error instanceof Error ? error.message : 'Failed to set up password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Verifying invite token</h2>
              <p className="mt-2 text-sm text-gray-600">Please wait while we verify your invite...</p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
          <Link to="/">
            <motion.div 
              className="flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span 
                className="text-3xl font-bold relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 rounded-lg blur-lg"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <span className="relative bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span>
                <span className="relative bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
              </motion.span>
            </motion.div>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <AuthLayout title="Complete your account setup">
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-500">
                  You've been invited to join the team. Please set up your account to get started.
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                    disabled
                  />
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                        errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Setting up account...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              </div>
            </form>
          </AuthLayout>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
import React, { useState } from 'react';
import { Camera, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft, Check, Star, Heart } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
// Login Page Component
function LoginPage({ formData, handleInputChange, showPassword, setShowPassword, handleLogin, setCurrentPage }) {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BookMyShoot
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600 mb-8">Sign in to your account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-purple-600 hover:text-purple-500">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Sign in
            </button>

            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setCurrentPage('userType')}
                className="text-purple-600 hover:text-purple-500 font-semibold"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="text-blue-600 font-bold mr-2">G</span>
                Google
              </button>
              <button className="w-full inline-flex justify-center py-3 px-4 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="text-blue-800 font-bold mr-2">f</span>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative h-full flex flex-col justify-center px-12 xl:px-16 text-white">
          <h3 className="text-4xl font-bold mb-6">Capture Every Moment</h3>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join thousands of photographers, videographers, and clients who trust BookMyShoot for their creative needs.
          </p>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-purple-100 mb-4">
              "BookMyShoot made finding the perfect photographer for our wedding so easy. The platform is intuitive and the professionals are top-notch!"
            </p>
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b630?w=40&h=40&fit=crop&crop=face"
                alt="Client"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">Priya & Arjun</p>
                <p className="text-sm text-purple-200">Wedding Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Type Selection Component
function UserTypeSelection({ userType, setUserType, setCurrentPage }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BookMyShoot
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Join BookMyShoot</h2>
          <p className="text-xl text-gray-600">Choose how you'd like to get started</p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Client Card */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer border-4 ${
              userType === 'client' ? 'border-purple-500' : 'border-transparent'
            }`}
            onClick={() => setUserType('users')}
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I need a photographer/videographer</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Looking for professional photographers or videographers for your events, weddings, or special occasions.
              </p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Browse verified professionals
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Compare portfolios & pricing
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Secure booking system
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Leave reviews & ratings
                </li>
              </ul>
              {userType === 'client' && (
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
                  Selected
                </div>
              )}
            </div>
          </div>

          {/* Professional Card */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer border-4 ${
              userType === 'professional' ? 'border-purple-500' : 'border-transparent'
            }`}
            onClick={() => setUserType('professional')}
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a photographer/videographer</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Showcase your work, connect with clients, and grow your photography or videography business.
              </p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Create professional profile
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Showcase your portfolio
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Manage bookings easily
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  Build your reputation
                </li>
              </ul>
              {userType === 'professional' && (
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
                  Selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center space-y-4">
          <button
            onClick={() => userType && setCurrentPage('signup')}
            disabled={!userType}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              userType
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with {userType === 'client' ? 'Client' : userType === 'professional' ? 'Professional' : 'Selection'}
          </button>

          <div>
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => setCurrentPage('login')}
              className="text-purple-600 hover:text-purple-500 font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Signup Page Component
function SignupPage({ formData, handleInputChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, userType, setCurrentPage }) {
  const specialties = [
    'Wedding Photography',
    'Event Photography',
    'Corporate Photography',
    'Fashion Photography',
    'Portrait Photography',
    'Product Photography',
    'Wedding Videography',
    'Event Videography',
    'Corporate Videos',
    'Fashion Films'
  ];

  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await axios.post(`${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_URL}/api/v1/photographers/register`, formData);
    console.log("Signup Response:", res.data);
  };

  const testimonials = [
    {
      name: "Sneha Sharma",
      role: "Bride",
      content: "Found the perfect wedding photographer through BookMyShoot. The booking process was seamless!",
      rating: 5
    },
    {
      name: "Rahul Photography",
      role: "Professional Photographer",
      content: "This platform helped me connect with amazing clients and grow my business significantly.",
      rating: 5
    },
    {
      name: "Tech Corp Events",
      role: "Corporate Client",
      content: "Reliable professionals, transparent pricing, and excellent service quality every time.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative h-full flex flex-col justify-center px-12 xl:px-16 text-white">
          <button
            onClick={() => setCurrentPage('userType')}
            className="absolute top-8 left-8 flex items-center text-white hover:text-purple-200 transition-colors"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          <h3 className="text-4xl font-bold mb-6">
            {userType === 'professional' ? 'Grow Your Business' : 'Find Amazing Talent'}
          </h3>
          <p className="text-xl text-purple-100 mb-12 leading-relaxed">
            {userType === 'professional'
              ? 'Join our community of verified professionals and start getting more bookings today.'
              : 'Connect with top-rated photographers and videographers for all your needs.'
            }
          </p>

          {/* Testimonials Carousel */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-purple-100 mb-4 text-sm">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-800 text-sm font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-purple-200">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Back Button */}
          <button
            onClick={() => setCurrentPage('userType')}
            className="lg:hidden flex items-center text-gray-600 hover:text-gray-800 mb-6"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BookMyShoot
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your {userType} account
            </h2>
            <p className="text-gray-600">Join our community and get started today</p>
          </div>

          <form className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="">Select your city</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                  <option value="kolkata">Kolkata</option>
                </select>
              </div>
            </div>

            {/* Professional-specific fields */}
            {userType === 'professional' && (
              <>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Specialty
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select your specialty</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </>
            )}

            {/* Password fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeTerms" className="ml-3 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Create {userType} account
            </button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="text-purple-600 hover:text-purple-500 font-semibold"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function AuthPages() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'signup', 'userType'
  const [userType, setUserType] = useState(''); // 'client', 'professional'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    specialty: '',
    experience: '',
    agreeTerms: false
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Login Data:", formData);
      const response = await axios.post(
        `${import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_SERVER_URL}/api/v1/${userType === 'client' ? 'users' : 'photographers'}/login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
            withCredentials: true
        }
      );

      const data = response.data;
      console.log("Login Info", data);

      if (!response.status || response.status >= 400) {
        throw new Error(data.message || "Login failed");
      }

      if(data.success===true){
         Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
      });

      navigate("/")
    }

      // Handle successful login (e.g., store tokens, redirect)
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage
          formData={formData}
          handleInputChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleLogin={handleLogin}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'userType' && (
        <UserTypeSelection
          userType={userType}
          setUserType={setUserType}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          formData={formData}
          handleInputChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          userType={userType}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

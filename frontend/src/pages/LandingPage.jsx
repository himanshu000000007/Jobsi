import { Link } from 'react-router-dom';
import { FiBriefcase, FiSearch, FiUsers, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <FiBriefcase className="text-blue-600" size={28} />
              <span className="text-xl font-bold text-gray-900">JobPortal</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Find Your Dream Job <br />
          <span className="text-blue-600">or Your Next Great Hire</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          JobPortal connects talented professionals with top companies. Whether you're
          looking for a job or looking to hire, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
          >
            Get Started — It's Free
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FiSearch className="text-blue-600 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Browse Jobs</h3>
            <p className="text-gray-600">
              Thousands of job listings from top companies across all industries.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FiCheckCircle className="text-green-500 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">ATS Resume Checker</h3>
            <p className="text-gray-600">
              Optimize your resume to pass Applicant Tracking Systems and land more interviews.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FiUsers className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">For Recruiters</h3>
            <p className="text-gray-600">
              Post jobs and find the best candidates quickly with our smart matching tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to take the next step?
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Join thousands of job seekers and recruiters already on JobPortal.
        </p>
        <Link
          to="/register"
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
        >
          Create Your Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
import { useSelector } from 'react-redux';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import ResumeBuilder from '../components/Resume/ResumeBuilder';

const ResumePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* ✅ FIX BUG 2: Added Sidebar for consistent navigation */}
      <div className="flex">
        <Sidebar role={user?.role} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <ResumeBuilder />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumePage;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveResume, updateResume } from '../../redux/slices/resumeSlice';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import ResumeTemplates from './ResumeTemplates';
import Button from '../Common/Button';
import { FiSave, FiDownload, FiEye } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';

const ResumeBuilder = ({ existingResume = null }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.resume);
  
  const [activeTab, setActiveTab] = useState('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState(
    existingResume || {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        summary: '',
      },
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      projects: [],
    }
  );

  const handleDataChange = (section, data) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...resumeData,
        template: selectedTemplate,
      };

      if (existingResume?._id) {
        await dispatch(updateResume({ id: existingResume._id, data: payload })).unwrap();
      } else {
        await dispatch(saveResume(payload)).unwrap();
      }
      
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSave}
              loading={loading}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <FiSave size={18} />
              <span>Save Resume</span>
            </Button>
            <Button
              onClick={handleDownload}
              variant="success"
              className="flex items-center space-x-2"
            >
              <FiDownload size={18} />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-4 mt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === 'edit'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === 'template'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-4 font-medium transition flex items-center space-x-2 ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiEye size={18} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div>
          {activeTab === 'edit' && (
            <ResumeForm
              resumeData={resumeData}
              onDataChange={handleDataChange}
            />
          )}
          
          {activeTab === 'template' && (
            <ResumeTemplates
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          )}
          
          {activeTab === 'preview' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Full Preview</h2>
              <p className="text-gray-600">
                The preview is shown on the right side. You can download it as PDF using the button above.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="sticky top-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ResumePreview
                data={resumeData}
                template={selectedTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
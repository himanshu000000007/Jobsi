import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeResume } from '../../redux/slices/resumeSlice';
import Button from '../Common/Button';
import ATSResult from './ATSResult';
import { FiUpload, FiFileText } from 'react-icons/fi';

const ATSChecker = () => {
  const dispatch = useDispatch();
  const { atsResult, loading } = useSelector((state) => state.resume);
  
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please upload a resume');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      await dispatch(analyzeResume(formData)).unwrap();
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('Failed to analyze resume. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ATS Resume Checker</h1>
        <p className="text-gray-600 mb-6">
          Upload your resume to see how it performs against Applicant Tracking Systems (ATS)
        </p>

        {/* File Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition ${
            dragActive
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-center space-x-3">
              <FiFileText size={32} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <FiUpload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 mb-2">
                Drag and drop your resume here, or
              </p>
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  browse files
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </>
          )}
        </div>

        {/* Job Description (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description (Optional)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get keyword matching insights..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="6"
          />
          <p className="text-xs text-gray-500 mt-2">
            Adding a job description helps identify missing keywords and improves matching accuracy
          </p>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          loading={loading}
          disabled={!file}
          className="w-full"
          size="lg"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </div>

      {/* Results */}
      {atsResult && <ATSResult result={atsResult} />}

      {/* Info Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">What is ATS?</h3>
        <p className="text-blue-800 text-sm mb-4">
          Applicant Tracking Systems (ATS) are software applications that help employers manage the recruitment process. 
          They scan and rank resumes based on keywords, formatting, and other criteria before a human recruiter sees them.
        </p>
        <h3 className="font-semibold text-blue-900 mb-2">How to improve your ATS score:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use standard section headings (Experience, Education, Skills)</li>
          <li>• Include relevant keywords from the job description</li>
          <li>• Avoid complex formatting, tables, and graphics</li>
          <li>• Use a simple, clean font</li>
          <li>• Save as PDF or Word document</li>
          <li>• Include contact information in a standard format</li>
        </ul>
      </div>
    </div>
  );
};

export default ATSChecker;
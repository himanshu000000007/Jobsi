import React from 'react';
import KeywordAnalyzer from './KeywordAnalyzer';
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const ATSResult = ({ result }) => {
  const { score, issues, suggestions, keywords, contactInfo, sections } = result;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(score)} mb-4`}>
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ATS Compatibility Score
          </h2>
          <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Formatting</p>
            <p className="text-2xl font-bold text-gray-900">
              {result.formatting?.score || 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Keywords</p>
            <p className="text-2xl font-bold text-gray-900">
              {result.keywords?.matchPercentage || 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Sections</p>
            <p className="text-2xl font-bold text-gray-900">
              {sections?.found || 0}/{sections?.total || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Issues */}
      {issues && issues.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            Issues Found
          </h3>
          <ul className="space-y-3">
            {issues.map((issue, index) => (
              <li key={index} className="flex items-start space-x-3">
                <FiXCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-900 font-medium">{issue.title}</p>
                  <p className="text-gray-600 text-sm">{issue.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiCheckCircle className="text-green-500 mr-2" />
            Suggestions for Improvement
          </h3>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-3">
                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-900 font-medium">{suggestion.title}</p>
                  <p className="text-gray-600 text-sm">{suggestion.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyword Analysis */}
      {keywords && (
        <KeywordAnalyzer keywords={keywords} />
      )}

      {/* Contact Information */}
      {contactInfo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information Detected
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactInfo.email && (
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500" />
                <span className="text-gray-700">Email: {contactInfo.email}</span>
              </div>
            )}
            {contactInfo.phone && (
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500" />
                <span className="text-gray-700">Phone: {contactInfo.phone}</span>
              </div>
            )}
            {contactInfo.linkedin && (
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500" />
                <span className="text-gray-700">LinkedIn Found</span>
              </div>
            )}
            {contactInfo.location && (
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-green-500" />
                <span className="text-gray-700">Location: {contactInfo.location}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sections Found */}
      {sections && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Resume Sections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sections.detected?.map((section, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg"
              >
                <FiCheckCircle size={16} />
                <span className="text-sm font-medium">{section}</span>
              </div>
            ))}
            {sections.missing?.map((section, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg"
              >
                <FiXCircle size={16} />
                <span className="text-sm font-medium">{section}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSResult;
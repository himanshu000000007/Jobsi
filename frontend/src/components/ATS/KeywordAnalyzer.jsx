import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const KeywordAnalyzer = ({ keywords }) => {
  const [activeTab, setActiveTab] = useState('matched');

  const { matched = [], missing = [], suggested = [], matchPercentage = 0 } = keywords;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Keyword Analysis</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Match Rate</p>
          <p className="text-2xl font-bold text-blue-600">{matchPercentage}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('matched')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'matched'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Matched ({matched.length})
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'missing'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Missing ({missing.length})
        </button>
        <button
          onClick={() => setActiveTab('suggested')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'suggested'
              ? 'border-b-2 border-yellow-600 text-yellow-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suggested ({suggested.length})
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {activeTab === 'matched' && (
          <div>
            {matched.length > 0 ? (
              <>
                <div className="mb-4 flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <FiCheckCircle size={20} />
                  <p className="text-sm font-medium">
                    Great! Your resume contains these important keywords
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matched.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      <FiCheckCircle size={14} />
                      <span>{keyword}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiAlertCircle size={48} className="mx-auto mb-3 text-gray-400" />
                <p>No job description provided or no keywords matched</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'missing' && (
          <div>
            {missing.length > 0 ? (
              <>
                <div className="mb-4 flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-lg">
                  <FiXCircle size={20} />
                  <p className="text-sm font-medium">
                    Consider adding these keywords from the job description
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missing.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      <FiXCircle size={14} />
                      <span>{keyword}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiCheckCircle size={48} className="mx-auto mb-3 text-green-400" />
                <p>No missing keywords - Your resume covers all key terms!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggested' && (
          <div>
            {suggested.length > 0 ? (
              <>
                <div className="mb-4 flex items-center space-x-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                  <FiAlertCircle size={20} />
                  <p className="text-sm font-medium">
                    These related keywords could strengthen your resume
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggested.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                    >
                      <FiAlertCircle size={14} />
                      <span>{keyword}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No additional suggestions at this time</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Keyword Optimization Tips</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Use exact keywords from the job description when relevant</li>
          <li>• Include both acronyms and full terms (e.g., "SEO" and "Search Engine Optimization")</li>
          <li>• Place important keywords in your summary, skills, and experience sections</li>
          <li>• Use keywords naturally - avoid keyword stuffing</li>
          <li>• Include industry-specific terminology and technical skills</li>
        </ul>
      </div>
    </div>
  );
};

export default KeywordAnalyzer;
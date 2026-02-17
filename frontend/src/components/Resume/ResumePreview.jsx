import React from 'react';
import { format } from 'date-fns';

const ResumePreview = ({ data, template }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  // Modern Template
  const ModernTemplate = () => (
    <div id="resume-preview" className="bg-white p-8 text-sm">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <div className="flex flex-wrap gap-4 text-blue-600 mt-2">
            {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin}>{data.personalInfo.linkedin}</a>}
            {data.personalInfo.portfolio && <span>• <a href={data.personalInfo.portfolio}>{data.personalInfo.portfolio}</a></span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-700 italic mb-2">{exp.company || 'Company Name'}</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-gray-700 italic">{edu.institution || 'Institution'}</p>
              <p className="text-gray-700">
                {edu.field}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Skills
          </h2>
          {data.skills.map((skill, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold text-gray-900">{skill.category}: </span>
              <span className="text-gray-700">{skill.items.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Classic Template
  const ClassicTemplate = () => (
    <div id="resume-preview" className="bg-white p-8 text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600 space-x-2">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.portfolio) && (
          <div className="text-gray-600 mt-1 space-x-2">
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.portfolio && <span>| {data.personalInfo.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">
            Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-700 italic mb-2">{exp.company || 'Company Name'}</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
                <span className="text-gray-600 text-xs">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-gray-700 italic">{edu.institution || 'Institution'}</p>
              <p className="text-gray-700">
                {edu.field}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">
            Skills
          </h2>
          {data.skills.map((skill, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold text-gray-900">{skill.category}: </span>
              <span className="text-gray-700">{skill.items.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Creative Template
  const CreativeTemplate = () => (
    <div id="resume-preview" className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="space-y-1 text-blue-100">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
          {data.personalInfo.portfolio && <p>{data.personalInfo.portfolio}</p>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-blue-600 mb-3">About Me</h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                <span className="text-gray-600 text-xs bg-blue-100 px-2 py-1 rounded">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-purple-600 font-medium mb-2">{exp.company || 'Company Name'}</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
                <span className="text-gray-600 text-xs bg-purple-100 px-2 py-1 rounded">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-purple-600 font-medium">{edu.institution || 'Institution'}</p>
              <p className="text-gray-700">
                {edu.field}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Skills</h2>
          {data.skills.map((skill, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <h3 className="font-semibold text-purple-600 mb-1">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render template based on selection
  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      case 'modern':
      default:
        return <ModernTemplate />;
    }
  };

  return <div className="scale-75 origin-top">{renderTemplate()}</div>;
};

export default ResumePreview;
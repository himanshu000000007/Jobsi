import React from 'react';
import InputField from '../Common/InputField';
import Button from '../Common/Button';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const ResumeForm = ({ resumeData, onDataChange }) => {
  const handlePersonalInfoChange = (field, value) => {
    onDataChange('personalInfo', {
      ...resumeData.personalInfo,
      [field]: value,
    });
  };

  const handleArrayItemChange = (section, index, field, value) => {
    const updatedArray = [...resumeData[section]];
    updatedArray[index] = {
      ...updatedArray[index],
      [field]: value,
    };
    onDataChange(section, updatedArray);
  };

  const addArrayItem = (section, template) => {
    onDataChange(section, [...resumeData[section], template]);
  };

  const removeArrayItem = (section, index) => {
    onDataChange(
      section,
      resumeData[section].filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            name="fullName"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            required
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            required
          />
          <InputField
            label="Phone"
            type="tel"
            name="phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
          />
          <InputField
            label="Location"
            name="location"
            value={resumeData.personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
          />
          <InputField
            label="LinkedIn"
            name="linkedin"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
          />
          <InputField
            label="Portfolio/Website"
            name="portfolio"
            value={resumeData.personalInfo.portfolio}
            onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
          </label>
          <textarea
            value={resumeData.personalInfo.summary}
            onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Brief overview of your professional background and goals..."
          />
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <Button
            onClick={() =>
              addArrayItem('experience', {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
              })
            }
            size="sm"
            className="flex items-center space-x-2"
          >
            <FiPlus size={16} />
            <span>Add Experience</span>
          </Button>
        </div>

        {resumeData.experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeArrayItem('experience', index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Company"
                value={exp.company}
                onChange={(e) =>
                  handleArrayItemChange('experience', index, 'company', e.target.value)
                }
              />
              <InputField
                label="Position"
                value={exp.position}
                onChange={(e) =>
                  handleArrayItemChange('experience', index, 'position', e.target.value)
                }
              />
              <InputField
                label="Start Date"
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  handleArrayItemChange('experience', index, 'startDate', e.target.value)
                }
              />
              <InputField
                label="End Date"
                type="month"
                value={exp.endDate}
                onChange={(e) =>
                  handleArrayItemChange('experience', index, 'endDate', e.target.value)
                }
                disabled={exp.current}
              />
            </div>
            <div className="mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    handleArrayItemChange('experience', index, 'current', e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Currently working here</span>
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) =>
                  handleArrayItemChange('experience', index, 'description', e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <Button
            onClick={() =>
              addArrayItem('education', {
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
              })
            }
            size="sm"
            className="flex items-center space-x-2"
          >
            <FiPlus size={16} />
            <span>Add Education</span>
          </Button>
        </div>

        {resumeData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeArrayItem('education', index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Institution"
                value={edu.institution}
                onChange={(e) =>
                  handleArrayItemChange('education', index, 'institution', e.target.value)
                }
              />
              <InputField
                label="Degree"
                value={edu.degree}
                onChange={(e) =>
                  handleArrayItemChange('education', index, 'degree', e.target.value)
                }
              />
              <InputField
                label="Field of Study"
                value={edu.field}
                onChange={(e) =>
                  handleArrayItemChange('education', index, 'field', e.target.value)
                }
              />
              <InputField
                label="GPA (optional)"
                value={edu.gpa}
                onChange={(e) =>
                  handleArrayItemChange('education', index, 'gpa', e.target.value)
                }
              />
              <InputField
                label="Start Date"
                type="month"
                value={edu.startDate}
                onChange={(e) =>
                  handleArrayItemChange('education', index, 'startDate', e.target.value)
                }
              />
              <InputField
                label="End Date"
                type="month"
                value={edu.endDate}
                onChange={(e) =>
                  handleArrayItemChange('education', index, 'endDate', e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          <Button
            onClick={() =>
              addArrayItem('skills', {
                category: '',
                items: [],
              })
            }
            size="sm"
            className="flex items-center space-x-2"
          >
            <FiPlus size={16} />
            <span>Add Skill Category</span>
          </Button>
        </div>

        {resumeData.skills.map((skill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeArrayItem('skills', index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
            <InputField
              label="Category (e.g., Programming Languages, Tools)"
              value={skill.category}
              onChange={(e) =>
                handleArrayItemChange('skills', index, 'category', e.target.value)
              }
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skill.items.join(', ')}
                onChange={(e) =>
                  handleArrayItemChange(
                    'skills',
                    index,
                    'items',
                    e.target.value.split(',').map((item) => item.trim())
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JavaScript, React, Node.js, etc."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeForm;
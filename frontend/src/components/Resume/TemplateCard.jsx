import React from 'react';
import { FiCheck } from 'react-icons/fi';

const TemplateCard = ({ template, isSelected, onSelect }) => {
  const colorClasses = {
    blue: 'border-blue-600 bg-blue-50',
    gray: 'border-gray-600 bg-gray-50',
    purple: 'border-purple-600 bg-purple-50',
  };

  return (
    <div
      onClick={onSelect}
      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? colorClasses[template.color]
          : 'border-gray-200 hover:border-gray-400 bg-white'
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1">
          <FiCheck size={16} />
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Template Preview */}
        <div className="flex-shrink-0 w-24 h-32 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-xs text-center px-2">
            {template.name} Template Preview
          </span>
        </div>

        {/* Template Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>

          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                template.color === 'blue'
                  ? 'bg-blue-600'
                  : template.color === 'gray'
                  ? 'bg-gray-600'
                  : 'bg-purple-600'
              }`}
            ></span>
            <span className="text-xs text-gray-500 capitalize">
              {template.color} Theme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
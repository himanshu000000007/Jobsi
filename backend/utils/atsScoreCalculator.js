// ATS Score Calculator
// This utility analyzes resume text against job descriptions

// Common technical skills and keywords
const TECHNICAL_KEYWORDS = [
  'javascript', 'python', 'java', 'c++', 'react', 'angular', 'vue',
  'node.js', 'express', 'django', 'flask', 'spring', 'mongodb', 'sql',
  'postgresql', 'mysql', 'aws', 'azure', 'docker', 'kubernetes',
  'git', 'agile', 'scrum', 'rest', 'api', 'microservices', 'ci/cd',
  'html', 'css', 'typescript', 'redux', 'graphql', 'webpack',
];

// Extract keywords from text
exports.extractKeywords = (text) => {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const words = lowerText.match(/\b\w+\b/g) || [];
  
  // Get unique words with more than 3 characters
  const uniqueWords = [...new Set(words)].filter(word => word.length > 3);
  
  // Combine with technical keywords found
  const technicalFound = TECHNICAL_KEYWORDS.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
  
  return [...new Set([...uniqueWords.slice(0, 50), ...technicalFound])];
};

// Calculate keyword match percentage
const calculateKeywordMatch = (resumeText, jobDescription) => {
  const resumeKeywords = exports.extractKeywords(resumeText);
  const jobKeywords = exports.extractKeywords(jobDescription);
  
  const matchedKeywords = [];
  const missingKeywords = [];
  
  jobKeywords.forEach(keyword => {
    const isMatched = resumeKeywords.some(rk => 
      rk.toLowerCase() === keyword.toLowerCase()
    );
    
    if (isMatched) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  const matchPercentage = jobKeywords.length > 0
    ? (matchedKeywords.length / jobKeywords.length) * 100
    : 0;
  
  return {
    matchedKeywords,
    missingKeywords,
    matchPercentage,
  };
};

// Calculate skills match
const calculateSkillsMatch = (resumeText, jobDescription) => {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  const technicalSkillsInJob = TECHNICAL_KEYWORDS.filter(skill =>
    jobLower.includes(skill)
  );
  
  if (technicalSkillsInJob.length === 0) return 100;
  
  const matchedSkills = technicalSkillsInJob.filter(skill =>
    resumeLower.includes(skill)
  );
  
  return (matchedSkills.length / technicalSkillsInJob.length) * 100;
};

// Calculate experience match
const calculateExperienceMatch = (resumeText, jobDescription) => {
  const jobExpRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi;
  const jobExpMatch = jobDescription.match(jobExpRegex);
  
  if (!jobExpMatch) return 100;
  
  const requiredYears = parseInt(jobExpMatch[0].match(/\d+/)[0]);
  
  // Look for experience mentions in resume
  const resumeExpRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi;
  const resumeExpMatches = resumeText.match(resumeExpRegex);
  
  if (!resumeExpMatches) return 50;
  
  const maxResumeYears = Math.max(...resumeExpMatches.map(match =>
    parseInt(match.match(/\d+/)[0])
  ));
  
  if (maxResumeYears >= requiredYears) return 100;
  if (maxResumeYears >= requiredYears * 0.7) return 80;
  if (maxResumeYears >= requiredYears * 0.5) return 60;
  
  return 40;
};

// Calculate education match
const calculateEducationMatch = (resumeText, jobDescription) => {
  const educationKeywords = [
    'bachelor', 'master', 'phd', 'doctorate', 'degree',
    'b.tech', 'm.tech', 'b.sc', 'm.sc', 'mba', 'graduate'
  ];
  
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  const jobRequiresEducation = educationKeywords.some(keyword =>
    jobLower.includes(keyword)
  );
  
  if (!jobRequiresEducation) return 100;
  
  const resumeHasEducation = educationKeywords.some(keyword =>
    resumeLower.includes(keyword)
  );
  
  return resumeHasEducation ? 100 : 50;
};

// Calculate format score
const calculateFormatScore = (resumeText) => {
  let score = 100;
  
  // Check for basic sections
  const hasContact = /email|phone|linkedin|github/i.test(resumeText);
  const hasExperience = /experience|work|employment|position/i.test(resumeText);
  const hasEducation = /education|degree|university|college/i.test(resumeText);
  const hasSkills = /skills|technologies|tools/i.test(resumeText);
  
  if (!hasContact) score -= 20;
  if (!hasExperience) score -= 25;
  if (!hasEducation) score -= 25;
  if (!hasSkills) score -= 30;
  
  return Math.max(0, score);
};

// Generate suggestions based on analysis
const generateSuggestions = (analysis) => {
  const suggestions = [];
  
  if (analysis.skillsMatch < 70) {
    suggestions.push(
      `Add more relevant technical skills. Missing skills: ${analysis.missingKeywords.slice(0, 5).join(', ')}`
    );
  }
  
  if (analysis.keywordMatch < 60) {
    suggestions.push(
      'Increase keyword match by incorporating more job-specific terminology from the job description.'
    );
  }
  
  if (analysis.experienceMatch < 80) {
    suggestions.push(
      'Highlight your relevant work experience more prominently. Use quantifiable achievements.'
    );
  }
  
  if (analysis.educationMatch < 80) {
    suggestions.push(
      'Ensure your educational qualifications are clearly mentioned and match the job requirements.'
    );
  }
  
  if (analysis.formatScore < 80) {
    suggestions.push(
      'Improve resume structure. Include clear sections for Contact, Experience, Education, and Skills.'
    );
  }
  
  if (suggestions.length === 0) {
    suggestions.push(
      'Great job! Your resume matches well with the job description. Consider tailoring specific achievements to the role.'
    );
  }
  
  return suggestions;
};

// Main analysis function
exports.analyzeResume = (resumeText, jobDescription) => {
  const keywordAnalysis = calculateKeywordMatch(resumeText, jobDescription);
  const skillsMatch = calculateSkillsMatch(resumeText, jobDescription);
  const experienceMatch = calculateExperienceMatch(resumeText, jobDescription);
  const educationMatch = calculateEducationMatch(resumeText, jobDescription);
  const formatScore = calculateFormatScore(resumeText);
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    keywordAnalysis.matchPercentage * 0.3 +
    skillsMatch * 0.3 +
    experienceMatch * 0.2 +
    educationMatch * 0.1 +
    formatScore * 0.1
  );
  
  const analysis = {
    score: Math.min(100, Math.max(0, overallScore)),
    matchedKeywords: keywordAnalysis.matchedKeywords,
    missingKeywords: keywordAnalysis.missingKeywords,
    skillsMatch: Math.round(skillsMatch),
    experienceMatch: Math.round(experienceMatch),
    educationMatch: Math.round(educationMatch),
    formatScore: Math.round(formatScore),
    keywordMatch: Math.round(keywordAnalysis.matchPercentage),
  };
  
  analysis.suggestions = generateSuggestions(analysis);
  
  return analysis;
};

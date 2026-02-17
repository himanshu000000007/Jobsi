// ATS Utility Functions

/**
 * Calculate ATS compatibility score based on various factors
 */
export const calculateATSScore = (resumeData) => {
  let score = 0;
  const weights = {
    formatting: 30,
    keywords: 40,
    sections: 20,
    contact: 10,
  };

  // Formatting score
  const formattingScore = calculateFormattingScore(resumeData);
  score += (formattingScore / 100) * weights.formatting;

  // Keywords score
  const keywordsScore = calculateKeywordsScore(resumeData);
  score += (keywordsScore / 100) * weights.keywords;

  // Sections score
  const sectionsScore = calculateSectionsScore(resumeData);
  score += (sectionsScore / 100) * weights.sections;

  // Contact info score
  const contactScore = calculateContactScore(resumeData);
  score += (contactScore / 100) * weights.contact;

  return Math.round(score);
};

/**
 * Calculate formatting score
 */
const calculateFormattingScore = (resumeData) => {
  let score = 100;
  
  // Deduct points for complex formatting
  if (resumeData.hasImages) score -= 20;
  if (resumeData.hasTables) score -= 15;
  if (resumeData.hasMultipleColumns) score -= 15;
  if (resumeData.hasUnusualFonts) score -= 10;
  
  return Math.max(0, score);
};

/**
 * Calculate keywords matching score
 */
const calculateKeywordsScore = (resumeData) => {
  if (!resumeData.jobDescription) return 50; // Neutral score if no job description
  
  const resumeKeywords = extractKeywords(resumeData.content);
  const jobKeywords = extractKeywords(resumeData.jobDescription);
  
  if (jobKeywords.length === 0) return 50;
  
  const matchedKeywords = resumeKeywords.filter((keyword) =>
    jobKeywords.includes(keyword)
  );
  
  return Math.round((matchedKeywords.length / jobKeywords.length) * 100);
};

/**
 * Calculate sections completeness score
 */
const calculateSectionsScore = (resumeData) => {
  const requiredSections = [
    'experience',
    'education',
    'skills',
    'summary',
  ];
  
  const foundSections = requiredSections.filter((section) =>
    resumeData.sections?.includes(section)
  );
  
  return Math.round((foundSections.length / requiredSections.length) * 100);
};

/**
 * Calculate contact information completeness score
 */
const calculateContactScore = (resumeData) => {
  const requiredFields = ['email', 'phone', 'name'];
  const optionalFields = ['linkedin', 'portfolio', 'location'];
  
  let score = 0;
  
  // Required fields (70 points)
  const foundRequired = requiredFields.filter(
    (field) => resumeData.contact?.[field]
  );
  score += (foundRequired.length / requiredFields.length) * 70;
  
  // Optional fields (30 points)
  const foundOptional = optionalFields.filter(
    (field) => resumeData.contact?.[field]
  );
  score += (foundOptional.length / optionalFields.length) * 30;
  
  return Math.round(score);
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text) => {
  if (!text) return [];
  
  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Common words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  ]);
  
  // Split into words and filter
  const words = cleanText
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
  
  // Count word frequency
  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Return unique words sorted by frequency
  return Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);
};

/**
 * Find missing keywords
 */
export const findMissingKeywords = (resumeText, jobDescription) => {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jobKeywords = extractKeywords(jobDescription);
  
  return jobKeywords.filter((keyword) => !resumeKeywords.has(keyword));
};

/**
 * Find matched keywords
 */
export const findMatchedKeywords = (resumeText, jobDescription) => {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jobKeywords = extractKeywords(jobDescription);
  
  return jobKeywords.filter((keyword) => resumeKeywords.has(keyword));
};

/**
 * Generate ATS optimization suggestions
 */
export const generateSuggestions = (analysisResult) => {
  const suggestions = [];
  
  if (analysisResult.score < 80) {
    if (analysisResult.formatting?.score < 70) {
      suggestions.push({
        title: 'Simplify Formatting',
        description: 'Remove complex tables, images, or multi-column layouts that ATS systems may not parse correctly.',
      });
    }
    
    if (analysisResult.keywords?.matchPercentage < 60) {
      suggestions.push({
        title: 'Add Relevant Keywords',
        description: 'Include more keywords from the job description throughout your resume, especially in your skills and experience sections.',
      });
    }
    
    if (analysisResult.sections?.found < 4) {
      suggestions.push({
        title: 'Add Missing Sections',
        description: 'Ensure your resume includes all standard sections: Summary, Experience, Education, and Skills.',
      });
    }
    
    if (!analysisResult.contact?.email || !analysisResult.contact?.phone) {
      suggestions.push({
        title: 'Complete Contact Information',
        description: 'Make sure to include your email address and phone number at the top of your resume.',
      });
    }
  }
  
  return suggestions;
};

/**
 * Detect resume sections
 */
export const detectSections = (text) => {
  const sectionPatterns = {
    experience: /\b(experience|work history|employment|professional experience)\b/i,
    education: /\b(education|academic|qualifications|degrees)\b/i,
    skills: /\b(skills|competencies|expertise|proficiencies)\b/i,
    summary: /\b(summary|objective|profile|about)\b/i,
    certifications: /\b(certifications|certificates|licenses)\b/i,
    projects: /\b(projects|portfolio)\b/i,
  };
  
  const detected = [];
  
  for (const [section, pattern] of Object.entries(sectionPatterns)) {
    if (pattern.test(text)) {
      detected.push(section);
    }
  }
  
  return detected;
};

/**
 * Extract contact information from text
 */
export const extractContactInfo = (text) => {
  const contact = {};
  
  // Email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailPattern);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }
  
  // Phone pattern (various formats)
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phonePattern);
  if (phoneMatch) {
    contact.phone = phoneMatch[0];
  }
  
  // LinkedIn pattern
  const linkedinPattern = /linkedin\.com\/in\/[\w-]+/i;
  const linkedinMatch = text.match(linkedinPattern);
  if (linkedinMatch) {
    contact.linkedin = linkedinMatch[0];
  }
  
  return contact;
};

/**
 * Calculate keyword match percentage
 */
export const calculateKeywordMatch = (resumeText, jobDescription) => {
  const matched = findMatchedKeywords(resumeText, jobDescription);
  const jobKeywords = extractKeywords(jobDescription);
  
  if (jobKeywords.length === 0) return 0;
  
  return Math.round((matched.length / jobKeywords.length) * 100);
};
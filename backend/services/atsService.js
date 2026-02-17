// Backend ATS Service - Analyzes resumes for ATS compatibility
// Place this file in: backend/src/services/atsService.js

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');

/**
 * Main ATS Analysis Service
 */
class ATSService {
  /**
   * Analyze resume for ATS compatibility
   * @param {Buffer} fileBuffer - Resume file buffer
   * @param {String} fileType - File MIME type
   * @param {String} jobDescription - Optional job description for keyword matching
   * @returns {Object} Analysis results
   */
  async analyzeResume(fileBuffer, fileType, jobDescription = '') {
    try {
      // Extract text from resume
      const resumeText = await this.extractText(fileBuffer, fileType);

      // Perform various analyses
      const formattingScore = this.analyzeFormatting(resumeText);
      const keywordAnalysis = this.analyzeKeywords(resumeText, jobDescription);
      const sectionsAnalysis = this.analyzeSections(resumeText);
      const contactInfo = this.extractContactInfo(resumeText);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore({
        formattingScore,
        keywordAnalysis,
        sectionsAnalysis,
        contactInfo,
      });

      // Generate issues and suggestions
      const issues = this.generateIssues({
        formattingScore,
        keywordAnalysis,
        sectionsAnalysis,
        contactInfo,
      });

      const suggestions = this.generateSuggestions({
        formattingScore,
        keywordAnalysis,
        sectionsAnalysis,
        contactInfo,
      });

      return {
        score: overallScore,
        formatting: formattingScore,
        keywords: keywordAnalysis,
        sections: sectionsAnalysis,
        contactInfo,
        issues,
        suggestions,
        resumeText: resumeText.substring(0, 500), // Preview
      };
    } catch (error) {
      console.error('ATS Analysis Error:', error);
      throw new Error('Failed to analyze resume: ' + error.message);
    }
  }

  /**
   * Extract text from PDF or DOCX file
   */
  async extractText(fileBuffer, fileType) {
    try {
      if (fileType === 'application/pdf') {
        const data = await pdfParse(fileBuffer);
        return data.text;
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      throw new Error('Failed to extract text from resume: ' + error.message);
    }
  }

  /**
   * Analyze resume formatting
   */
  analyzeFormatting(text) {
    let score = 100;
    const issues = [];

    // Check for excessive special characters (indicates complex formatting)
    const specialCharCount = (text.match(/[│┤├┬┴┼╔╗╚╝═║]/g) || []).length;
    if (specialCharCount > 20) {
      score -= 20;
      issues.push('Complex table formatting detected');
    }

    // Check for unusual spacing
    const excessiveSpaces = (text.match(/\s{5,}/g) || []).length;
    if (excessiveSpaces > 10) {
      score -= 15;
      issues.push('Excessive spacing detected');
    }

    // Check for very short lines (might indicate columns)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const shortLines = lines.filter(line => line.length < 30);
    if (shortLines.length > lines.length * 0.5) {
      score -= 15;
      issues.push('Multi-column layout detected');
    }

    // Check text length
    if (text.length < 500) {
      score -= 20;
      issues.push('Resume appears too short');
    }

    return {
      score: Math.max(0, score),
      issues,
    };
  }

  /**
   * Analyze keywords and match with job description
   */
  analyzeKeywords(resumeText, jobDescription) {
    const resumeKeywords = this.extractKeywords(resumeText);
    
    if (!jobDescription) {
      return {
        matched: [],
        missing: [],
        suggested: this.getSuggestedKeywords(resumeKeywords),
        matchPercentage: 0,
      };
    }

    const jobKeywords = this.extractKeywords(jobDescription);
    
    // Find matched and missing keywords
    const matched = jobKeywords.filter(keyword => 
      resumeKeywords.some(rk => rk.toLowerCase() === keyword.toLowerCase())
    );
    
    const missing = jobKeywords.filter(keyword => 
      !resumeKeywords.some(rk => rk.toLowerCase() === keyword.toLowerCase())
    );

    // Calculate match percentage
    const matchPercentage = jobKeywords.length > 0 
      ? Math.round((matched.length / jobKeywords.length) * 100)
      : 0;

    return {
      matched: matched.slice(0, 20),
      missing: missing.slice(0, 20),
      suggested: this.getSuggestedKeywords(resumeKeywords).slice(0, 10),
      matchPercentage,
    };
  }

  /**
   * Extract important keywords from text
   */
  extractKeywords(text) {
    // Common stop words to exclude
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which',
      'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
      'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
      'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'work',
      'worked', 'working', 'experience', 'experiences', 'using', 'used'
    ]);

    // Clean and tokenize text
    const cleanText = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanText.split(' ');
    
    // Count word frequency
    const wordFreq = {};
    words.forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Extract multi-word phrases (bigrams and trigrams)
    const phrases = this.extractPhrases(text);
    
    // Combine and sort by frequency
    const allKeywords = [
      ...Object.keys(wordFreq),
      ...phrases
    ];

    // Use TF-IDF approach to identify important keywords
    return [...new Set(allKeywords)]
      .filter(kw => kw.length > 2)
      .slice(0, 50);
  }

  /**
   * Extract common multi-word phrases
   */
  extractPhrases(text) {
    const phrases = [];
    const tokenizer = new natural.WordTokenizer();
    const tfidf = new natural.TfIdf();
    
    tfidf.addDocument(text);
    
    // Common technical and professional phrases
    const commonPhrases = [
      'project management', 'data analysis', 'machine learning',
      'web development', 'software engineering', 'customer service',
      'team leadership', 'business development', 'problem solving',
      'communication skills', 'time management', 'critical thinking',
      'react native', 'node.js', 'front end', 'back end', 'full stack',
      'agile methodology', 'scrum master', 'product owner',
      'continuous integration', 'test driven development',
      'object oriented programming', 'database management',
      'cloud computing', 'artificial intelligence', 'deep learning',
      'natural language processing', 'computer vision',
      'search engine optimization', 'digital marketing',
      'financial analysis', 'risk management', 'quality assurance'
    ];

    const lowerText = text.toLowerCase();
    commonPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        phrases.push(phrase);
      }
    });

    return phrases;
  }

  /**
   * Get suggested keywords based on resume content
   */
  getSuggestedKeywords(resumeKeywords) {
    // Industry-specific keyword suggestions
    const techKeywords = ['javascript', 'python', 'java', 'react', 'node'];
    const skillKeywords = ['leadership', 'communication', 'analytical', 'teamwork'];
    
    const suggestions = [];
    
    // Suggest related technical skills
    if (resumeKeywords.some(k => techKeywords.includes(k.toLowerCase()))) {
      suggestions.push('TypeScript', 'REST API', 'Git', 'Docker', 'AWS');
    }
    
    // Suggest soft skills
    if (resumeKeywords.length > 10) {
      suggestions.push(...skillKeywords.filter(k => 
        !resumeKeywords.some(rk => rk.toLowerCase() === k)
      ));
    }

    return suggestions;
  }

  /**
   * Analyze resume sections
   */
  analyzeSections(text) {
    const standardSections = {
      experience: /\b(experience|work history|employment|professional experience|work experience)\b/i,
      education: /\b(education|academic|qualifications|degrees|academic background)\b/i,
      skills: /\b(skills|technical skills|competencies|expertise|proficiencies|core competencies)\b/i,
      summary: /\b(summary|objective|profile|professional summary|career objective|about me)\b/i,
      certifications: /\b(certifications|certificates|licenses|credentials)\b/i,
      projects: /\b(projects|portfolio|key projects)\b/i,
    };

    const detected = [];
    const missing = [];

    Object.entries(standardSections).forEach(([section, pattern]) => {
      if (pattern.test(text)) {
        detected.push(section);
      } else {
        missing.push(section);
      }
    });

    // Required sections
    const required = ['experience', 'education', 'skills', 'summary'];
    const foundRequired = detected.filter(s => required.includes(s));

    return {
      detected,
      missing,
      found: detected.length,
      total: Object.keys(standardSections).length,
      requiredFound: foundRequired.length,
      requiredTotal: required.length,
    };
  }

  /**
   * Extract contact information
   */
  extractContactInfo(text) {
    const contact = {};

    // Email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = text.match(emailRegex);
    if (emailMatch) {
      contact.email = emailMatch[0];
    }

    // Phone (various formats)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) {
      contact.phone = phoneMatch[0];
    }

    // LinkedIn
    const linkedinRegex = /(linkedin\.com\/in\/[\w-]+|linkedin\.com\/pub\/[\w-]+\/[\w]+\/[\w]+\/[\w]+)/i;
    const linkedinMatch = text.match(linkedinRegex);
    if (linkedinMatch) {
      contact.linkedin = linkedinMatch[0];
    }

    // GitHub
    const githubRegex = /github\.com\/[\w-]+/i;
    const githubMatch = text.match(githubRegex);
    if (githubMatch) {
      contact.github = githubMatch[0];
    }

    // Location (city, state)
    const locationRegex = /([A-Z][a-z]+,\s*[A-Z]{2})/;
    const locationMatch = text.match(locationRegex);
    if (locationMatch) {
      contact.location = locationMatch[0];
    }

    return contact;
  }

  /**
   * Calculate overall ATS score
   */
  calculateOverallScore({ formattingScore, keywordAnalysis, sectionsAnalysis, contactInfo }) {
    const weights = {
      formatting: 0.25,
      keywords: 0.40,
      sections: 0.25,
      contact: 0.10,
    };

    let score = 0;

    // Formatting score
    score += formattingScore.score * weights.formatting;

    // Keywords score
    const keywordScore = keywordAnalysis.matchPercentage || 50; // Default to 50 if no job description
    score += keywordScore * weights.keywords;

    // Sections score
    const sectionScore = (sectionsAnalysis.requiredFound / sectionsAnalysis.requiredTotal) * 100;
    score += sectionScore * weights.sections;

    // Contact info score
    const requiredContact = ['email', 'phone'];
    const foundContact = requiredContact.filter(field => contactInfo[field]);
    const contactScore = (foundContact.length / requiredContact.length) * 100;
    score += contactScore * weights.contact;

    return Math.round(score);
  }

  /**
   * Generate list of issues
   */
  generateIssues({ formattingScore, keywordAnalysis, sectionsAnalysis, contactInfo }) {
    const issues = [];

    // Formatting issues
    if (formattingScore.issues.length > 0) {
      formattingScore.issues.forEach(issue => {
        issues.push({
          title: 'Formatting Issue',
          description: issue,
        });
      });
    }

    // Section issues
    const requiredSections = ['experience', 'education', 'skills', 'summary'];
    const missingSections = requiredSections.filter(s => !sectionsAnalysis.detected.includes(s));
    if (missingSections.length > 0) {
      issues.push({
        title: 'Missing Required Sections',
        description: `Add the following sections: ${missingSections.join(', ')}`,
      });
    }

    // Contact info issues
    if (!contactInfo.email) {
      issues.push({
        title: 'Missing Email Address',
        description: 'Include your email address at the top of your resume',
      });
    }
    if (!contactInfo.phone) {
      issues.push({
        title: 'Missing Phone Number',
        description: 'Include your phone number in the contact section',
      });
    }

    // Keyword issues
    if (keywordAnalysis.matchPercentage > 0 && keywordAnalysis.matchPercentage < 40) {
      issues.push({
        title: 'Low Keyword Match',
        description: 'Your resume has low keyword match with the job description. Consider adding more relevant keywords.',
      });
    }

    return issues;
  }

  /**
   * Generate improvement suggestions
   */
  generateSuggestions({ formattingScore, keywordAnalysis, sectionsAnalysis, contactInfo }) {
    const suggestions = [];

    // Formatting suggestions
    if (formattingScore.score < 80) {
      suggestions.push({
        title: 'Simplify Formatting',
        description: 'Use a simple, single-column layout without tables or complex graphics. ATS systems parse plain text better.',
      });
    }

    // Keyword suggestions
    if (keywordAnalysis.missing.length > 0) {
      suggestions.push({
        title: 'Add Missing Keywords',
        description: `Consider incorporating these keywords: ${keywordAnalysis.missing.slice(0, 5).join(', ')}`,
      });
    }

    // Section suggestions
    if (sectionsAnalysis.found < 4) {
      suggestions.push({
        title: 'Add Standard Sections',
        description: 'Include all standard resume sections: Summary, Experience, Education, and Skills',
      });
    }

    // Contact suggestions
    if (!contactInfo.linkedin) {
      suggestions.push({
        title: 'Add LinkedIn Profile',
        description: 'Including your LinkedIn URL can improve your professional presence',
      });
    }

    // General suggestions
    if (formattingScore.score >= 80 && keywordAnalysis.matchPercentage >= 70) {
      suggestions.push({
        title: 'Excellent Work!',
        description: 'Your resume is well-optimized for ATS. Consider customizing it further for specific job applications.',
      });
    }

    return suggestions;
  }

  /**
   * Get keyword suggestions based on job description
   */
  async getKeywordSuggestions(jobDescription) {
    const keywords = this.extractKeywords(jobDescription);
    const phrases = this.extractPhrases(jobDescription);
    
    return {
      keywords: keywords.slice(0, 20),
      phrases: phrases.slice(0, 10),
      categories: this.categorizeKeywords(keywords),
    };
  }

  /**
   * Categorize keywords into skill types
   */
  categorizeKeywords(keywords) {
    const categories = {
      technical: [],
      soft: [],
      tools: [],
      certifications: [],
    };

    const technicalTerms = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css', 'api'];
    const softSkills = ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical'];
    const tools = ['git', 'docker', 'jenkins', 'jira', 'aws', 'azure', 'kubernetes'];
    const certifications = ['aws certified', 'pmp', 'scrum master', 'cissp', 'cpa'];

    keywords.forEach(keyword => {
      const lower = keyword.toLowerCase();
      if (technicalTerms.some(term => lower.includes(term))) {
        categories.technical.push(keyword);
      } else if (softSkills.some(skill => lower.includes(skill))) {
        categories.soft.push(keyword);
      } else if (tools.some(tool => lower.includes(tool))) {
        categories.tools.push(keyword);
      } else if (certifications.some(cert => lower.includes(cert))) {
        categories.certifications.push(keyword);
      }
    });

    return categories;
  }
}

module.exports = new ATSService();
// config/worqhat.js

const axios = require('axios');

/**
 * CRITICAL FUNCTION: This is an updated, more robust template.
 * Your task is to look at the REAL API response in the console
 * and adjust the logic inside the 'try' block below to match it.
 */
const parseWorqHatResponse = (apiResponse) => {
  // We log the real response here so you can inspect its structure in the terminal.
  console.log("Raw API Response from WorqHat:", apiResponse.data);
  
  const formattedQuestions = [];
  const rawData = apiResponse.data;

  try {
    // --- YOUR MODIFICATIONS WILL GO IN THIS 'try' BLOCK ---

    // STEP 1: Check if the response is already a structured JSON object.
    // This is the ideal scenario.
    if (rawData && typeof rawData === 'object' && rawData.questions && Array.isArray(rawData.questions)) {
      console.log("Attempting to parse the response as a JSON object...");
      let idCounter = 1;
      // You might need to change the property names like 'item.question_text' to match the real response.
      for (const item of rawData.questions) {
        formattedQuestions.push({
          questionId: idCounter++,
          questionText: item.question_text || "Missing question",
          options: item.options || [],
          correctAnswer: item.correct_answer || ""
        });
      }
    }
    // STEP 2: If not JSON, check if it's a block of text that needs parsing.
    else if (rawData && typeof rawData.content === 'string') {
      console.log("Attempting to parse the response as a block of text...");
      const textBlock = rawData.content;
      // This regular expression is designed to find questions like "1. Question text"
      // followed by options like "- Option A", "- Option B*", etc.
      const questionRegex = /^\d+\.\s*(.*?)\n((?: {2,4}-\s*.*?(?:\*|)\n?)+)/gm;
      let match;
      let idCounter = 1;

      while ((match = questionRegex.exec(textBlock)) !== null) {
        const questionText = match[1].trim();
        const optionsBlock = match[2];

        const optionRegex = /-\s*(.*?)(?:\s*\*|)(\n|$)/g;
        let optionMatch;
        const options = [];
        let correctAnswer = "";

        while ((optionMatch = optionRegex.exec(optionsBlock)) !== null) {
          const optionText = optionMatch[1].trim();
          options.push(optionText);
          // Check if the original option string contained a '*' to mark it as correct
          if (optionMatch[0].includes('*')) {
            correctAnswer = optionText;
          }
        }
        
        if (questionText && options.length > 0 && correctAnswer) {
          formattedQuestions.push({
            questionId: idCounter++,
            questionText,
            options,
            correctAnswer
          });
        }
      }
    }

    // STEP 3: Final check. If we still have no questions, something went wrong.
    if (formattedQuestions.length === 0) {
      throw new Error("Parsing failed. The API response structure was not recognized or was empty.");
    }

  } catch (parseError) {
    console.error("Could not parse the API response:", parseError.message);
    // Return an empty array so the application doesn't crash.
    return [];
  }

  return formattedQuestions;
};


// --- NO CHANGES NEEDED BELOW THIS LINE ---

const generateQuizFromWorqHat = async (topic) => {
  try {
    const prompt = `Generate a 5-question multiple-choice quiz on the topic of "${topic}". For each question, provide 3 options. Mark the correct answer with an asterisk (*). The output should be a clean, easily parsable format.`;

    const response = await axios.post(
      'https://api.worqhat.com/api/ai/content/v2',
      { question: prompt },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WORQHAT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const questions = parseWorqHatResponse(response);
    
    return { questions };

  } catch (error) {
    console.error('Error fetching quiz from WorqHat API:', error.response ? error.response.data : error.message);
    return { questions: [] };
  }
};

module.exports = { generateQuizFromWorqHat };
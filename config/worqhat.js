
const axios = require('axios');


const WORQHAT_API_URL = 'https://api.worqhat.com/api/ai/v1/generate'; // Our first candidate




const parseWorqHatResponse = (apiResponse) => {
    console.log("Raw API Response from WorqHat:", apiResponse.data);
    const formattedQuestions = [];
    // ... (rest of the parsing function is the same as before)
    const rawData = apiResponse.data;
    try {
      if (rawData && typeof rawData === 'object' && rawData.questions && Array.isArray(rawData.questions)) {
        let idCounter = 1;
        for (const item of rawData.questions) { formattedQuestions.push({ questionId: idCounter++, questionText: item.question_text || "Missing question", options: item.options || [], correctAnswer: item.correct_answer || "" }); }
      } else if (rawData && typeof rawData.content === 'string') {
        const textBlock = rawData.content;
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
            if (optionMatch[0].includes('*')) { correctAnswer = optionText; }
          }
          if (questionText && options.length > 0 && correctAnswer) { formattedQuestions.push({ questionId: idCounter++, questionText, options, correctAnswer }); }
        }
      }
      if (formattedQuestions.length === 0) { throw new Error("Parsing failed. The API response structure was not recognized or was empty."); }
    } catch (parseError) {
      console.error("Could not parse the API response:", parseError.message);
      return [];
    }
    return formattedQuestions;
};


const generateQuizFromWorqHat = async (topic) => {
  try {
    const prompt = `Generate a 5-question multiple-choice quiz on the topic of "${topic}". For each question, provide 3 options. Mark the correct answer with an asterisk (*). The output should be a clean, easily parsable JSON format with a root key of "questions".`;

    // IMPORTANT: The request BODY has also been updated to a more standard format.
    const requestBody = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        // You might need to add a model name here, e.g., "model": "worqhat-llm-v1"
        // For now, we will try without it.
    };

    const response = await axios.post(
      WORQHAT_API_URL, // Using the variable from the top of the file
      requestBody,     // Using the new request body
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
    console.error(`Error fetching from ${WORQHAT_API_URL}:`, error.response ? error.response.data : error.message);
    return { questions: [] };
  }
};

module.exports = { generateQuizFromWorqHat };
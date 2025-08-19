
const axios = require('axios');


const WORQHAT_WORKFLOW_URL = "https://api.worqhat.com/flows/trigger/8aed1f4a-fb77-4788-bca8-c9906045fb61";



const transformWorkflowResponse = (workflowData) => {
  const transformedQuestions = workflowData.map((item, index) => {
    return {
      questionId: index + 1,
      questionText: item.question,
      options: item["options[]"],
      correctAnswer: item.answer,
    };
  });
  return { questions: transformedQuestions };
};


const generateQuizFromWorqHat = async (topic) => {
  try {
    console.log(`Sending topic "${topic}" to Worqhat Workflow...`);
    const requestBody = { topic: topic };
    const response = await axios.post(
      WORQHAT_WORKFLOW_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WORQHAT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log("Raw API Response from Workflow:", response.data.data.data.q);

    if (response.data && Array.isArray(response.data.data.data.q)) {
      console.log("SUCCESS: Real quiz data received! Transforming it for our app...");
      return transformWorkflowResponse(response.data.data.data.q);
    } else {
      console.error("Workflow response was successful, but data format is incorrect. Response:", response.data);
      return { questions: [] };
    }

  } catch (error) {
    console.error('Error triggering Worqhat Workflow.', error.response ? error.response.data : error.message);
    return { questions: [] };
  }
};

module.exports = { generateQuizFromWorqHat };
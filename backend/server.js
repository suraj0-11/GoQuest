const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to handle requests from the frontend and pass them to Gemini AI
app.post('/api/chat', async (req, res) => {
  const userInput = req.body.input;

  try {
    // Make the API request to Gemini AI with your API key and correct URL
    const geminiResponse = await axios.post(
      'https://aiplatform.googleapis.com/v1/projects/aerial-prism-436016-k4/locations/global/endpoints/:predict', // Replace with the correct URL
      {
        instances: [{ content: userInput }], // Example payload for some AI services, adapt based on the API docs
      },
      {
        headers: {
          'Authorization': `Bearer AIzaSyCRZb8fF-UVcyKP9OkrLeUufwm9NyNx9E0`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the relevant response data from Gemini AI
    const aiResponse = geminiResponse.data; // Adjust this to fit the response structure from Gemini AI

    // Send back the response to the frontend
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error with Gemini AI request:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Something went wrong with the Gemini AI request' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import React, { useState } from 'react';
import { Moon, Sun, Send } from 'lucide-react';
import axios from 'axios';

export default function TripPlanner() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { input: chatInput });
      console.log('Response from server:', response.data);
      const aiResponse = response.data.response;
      setChatResponse(aiResponse);
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        setError(`Server error: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
      setChatResponse('');
    } finally {
      setIsLoading(false);
    }

    setChatInput('');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Your Next Journey, Optimized 🚀</h1>
        <p className="text-lg sm:text-xl mb-8">
          Build, personalize, and optimize your itineraries with our free AI trip planner.
        </p>

        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Trip Planner AI Chat is now available 🎉</h2>
        </div>
        <div className="mt-16 max-w-2xl mx-auto">
          <form onSubmit={handleChatSubmit} className="flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className={`flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'
              }`}
              aria-label="Chat input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-teal-500 text-white rounded-r-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Send message"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : <Send className="w-5 h-5" />}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 border rounded-md bg-red-100 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {chatResponse && (
            <div className="mt-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800">
              <p>{chatResponse}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            We'd love to hear your suggestions for improvement. Click to share any feedback.
          </p>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Bot, Plus, Save, Eye, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import chatgptService from '../services/chatgptService';
import contentService from '../services/contentService';

const ContentDashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentType, setContentType] = useState('service'); // 'service' or 'producer'
  const [savedContent, setSavedContent] = useState([]);

  // Load saved content on component mount
  useEffect(() => {
    const allContent = [
      ...contentService.getServices(),
      ...contentService.getProducers()
    ];
    setSavedContent(allContent);
  }, []);

  // Generate content using ChatGPT service
  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await chatgptService.generateContent(prompt, contentType);
      setGeneratedContent(response);
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to demo content
      const fallbackResponse = {
        title: `Generated ${contentType === 'service' ? 'Service' : 'Producer'} Title`,
        description: `This is a detailed description generated for: ${prompt}`,
        blogContent: `# Blog Post: ${prompt}\n\nThis is a comprehensive blog post about ${prompt}. It covers various aspects including best practices, challenges, and solutions in the agricultural sector.\n\n## Key Points:\n- Point 1: Important information\n- Point 2: Additional details\n- Point 3: Practical applications\n\n## Conclusion\nThis content provides valuable insights for our agricultural community.`,
        tags: ['agriculture', 'farming', 'sustainability'],
        category: contentType === 'service' ? 'Agricultural Services' : 'Producer Profile'
      };
      setGeneratedContent(fallbackResponse);
    }
    
    setIsGenerating(false);
  };

  const saveContent = () => {
    if (generatedContent) {
      let newContent;
      
      if (contentType === 'service') {
        newContent = contentService.addServiceContent(generatedContent);
      } else {
        newContent = contentService.addProducerContent(generatedContent);
      }
      
      // Update local state
      setSavedContent([...savedContent, newContent]);
      setGeneratedContent(null);
      setPrompt('');
    }
  };

  const deleteContent = (id) => {
    contentService.deleteContent(id);
    setSavedContent(savedContent.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Dashboard</h1>
          <p className="text-gray-600">Generate and manage content for your Agriculture website using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Generation Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Bot className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">AI Content Generator</h2>
            </div>

            {/* Content Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="service">Service Content</option>
                <option value="producer">Producer Content</option>
              </select>
            </div>

            {/* Prompt Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you want to create
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Sustainable farming techniques for small farmers' or 'Organic vegetable producer profile'"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </button>

            {/* Generated Content Preview */}
            {generatedContent && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">Generated Content:</h3>
                <div className="space-y-3">
                  <div>
                    <strong>Title:</strong> {generatedContent.title}
                  </div>
                  <div>
                    <strong>Description:</strong> {generatedContent.description}
                  </div>
                  <div>
                    <strong>Category:</strong> {generatedContent.category}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={saveContent}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Content
                  </button>
                  <button
                    onClick={() => setGeneratedContent(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Content Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Saved Content</h2>
              <span className="text-sm text-gray-500">{savedContent.length} items</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {savedContent.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{content.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {content.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteContent(content.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {savedContent.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No content generated yet</p>
                  <p className="text-sm">Use the AI generator to create content</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Integration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Services.js Integration: Ready</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Producers.js Integration: Ready</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <span>ChatGPT API: Mock Mode</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Content Management: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;

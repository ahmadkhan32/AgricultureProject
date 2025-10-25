import React, { useState, useEffect } from 'react';
import { Plus, Save, Eye, Trash2, RefreshCw, Bot, FileText, Users } from 'lucide-react';
import chatgptService from '../services/chatgptService';
import contentService from '../services/contentService';

const ContentDashboard = () => {
  const [activeTab, setActiveTab] = useState('service');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [savedContent, setSavedContent] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  // Load saved content on component mount
  useEffect(() => {
    loadSavedContent();
  }, [activeTab]);

  const loadSavedContent = () => {
    if (activeTab === 'service') {
      setSavedContent(contentService.getServices());
    } else {
      setSavedContent(contentService.getProducers());
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const content = await chatgptService.generateContent(prompt, activeTab);
      const imageSuggestion = chatgptService.generateImageSuggestions(content);
      
      setGeneratedContent({
        ...content,
        image: imageSuggestion
      });
      setSelectedImage(imageSuggestion);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Erreur lors de la génération du contenu');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;

    const contentToSave = {
      ...generatedContent,
      image: selectedImage
    };

    let saved;
    if (activeTab === 'service') {
      saved = contentService.saveService(contentToSave);
    } else {
      saved = contentService.saveProducer(contentToSave);
    }

    if (saved) {
      alert('Contenu sauvegardé avec succès!');
      setGeneratedContent(null);
      setPrompt('');
      loadSavedContent();
    } else {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu?')) {
      contentService.deleteContent(id, activeTab);
      loadSavedContent();
    }
  };

  const handlePreview = (content) => {
    setGeneratedContent(content);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tableau de Bord de Contenu
          </h1>
          <p className="text-gray-600">
            Générez et gérez du contenu pour votre site web avec l'IA
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('service')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'service'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Services
          </button>
          <button
            onClick={() => setActiveTab('producer')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'producer'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Producteurs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Generation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-blue-600" />
              Génération de Contenu
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt pour l'IA
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Décrivez le ${activeTab === 'service' ? 'service' : 'producteur'} que vous voulez créer...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (optionnel)
                </label>
                <input
                  type="text"
                  value={selectedImage}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  placeholder="Nom du fichier image..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Générer le Contenu
                  </>
                )}
              </button>
            </div>

            {/* Generated Content Preview */}
            {generatedContent && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold mb-2">Aperçu du Contenu Généré:</h3>
                <div className="space-y-2">
                  <p><strong>Titre:</strong> {generatedContent.title || generatedContent.name}</p>
                  <p><strong>Description:</strong> {generatedContent.description}</p>
                  {generatedContent.category && (
                    <p><strong>Catégorie:</strong> {generatedContent.category}</p>
                  )}
                  {generatedContent.location && (
                    <p><strong>Localisation:</strong> {generatedContent.location}</p>
                  )}
                </div>
                
                <button
                  onClick={handleSave}
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            )}
          </div>

          {/* Saved Content Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Contenu Sauvegardé ({savedContent.length})
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedContent.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun contenu sauvegardé
                </p>
              ) : (
                savedContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {content.title || content.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {content.category || content.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(content)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Aperçu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Full Content Preview Modal */}
        {generatedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {generatedContent.title || generatedContent.name}
                  </h2>
                  <button
                    onClick={() => setGeneratedContent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {generatedContent.category || generatedContent.location}
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">{generatedContent.description}</p>
                  
                  {generatedContent.blogContent && (
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">Article Complet</h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {generatedContent.blogContent}
                      </div>
                    </div>
                  )}
                  
                  {generatedContent.tags && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDashboard;

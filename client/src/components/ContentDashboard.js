import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Trash2, RefreshCw, Bot, FileText, Users, Upload, Image, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatgptService from '../services/chatgptService';
import enhancedContentService from '../services/enhancedCrudService';

const ContentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('service');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [savedContent, setSavedContent] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const loadSavedContent = useCallback(async () => {
    try {
      if (activeTab === 'service') {
        const services = await enhancedContentService.getAllServices();
        setSavedContent(services);
      } else {
        const producers = await enhancedContentService.getAllProducers();
        setSavedContent(producers);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback to local storage
      if (activeTab === 'service') {
        setSavedContent(enhancedContentService.getLocalServices());
      } else {
        setSavedContent(enhancedContentService.getLocalProducers());
      }
    }
  }, [activeTab]);

  // Load saved content on component mount
  useEffect(() => {
    loadSavedContent();
  }, [loadSavedContent]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setSubmitStatus('idle'); // Reset submit status when generating new content
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

  const handleSubmit = async () => {
    // Save and navigate to view
    if (!generatedContent) return;

    setIsUploading(true);
    setSubmitStatus('loading');
    
    try {
      const contentToSave = {
        ...generatedContent,
        image: selectedImage
      };

      let saved;
      if (activeTab === 'service') {
        try {
          saved = await enhancedContentService.saveServiceToDatabase(contentToSave, selectedImageFile);
        } catch (dbError) {
          console.warn('Database save failed, falling back to local storage:', dbError);
          saved = enhancedContentService.saveService(contentToSave);
        }
      } else {
        try {
          saved = await enhancedContentService.saveProducerToDatabase(contentToSave, selectedImageFile);
        } catch (dbError) {
          console.warn('Database save failed, falling back to local storage:', dbError);
          saved = enhancedContentService.saveProducer(contentToSave);
        }
      }

      if (saved) {
        setSubmitStatus('success');
        setGeneratedContent(null);
        setPrompt('');
        setSelectedImage('');
        setSelectedImageFile(null);
        loadSavedContent();
        
        // Show success state for 2 seconds, then navigate
        setTimeout(() => {
          if (activeTab === 'service') {
            navigate('/services');
          } else {
            navigate('/producers');
          }
        }, 2000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu?')) {
      try {
        // Delete with type information
        const type = activeTab === 'service' ? 'service' : 'producer';
        await enhancedContentService.delete(id, type);
        loadSavedContent();
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handlePreview = (content) => {
    setGeneratedContent(content);
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setSelectedImage(file.name);
    }
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
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={selectedImage}
                    onChange={(e) => setSelectedImage(e.target.value)}
                    placeholder="Nom du fichier image ou URL..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </label>
                </div>
                {selectedImageFile && (
                  <p className="text-sm text-green-600 mt-1">
                    <Image className="w-4 h-4 inline mr-1" />
                    Fichier sélectionné: {selectedImageFile.name}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Générer
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !generatedContent || submitStatus === 'success'}
                  className={`
                    flex-1 py-2 px-4 rounded-md font-semibold
                    flex items-center justify-center transition-all duration-500
                    disabled:cursor-not-allowed disabled:opacity-90
                    ${
                      submitStatus === 'success'
                        ? 'bg-green-500 text-white scale-105'
                        : submitStatus === 'error'
                        ? 'bg-red-600 text-white'
                        : submitStatus === 'loading'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                    }
                  `}
                >
                  {submitStatus === 'loading' && (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  )}
                  {submitStatus === 'success' && (
                    <span className="flex items-center animate-bounce">
                      <svg className="mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Soumis avec succès !
                    </span>
                  )}
                  {submitStatus === 'error' && (
                    <>
                      <svg className="mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Erreur lors de l'envoi
                    </>
                  )}
                  {submitStatus === 'idle' && (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Soumettre
                    </>
                  )}
                </button>
              </div>
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

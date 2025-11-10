import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Calendar,
  User,
  Tag,
  MoreVertical
} from 'lucide-react';
import { enhancedNewsService } from '../../services/crudService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminNewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await enhancedNewsService.getAll({});
      if (!error) {
        setNews(data || []);
      } else {
        toast.error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Error fetching news');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async (data) => {
    try {
      // Prepare news data with proper status
      const newsData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        image_url: data.image_url || '',
        category: data.category || 'news',
        status: data.status || 'draft', // Use status from form, default to 'draft'
      };

      // Remove empty fields
      Object.keys(newsData).forEach(key => {
        if (newsData[key] === '' || newsData[key] === null) {
          delete newsData[key];
        }
      });

      const { error } = await enhancedNewsService.create(newsData);
      if (!error) {
        toast.success('News article created successfully!');
        setShowCreateModal(false);
        reset();
        fetchNews();
      } else {
        // Show detailed error message
        const errorMsg = error || 'Failed to create news article';
        toast.error(errorMsg);
        console.error('Create news error:', errorMsg);
        
        // If it's a status column error, show helpful message
        if (errorMsg.includes('status') || errorMsg.includes('schema cache')) {
          toast.error('Database error: Please add status column to news table. Check COMPLETE_FIX_NEWS_STATUS_XAMPP_MYSQL.md for instructions.', { duration: 8000 });
        }
      }
    } catch (error) {
      console.error('Error creating news:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error creating news article';
      toast.error(errorMsg);
      
      if (errorMsg.includes('status') || errorMsg.includes('schema cache')) {
        toast.error('Database error: Please add status column to news table. See COMPLETE_FIX_NEWS_STATUS_XAMPP_MYSQL.md', { duration: 8000 });
      }
    }
  };

  const handleUpdateNews = async (data) => {
    try {
      // Prepare update data with proper status
      const updateData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        image_url: data.image_url || '',
        category: data.category || 'news',
        status: data.status || 'draft',
      };

      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const { error } = await enhancedNewsService.update(editingNews.id, updateData);
      if (!error) {
        toast.success('News article updated successfully!');
        setEditingNews(null);
        reset();
        fetchNews();
      } else {
        const errorMsg = error || 'Failed to update news article';
        toast.error(errorMsg);
        console.error('Update news error:', errorMsg);
        
        if (errorMsg.includes('status') || errorMsg.includes('schema cache')) {
          toast.error('Database error: Please add status column to news table. Check COMPLETE_FIX_NEWS_STATUS_XAMPP_MYSQL.md', { duration: 8000 });
        }
      }
    } catch (error) {
      console.error('Error updating news:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error updating news article';
      toast.error(errorMsg);
      
      if (errorMsg.includes('status') || errorMsg.includes('schema cache')) {
        toast.error('Database error: Please add status column to news table. See COMPLETE_FIX_NEWS_STATUS_XAMPP_MYSQL.md', { duration: 8000 });
      }
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        const { error } = await enhancedNewsService.delete(id);
        if (!error) {
          toast.success('News article deleted successfully');
          fetchNews();
        } else {
          toast.error('Failed to delete news article');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Error deleting news article');
      }
    }
  };

  const handlePublishNews = async (id) => {
    try {
      const { error } = await enhancedNewsService.publishNews(id);
      if (!error) {
        toast.success('News article published successfully');
        fetchNews();
      } else {
        toast.error('Failed to publish news article');
      }
    } catch (error) {
      console.error('Error publishing news:', error);
      toast.error('Error publishing news article');
    }
  };

  const handleArchiveNews = async (id) => {
    try {
      const { error } = await enhancedNewsService.archiveNews(id);
      if (!error) {
        toast.success('News article archived successfully');
        fetchNews();
      } else {
        toast.error('Failed to archive news article');
      }
    } catch (error) {
      console.error('Error archiving news:', error);
      toast.error('Error archiving news article');
    }
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryStyles = {
      news: 'bg-blue-100 text-blue-800',
      press_release: 'bg-purple-100 text-purple-800',
      event: 'bg-orange-100 text-orange-800',
      announcement: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryStyles[category]}`}>
        {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Manage news articles, press releases, and announcements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create News</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            <option value="news">News</option>
            <option value="press_release">Press Release</option>
            <option value="event">Event</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <div key={article.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div className="flex space-x-2">
                {getStatusBadge(article.status)}
                {getCategoryBadge(article.category)}
              </div>
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {article.excerpt || article.content.substring(0, 150) + '...'}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
              {article.published_at && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingNews(article)}
                className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              
              {article.status === 'draft' && (
                <button
                  onClick={() => handlePublishNews(article.id)}
                  className="flex-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Publish
                </button>
              )}
              
              {article.status === 'published' && (
                <button
                  onClick={() => handleArchiveNews(article.id)}
                  className="flex-1 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  <EyeOff className="w-3 h-3 inline mr-1" />
                  Archive
                </button>
              )}
              
              <button
                onClick={() => handleDeleteNews(article.id)}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNews) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingNews ? 'Edit News Article' : 'Create News Article'}
              </h2>
              
              <form onSubmit={handleSubmit(editingNews ? handleUpdateNews : handleCreateNews)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter news title"
                    defaultValue={editingNews?.title}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="input-field"
                    defaultValue={editingNews?.category}
                  >
                    <option value="">Select category</option>
                    <option value="news">News</option>
                    <option value="press_release">Press Release</option>
                    <option value="event">Event</option>
                    <option value="announcement">Announcement</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of the article"
                    defaultValue={editingNews?.excerpt}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    rows={8}
                    className="input-field"
                    placeholder="Write your article content here..."
                    defaultValue={editingNews?.content}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    {...register('image_url')}
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                    defaultValue={editingNews?.image_url}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="input-field"
                    defaultValue={editingNews?.status || 'draft'}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingNews(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {editingNews ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsManagement;

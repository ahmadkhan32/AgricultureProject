import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';
import NewsForm from './NewsForm';

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const queryClient = useQueryClient();

  const { data: newsData, isLoading } = useQuery(
    ['admin-news', { search: searchTerm, status: selectedStatus, category: selectedCategory, page: currentPage }],
    async () => {
      let filters = {};
      if (selectedStatus) filters.status = selectedStatus;
      if (selectedCategory) filters.category = selectedCategory;

      const allNews = await crudService.news.fetchAll(filters);
      let filteredNews = allNews;

      if (searchTerm) {
        filteredNews = filteredNews.filter(news =>
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Simple pagination
      const limit = 10;
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNews = filteredNews.slice(startIndex, endIndex);

      return {
        news: paginatedNews,
        pagination: {
          currentPage,
          pages: Math.ceil(filteredNews.length / limit),
          total: filteredNews.length
        }
      };
    },
    {
      keepPreviousData: true,
    }
  );

  const createMutation = useMutation(
    (data) => crudService.news.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-news');
        setShowForm(false);
        toast.success('News article created successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create news article');
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => crudService.news.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-news');
        setShowForm(false);
        setEditingNews(null);
        toast.success('News article updated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update news article');
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.news.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-news');
        toast.success('News article deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete news article');
      },
    }
  );

  const handleCreate = () => {
    setEditingNews(null);
    setShowForm(true);
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data) => {
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      news: 'bg-blue-100 text-blue-800',
      press_release: 'bg-purple-100 text-purple-800',
      event: 'bg-orange-100 text-orange-800',
      announcement: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (showForm) {
    return (
      <NewsForm
        news={editingNews}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingNews(null);
        }}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Manage news articles, press releases, and announcements</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create News
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="news">News</option>
              <option value="press_release">Press Release</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="card">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : newsData?.news?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsData.news.map((news) => (
                  <tr key={news.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {news.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                        {news.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(news.status)}`}>
                        {news.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {news.author ? `${news.author.first_name} ${news.author.last_name}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {news.published_at ? new Date(news.published_at).toLocaleDateString() : 'Not published'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(news)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No news articles found</p>
          </div>
        )}

        {/* Pagination */}
        {newsData?.pagination && newsData.pagination.pages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, newsData.pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(newsData.pagination.pages, currentPage + 1))}
                disabled={currentPage === newsData.pagination.pages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;

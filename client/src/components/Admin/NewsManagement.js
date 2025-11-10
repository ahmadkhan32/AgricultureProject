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
      draft: 'bg-gray-100 text-gray-800 border border-gray-200',
      published: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      archived: 'bg-red-100 text-red-800 border border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getCategoryColor = (category) => {
    const colors = {
      news: 'bg-blue-100 text-blue-800 border border-blue-200',
      press_release: 'bg-purple-100 text-purple-800 border border-purple-200',
      event: 'bg-orange-100 text-orange-800 border border-orange-200',
      announcement: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border border-gray-200';
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
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-30"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">News Management</h1>
            <p className="text-blue-100 font-medium">Manage news articles, press releases, and announcements</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl flex items-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create News
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
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
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
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
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(news)}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
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
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, newsData.pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-gray-600 bg-white border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(newsData.pagination.pages, currentPage + 1))}
                disabled={currentPage === newsData.pagination.pages}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

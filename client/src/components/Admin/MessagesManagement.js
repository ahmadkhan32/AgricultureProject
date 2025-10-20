import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Eye,
  Trash2,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';

const MessagesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unread', 'read'

  const { data: messages, isLoading, error } = useQuery(
    ['messages', { searchTerm, filterStatus }],
    async () => {
      let filters = {};
      if (filterStatus !== 'all') filters.is_read = filterStatus === 'read';

      const allMessages = await crudService.contactMessages.fetchAll(filters);
      if (searchTerm) {
        return allMessages.filter(message =>
          message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return allMessages;
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const markAsReadMutation = useMutation(
    (id) => crudService.contactMessages.update(id, { is_read: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
        toast.success('Message marked as read!');
      },
      onError: (err) => {
        toast.error(`Error updating message: ${err.message}`);
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.contactMessages.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
        toast.success('Message deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Error deleting message: ${err.message}`);
      },
    }
  );

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading messages: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-7 h-7 mr-3 text-primary-600" /> Messages Management
        </h1>
      </div>

      <p className="text-gray-600">Manage contact form submissions and inquiries from website visitors.</p>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message.id} className={!message.is_read ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{message.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {message.email}
                      </div>
                      {message.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {message.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{message.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(message.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      message.is_read 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {message.is_read ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Read
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Unread
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/messages/${message.id}`} className="text-gray-600 hover:text-gray-900" title="View">
                        <Eye className="w-5 h-5" />
                      </Link>
                      {!message.is_read && (
                        <button 
                          onClick={() => handleMarkAsRead(message.id)} 
                          className="text-green-600 hover:text-green-900" 
                          title="Mark as Read"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(message.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesManagement;

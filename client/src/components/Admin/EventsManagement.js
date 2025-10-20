import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MapPin,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';

const EventsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'upcoming', 'ongoing', 'past'

  const { data: events, isLoading, error } = useQuery(
    ['events', { searchTerm, filterStatus }],
    async () => {
      const allEvents = await crudService.events.fetchAll();
      let filteredEvents = allEvents;

      if (searchTerm) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterStatus !== 'all') {
        const now = new Date();
        filteredEvents = filteredEvents.filter(event => {
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          
          switch (filterStatus) {
            case 'upcoming':
              return startDate > now;
            case 'ongoing':
              return startDate <= now && endDate >= now;
            case 'past':
              return endDate < now;
            default:
              return true;
          }
        });
      }

      return filteredEvents;
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.events.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        toast.success('Event deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Error deleting event: ${err.message}`);
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > now) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    if (start <= now && end >= now) return { status: 'ongoing', color: 'bg-green-100 text-green-800' };
    return { status: 'past', color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading events: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-7 h-7 mr-3 text-primary-600" /> Events Management
        </h1>
        <Link to="/admin/events/new" className="btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Event
        </Link>
      </div>

      <p className="text-gray-600">Manage UCAEP events, workshops, and training sessions.</p>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
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
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
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
            {events.length > 0 ? (
              events.map((event) => {
                const eventStatus = getEventStatus(event.start_date, event.end_date);
                
                return (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{event.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(event.start_date)}
                        </div>
                        {event.end_date !== event.start_date && (
                          <div className="text-sm text-gray-500">
                            to {formatDate(event.end_date)}
                          </div>
                        )}
                        {event.start_time && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.start_time}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventStatus.color}`}>
                        {eventStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/events/${event.id}`} target="_blank" className="text-gray-600 hover:text-gray-900" title="View">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link to={`/admin/events/edit/${event.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsManagement;

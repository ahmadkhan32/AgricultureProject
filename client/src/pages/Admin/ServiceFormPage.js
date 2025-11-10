import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import ServiceForm from '../../components/Admin/ServiceForm';
import { createService, updateService, fetchServiceById } from '../../services/api';

const ServiceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [service, setService] = useState(null);

  const isEditMode = !!id;

  // Fetch service data if editing
  const { isLoading: isLoadingService } = useQuery(
    ['service', id],
    async () => {
      if (!id) return null;
      const response = await fetchServiceById(id);
      return response.service;
    },
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        setService(data);
      },
      onError: (error) => {
        console.error('Error fetching service:', error);
        toast.error('Failed to load service');
        navigate('/admin/services');
      },
    }
  );

  // Create mutation
  const createMutation = useMutation(
    async (data) => {
      const response = await createService(data);
      return response.service || response;
    },
    {
      onSuccess: () => {
        // Invalidate all service-related queries for real-time sync
        queryClient.invalidateQueries('services');
        queryClient.invalidateQueries(['services']);
        queryClient.invalidateQueries(['service']);
        toast.success('Service created successfully!');
        navigate('/admin/services');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create service';
        toast.error(`Error creating service: ${errorMessage}`);
      },
    }
  );

  // Update mutation
  const updateMutation = useMutation(
    async (data) => {
      const response = await updateService(id, data);
      return response.service || response;
    },
    {
      onSuccess: () => {
        // Invalidate all service-related queries for real-time sync
        queryClient.invalidateQueries('services');
        queryClient.invalidateQueries(['services']);
        queryClient.invalidateQueries(['service']);
        queryClient.invalidateQueries(['service', id]);
        toast.success('Service updated successfully!');
        navigate('/admin/services');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update service';
        toast.error(`Error updating service: ${errorMessage}`);
      },
    }
  );

  const handleSubmit = (data) => {
    // Prepare data for backend
    const serviceData = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      status: data.status,
    };

    // Add optional fields
    if (data.content && data.content.trim()) {
      serviceData.content = data.content.trim();
    }

    if (data.icon && data.icon.trim()) {
      serviceData.icon = data.icon.trim();
    }

    if (data.imageUrl && data.imageUrl.trim()) {
      serviceData.imageUrl = data.imageUrl.trim();
    }

    if (data.tags && data.tags.length > 0) {
      serviceData.tags = data.tags;
    }

    if (isEditMode) {
      updateMutation.mutate(serviceData);
    } else {
      createMutation.mutate(serviceData);
    }
  };

  const handleCancel = () => {
    navigate('/admin/services');
  };

  if (isEditMode && isLoadingService) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  return (
    <ServiceForm
      service={service}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={createMutation.isLoading || updateMutation.isLoading}
    />
  );
};

export default ServiceFormPage;


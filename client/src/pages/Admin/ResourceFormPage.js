import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import ResourceForm from '../../components/Admin/ResourceForm';
import { createResource, updateResource, fetchResourceById } from '../../services/api';

const ResourceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [resource, setResource] = useState(null);

  const isEditMode = !!id;

  // Fetch resource data if editing
  const { isLoading: isLoadingResource } = useQuery(
    ['resource', id],
    async () => {
      if (!id) return null;
      const response = await fetchResourceById(id);
      return response.resource || response;
    },
    {
      enabled: isEditMode,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        setResource(data);
      },
      onError: (error) => {
        toast.error(`Failed to load resource: ${error.message}`);
        console.error('Error fetching resource for edit:', error);
        navigate('/admin/resources');
      },
    }
  );

  // Create mutation
  const createMutation = useMutation(
    async (data) => {
      const response = await createResource(data);
      return response.resource || response;
    },
    {
      onSuccess: () => {
        // Invalidate all resource-related queries for real-time sync
        queryClient.invalidateQueries('resources');
        queryClient.invalidateQueries(['resources']);
        queryClient.invalidateQueries(['resource']);
        toast.success('Resource created successfully!');
        navigate('/admin/resources');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create resource';
        toast.error(`Error creating resource: ${errorMessage}`);
        console.error('Error creating resource:', error);
      },
    }
  );

  // Update mutation
  const updateMutation = useMutation(
    async (data) => {
      const response = await updateResource(id, data);
      return response.resource || response;
    },
    {
      onSuccess: () => {
        // Invalidate all resource-related queries for real-time sync
        queryClient.invalidateQueries('resources');
        queryClient.invalidateQueries(['resources']);
        queryClient.invalidateQueries(['resource']);
        queryClient.invalidateQueries(['resource', id]);
        toast.success('Resource updated successfully!');
        navigate('/admin/resources');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update resource';
        toast.error(`Error updating resource: ${errorMessage}`);
        console.error('Error updating resource:', error);
      },
    }
  );

  const handleSubmit = (data) => {
    // Prepare data for backend
    const resourceData = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      fileType: data.fileType,
      fileUrl: data.fileUrl.trim(),
      status: data.status,
    };

    if (isEditMode) {
      updateMutation.mutate(resourceData);
    } else {
      createMutation.mutate(resourceData);
    }
  };

  const handleCancel = () => {
    navigate('/admin/resources');
  };

  if (isEditMode && isLoadingResource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  return (
    <ResourceForm
      resource={isEditMode ? resource : null}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={createMutation.isLoading || updateMutation.isLoading}
    />
  );
};

export default ResourceFormPage;


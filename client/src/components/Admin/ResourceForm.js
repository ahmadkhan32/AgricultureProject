import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Upload, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile } from '../../services/api';

const ResourceForm = ({ resource, onSubmit, onCancel, isLoading }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [fileFile, setFileFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'documents',
      fileType: 'PDF',
      fileUrl: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (resource) {
      reset({
        title: resource.title || '',
        description: resource.description || '',
        category: resource.category || 'documents',
        fileType: resource.fileType || resource.file_type || 'PDF',
        fileUrl: resource.fileUrl || resource.file_url || '',
        status: resource.status || 'active',
      });
      setFileUrl(resource.fileUrl || resource.file_url || '');
    }
  }, [resource, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileFile(file);
      setFileUrl(''); // Clear URL if file is selected
      
      // Auto-detect file type
      const extension = file.name.split('.').pop().toUpperCase();
      const typeMap = {
        'PDF': 'PDF',
        'DOC': 'DOCX',
        'DOCX': 'DOCX',
        'XLS': 'XLSX',
        'XLSX': 'XLSX',
        'PPT': 'PPTX',
        'PPTX': 'PPTX',
        'TXT': 'TXT',
        'CSV': 'CSV',
      };
      if (typeMap[extension]) {
        setValue('fileType', typeMap[extension]);
      }
    }
  };

  const handleRemoveFile = () => {
    setFileFile(null);
    setFileUrl('');
    setValue('fileUrl', '');
  };

  const handleFormSubmit = async (data) => {
    let finalFileUrl = fileUrl;
    
    if (fileFile) {
      setUploadingFile(true);
      try {
        const uploadResponse = await uploadFile(fileFile, 'resources');
        finalFileUrl = uploadResponse.url;
        toast.success('File uploaded successfully!');
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        const errorMessage = uploadError.response?.data?.error || uploadError.response?.data?.message || uploadError.message || 'Failed to upload file';
        toast.error(`Upload failed: ${errorMessage}`);
        setUploadingFile(false);
        return;
      } finally {
        setUploadingFile(false);
      }
    }

    if (!finalFileUrl) {
      toast.error('Please provide a file URL or upload a file');
      return;
    }

    const formData = {
      ...data,
      fileUrl: finalFileUrl,
    };
    
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-30"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {resource ? 'Edit Resource' : 'Create New Resource'}
            </h1>
            <p className="text-blue-100 font-medium">
              {resource ? 'Update the resource details' : 'Add a new resource to UCAEP'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters',
                    },
                    maxLength: {
                      value: 200,
                      message: 'Title must be less than 200 characters',
                    },
                  })}
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g., Agricultural Production Report 2024"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field w-full"
                >
                  <option value="reports">Reports</option>
                  <option value="guidelines">Guidelines</option>
                  <option value="forms">Forms</option>
                  <option value="documents">Documents</option>
                  <option value="others">Others</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description must be less than 1000 characters',
                  },
                })}
                rows={4}
                className="input-field w-full"
                placeholder="Brief description of the resource..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
                  File Type *
                </label>
                <select
                  {...register('fileType', { required: 'File type is required' })}
                  className="input-field w-full"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="PPTX">PPTX</option>
                  <option value="TXT">TXT</option>
                  <option value="CSV">CSV</option>
                  <option value="ZIP">ZIP</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.fileType && (
                  <p className="mt-1 text-sm text-red-600">{errors.fileType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="input-field w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File *
              </label>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOCX, XLSX, etc. (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                    />
                  </label>
                  {fileFile && (
                    <div className="mt-2 flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">{fileFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    File URL (External Link)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('fileUrl', {
                        validate: (value) => {
                          if (!fileFile && !value) {
                            return 'Please provide a file URL or upload a file';
                          }
                          if (value && !/^https?:\/\//.test(value)) {
                            return 'Please enter a valid URL starting with http:// or https://';
                          }
                          return true;
                        },
                      })}
                      type="url"
                      className="input-field w-full pl-10"
                      placeholder="https://example.com/document.pdf"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      disabled={!!fileFile} // Disable if a file is selected
                    />
                  </div>
                  {errors.fileUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.fileUrl.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || uploadingFile}
            className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || uploadingFile ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {uploadingFile ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {resource ? 'Update Resource' : 'Create Resource'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;


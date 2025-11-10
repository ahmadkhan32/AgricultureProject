# 🎨 Frontend Page Creation Template & Prompt

## 📋 **Universal Prompt for Creating Frontend Pages**

Use this prompt template to create any new frontend page with full CRUD functionality.

---

## 🎯 **Template Prompt**

```
Create a React component for [PAGE_NAME] with the following requirements:

1. **Page Location:** client/src/pages/[PageName].js
2. **Admin Management:** client/src/components/Admin/[PageName]Management.js
3. **Form Component:** client/src/components/Admin/[PageName]Form.js

**Features Required:**
- Display list of items with search and filter functionality
- Create, Read, Update, Delete (CRUD) operations
- Real-time updates using React Query
- Form validation using react-hook-form
- Toast notifications using react-hot-toast
- Responsive design with Tailwind CSS
- Loading states and error handling
- Pagination support

**API Endpoints:**
- GET /api/[endpoint] - Get all items
- GET /api/[endpoint]/:id - Get single item
- POST /api/[endpoint] - Create item
- PUT /api/[endpoint]/:id - Update item
- DELETE /api/[endpoint]/:id - Delete item

**Data Fields:**
[List all fields here, e.g.]
- title (string, required)
- description (text, optional)
- status (enum: active, inactive, pending)
- imageUrl (string, optional)
- createdAt (date, auto)

**UI Requirements:**
- Card-based layout for public page
- Table layout for admin page
- Search bar at top
- Filter dropdowns (by status, category, etc.)
- Action buttons (Edit, Delete) for each item
- Modal form for create/edit
- Confirmation dialog for delete

**Styling:**
- Use Tailwind CSS classes
- Follow existing design system
- Use lucide-react icons
- Responsive breakpoints (mobile, tablet, desktop)
```

---

## 📝 **Example: Creating a "Products" Page**

### **Step 1: Use the Prompt**

```
Create a React component for Products with the following requirements:

1. **Page Location:** client/src/pages/Products.js
2. **Admin Management:** client/src/components/Admin/ProductsManagement.js
3. **Form Component:** client/src/components/Admin/ProductsForm.js

**Features Required:**
- Display list of products with search and filter
- CRUD operations (Create, Read, Update, Delete)
- Real-time updates using React Query
- Form validation using react-hook-form
- Toast notifications
- Responsive design with Tailwind CSS
- Loading states and error handling
- Pagination support

**API Endpoints:**
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

**Data Fields:**
- name (string, required, min 3 chars)
- description (text, optional, min 20 chars)
- price (number, required, positive)
- category (enum: electronics, clothing, food, other)
- imageUrl (string, optional)
- stock (number, optional, default 0)
- status (enum: active, inactive, pending, default: pending)

**UI Requirements:**
- Card-based layout for public page
- Table layout for admin page
- Search bar at top
- Filter by category and status
- Action buttons (Edit, Delete) for each item
- Modal form for create/edit
- Confirmation dialog for delete

**Styling:**
- Use Tailwind CSS classes
- Follow existing design system
- Use lucide-react icons
- Responsive breakpoints
```

---

## 🛠️ **Quick Copy-Paste Templates**

### **Template 1: Public Listing Page**

**File:** `client/src/pages/[PageName].js`

```javascript
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Search, Filter } from 'lucide-react';
import crudService from '../services/crudService';

const [PageName] = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: items = [], isLoading, error } = useQuery(
    ['[queryKey]', { searchTerm, selectedCategory }],
    async () => {
      const filters = {};
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      return await crudService.[serviceName].fetchAll(filters);
    },
    {
      staleTime: 60 * 1000,
    }
  );

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error loading data</div>;

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">[Page Title]</h1>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {/* Add category options */}
          </select>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description?.substring(0, 100)}...</p>
                <button className="btn-primary w-full">View Details</button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">No items found</div>
        )}
      </div>
    </div>
  );
};

export default [PageName];
```

---

### **Template 2: Admin Management Page**

**File:** `client/src/components/Admin/[PageName]Management.js`

```javascript
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';
import [PageName]Form from './[PageName]Form';

const [PageName]Management = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: items = [], isLoading } = useQuery(
    ['[queryKey]', { searchTerm }],
    async () => await crudService.[serviceName].fetchAll({}),
    { staleTime: 60 * 1000 }
  );

  const createMutation = useMutation(
    (data) => crudService.[serviceName].create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('[queryKey]');
        setShowForm(false);
        toast.success('Created successfully!');
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => crudService.[serviceName].update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('[queryKey]');
        setShowForm(false);
        setEditingItem(null);
        toast.success('Updated successfully!');
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.[serviceName].remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('[queryKey]');
        toast.success('Deleted successfully!');
      },
      onError: (err) => toast.error(`Error: ${err.message}`),
    }
  );

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">[Page Name] Management</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <PlusCircle size={20} />
          Create New
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items
              .filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <[PageName]Form
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      )}
    </div>
  );
};

export default [PageName]Management;
```

---

### **Template 3: Form Component**

**File:** `client/src/components/Admin/[PageName]Form.js`

```javascript
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';

const [PageName]Form = ({ item, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending'
    }
  });

  useEffect(() => {
    if (item) {
      reset({
        title: item.title || '',
        description: item.description || '',
        status: item.status || 'pending'
      });
    }
  }, [item, reset]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{item ? 'Edit' : 'Create New'} Item</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Min 5 characters' } })}
              type="text"
              className="input-field"
              placeholder="Enter title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register('description', { minLength: { value: 20, message: 'Min 20 characters' } })}
              rows={4}
              className="input-field"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select {...register('status')} className="input-field">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={isLoading}>
              <Save size={20} />
              {isLoading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default [PageName]Form;
```

---

## 📝 **Checklist for New Page**

- [ ] Create database table in phpMyAdmin
- [ ] Create Sequelize model
- [ ] Create controller
- [ ] Create routes
- [ ] Register routes in app.js
- [ ] Add API functions in api.js
- [ ] Add CRUD service in crudService.js
- [ ] Create public page component
- [ ] Create admin management component
- [ ] Create form component
- [ ] Add route to AdminDashboard.js
- [ ] Test all CRUD operations
- [ ] Test search and filters
- [ ] Test error handling

---

## 🎯 **Quick Reference**

**Replace these placeholders:**
- `[PageName]` → Your page name (e.g., Products, Services, Events)
- `[queryKey]` → React Query key (e.g., 'products', 'services')
- `[serviceName]` → Service name in crudService (e.g., products, services)
- `[endpoint]` → API endpoint (e.g., /api/products, /api/services)

---

Use these templates as a starting point for any new page! 🚀


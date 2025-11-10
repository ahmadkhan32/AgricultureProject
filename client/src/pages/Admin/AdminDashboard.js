import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import DashboardOverview from '../../components/Admin/DashboardOverview';
import NewsManagement from '../../components/Admin/NewsManagement';
import ProducersManagement from '../../components/Admin/ProducersManagement';
import ServicesManagement from '../../components/Admin/ServicesManagement';
// eslint-disable-next-line no-unused-vars
import ServiceFormPage from './ServiceFormPage';
import PartnershipsManagement from '../../components/Admin/PartnershipsManagement';
import ResourcesManagement from '../../components/Admin/ResourcesManagement';
// eslint-disable-next-line no-unused-vars
import ResourceFormPage from './ResourceFormPage';
import UsersManagement from '../../components/Admin/UsersManagement';
import MessagesManagement from '../../components/Admin/MessagesManagement';
import EventsManagement from '../../components/Admin/EventsManagement';
import DataPopulator from '../../components/Admin/DataPopulator';
import SecurityDashboard from '../../components/Admin/SecurityDashboard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-blue-50/30">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-indigo-50/20 to-transparent">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/news" element={<NewsManagement />} />
              <Route path="/producers" element={<ProducersManagement />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/services/new" element={<ServiceFormPage />} />
              <Route path="/services/edit/:id" element={<ServiceFormPage />} />
              <Route path="/partnerships" element={<PartnershipsManagement />} />
              <Route path="/resources" element={<ResourcesManagement />} />
              <Route path="/resources/new" element={<ResourceFormPage />} />
              <Route path="/resources/edit/:id" element={<ResourceFormPage />} />
              <Route path="/users" element={<UsersManagement />} />
              <Route path="/messages" element={<MessagesManagement />} />
              <Route path="/events" element={<EventsManagement />} />
              <Route path="/security" element={<SecurityDashboard />} />
              <Route path="/data-populator" element={<DataPopulator />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

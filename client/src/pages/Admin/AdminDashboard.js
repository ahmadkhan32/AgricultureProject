import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import DashboardOverview from '../../components/Admin/DashboardOverview';
import NewsManagement from '../../components/Admin/NewsManagement';
import ProducersManagement from '../../components/Admin/ProducersManagement';
import ServicesManagement from '../../components/Admin/ServicesManagement';
import PartnershipsManagement from '../../components/Admin/PartnershipsManagement';
import ResourcesManagement from '../../components/Admin/ResourcesManagement';
import UsersManagement from '../../components/Admin/UsersManagement';
import MessagesManagement from '../../components/Admin/MessagesManagement';
import EventsManagement from '../../components/Admin/EventsManagement';
import DataPopulator from '../../components/Admin/DataPopulator';
import SecurityDashboard from '../../components/Admin/SecurityDashboard';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/news" element={<NewsManagement />} />
            <Route path="/producers" element={<ProducersManagement />} />
            <Route path="/services" element={<ServicesManagement />} />
            <Route path="/partnerships" element={<PartnershipsManagement />} />
            <Route path="/resources" element={<ResourcesManagement />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/messages" element={<MessagesManagement />} />
            <Route path="/events" element={<EventsManagement />} />
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/data-populator" element={<DataPopulator />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

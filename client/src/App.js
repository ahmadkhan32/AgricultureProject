import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SecurityProvider } from './contexts/SecurityContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Services from './pages/Services';
import Producers from './pages/Producers';
import ProducerDetail from './pages/ProducerDetail';
import ProducerMap from './pages/ProducerMap';
import Partnerships from './pages/Partnerships';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminRegister from './pages/Auth/AdminRegister';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProducerProfile from './pages/Producer/ProducerProfile';
import ProducerRegistration from './pages/Producer/ProducerRegistration';
import Unauthorized from './pages/Unauthorized';
import { 
  AdminRoute as EnhancedAdminRoute,
  ProducerRoute,
  AuthenticatedRoute 
} from './components/Auth/EnhancedProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SecurityProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/producers" element={<Producers />} />
                  <Route path="/producers/map" element={<ProducerMap />} />
                  <Route path="/producers/:id" element={<ProducerDetail />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/register" element={<AdminRegister />} />
                  
                  {/* Unauthorized Access Page */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected Routes with Enhanced Security */}
                  <Route path="/dashboard" element={
                    <AuthenticatedRoute>
                      <Dashboard />
                    </AuthenticatedRoute>
                  } />
                  <Route path="/producer/profile" element={
                    <ProducerRoute>
                      <ProducerProfile />
                    </ProducerRoute>
                  } />
                  <Route path="/producer/register" element={
                    <AuthenticatedRoute>
                      <ProducerRegistration />
                    </AuthenticatedRoute>
                  } />
                  
                  {/* Admin Routes with Enhanced Security */}
                  <Route path="/admin/*" element={
                    <EnhancedAdminRoute>
                      <AdminDashboard />
                    </EnhancedAdminRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SecurityProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

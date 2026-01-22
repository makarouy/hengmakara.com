'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ComprehensiveAdminDashboard from '@/components/admin/ComprehensiveAdminDashboard';
import AdminFeedbackManager from '@/components/admin/AdminFeedbackManager';
import ContentOverview from '@/components/admin/ContentOverview';
import '@/assets/css/admin.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('management');
  const [adminUser, setAdminUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token) {
      router.push('/admin');
      return;
    }
    setAdminUser(user);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminPermissions');
    router.push('/admin');
  };

  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-header-top">
        <div className="header-content">
          <h1>🛡️ Admin Control Center</h1>
          <p>Welcome, {adminUser || 'Admin'}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          🚪 Logout
        </button>
      </header>

      <div className="admin-section-tabs">
        <button
          className={`section-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          ⚡ Settings & Overview
        </button>
        <button
          className={`section-tab ${activeSection === 'management' ? 'active' : ''}`}
          onClick={() => setActiveSection('management')}
        >
          📊 Full Management
        </button>
        <button
          className={`section-tab ${activeSection === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveSection('feedback')}
        >
          💬 Feedback & Moderation
        </button>
      </div>

      <main className="admin-content-wrapper">
        {activeSection === 'overview' && <ContentOverview />}
        {activeSection === 'management' && <ComprehensiveAdminDashboard />}
        {activeSection === 'feedback' && <AdminFeedbackManager />}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PERMISSIONS_LIST = ["create", "read", "update", "delete", "archive", "duplicate"];
const ROLES = ["admin", "expert", "editor", "viewer"];

export default function SuperAdminPage() {
  const router = useRouter();
  
  // Auth State
  const [masterKey, setMasterKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: PERMISSIONS_LIST
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/users', {
        headers: {
          'x-master-key': masterKey,
          'x-master-user': 'admin@hengmakara.com' 
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Invalid Password');
      }
    } catch (error) {
      setAuthError('Connection Failed');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/super-admin/users', {
        headers: { 'x-master-key': masterKey, 'x-master-user': 'admin@hengmakara.com' }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-master-key': masterKey,
            'x-master-user': 'admin@hengmakara.com'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchUsers();
        if (!editingUser) resetForm();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Operation failed' });
    }
    setLoading(false);
  };

  const handleDelete = async (username) => {
    if (!confirm(`Delete user ${username}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-master-key': masterKey,
            'x-master-user': 'admin@hengmakara.com'
        },
        body: JSON.stringify({ action: 'delete', username })
      });
       const data = await res.json();
       if(res.ok) {
           setMessage({ type: 'success', text: data.message });
           fetchUsers();
           if (editingUser?.username === username) resetForm();
       } else {
           setMessage({ type: 'error', text: data.error });
       }
    } catch (err) {
         setMessage({ type: 'error', text: 'Delete failed' });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingUser(null);
    setMessage('');
    setFormData({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: PERMISSIONS_LIST
    });
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setMessage('');
    setFormData({
        username: user.username,
        email: user.email,
        password: '', 
        role: user.role,
        permissions: user.permissions || []
    });
  };

  const togglePermission = (perm) => {
    setFormData(prev => {
        const perms = prev.permissions.includes(perm)
            ? prev.permissions.filter(p => p !== perm)
            : [...prev.permissions, perm];
        return { ...prev, permissions: perms };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded shadow-lg w-96">
          <h2 className="text-white text-xl font-bold mb-4 text-center">Admin Login</h2>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Unlock
            </button>
            {authError && <p className="text-red-400 text-center mt-3">{authError}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management System</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Form Section */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                        type="text" 
                        required
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        disabled={!!editingUser}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password {editingUser && <span className="text-gray-400 font-normal">(Leave blank to keep)</span>}
                    </label>
                    <input 
                        type="password" 
                        required={!editingUser}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="space-y-2">
                        {PERMISSIONS_LIST.map(perm => (
                            <label key={perm} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                    checked={formData.permissions.includes(perm)}
                                    onChange={() => togglePermission(perm)}
                                />
                                <span className="text-sm text-gray-700">{perm}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {message && (
                    <div className={`p-2 text-sm rounded text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex gap-2 pt-2">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {editingUser ? 'Update' : 'Create'}
                    </button>
                    {editingUser && (
                        <button 
                            type="button" 
                            onClick={resetForm}
                            className="px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    )}
                </div>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="md:col-span-2">
             <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">User</th>
                            <th className="p-4 font-semibold text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-gray-600">Permissions</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map(user => (
                            <tr key={user.username} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium text-gray-800">{user.username}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium uppercase border">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {user.permissions.slice(0, 3).map(p => (
                                            <span key={p} className="text-xs bg-gray-100 text-gray-600 px-1 rounded border">
                                                {p}
                                            </span>
                                        ))}
                                        {user.permissions.length > 3 && (
                                            <span className="text-xs text-gray-500 px-1">+{user.permissions.length - 3}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => startEdit(user)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.username)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

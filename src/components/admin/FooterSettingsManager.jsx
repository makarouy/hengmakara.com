'use client';
import React, { useState, useEffect } from 'react';

const AVAILABLE_PAYMENT_ICONS = [
    { label: 'Visa', value: 'RiVisaFill' },
    { label: 'Mastercard', value: 'RiMastercardFill' },
    { label: 'PayPal', value: 'RiPaypalFill' },
    { label: 'Bitcoin/Crypto', value: 'RiBitCoinFill' },
    { label: 'Bank Transfer', value: 'RiBankCardFill' },
    { label: 'Alipay', value: 'RiAlipayFill' },
    { label: 'WeChat Pay', value: 'RiWechatPayFill' },
    { label: 'Stripe', value: 'RiSecurePaymentFill' },
    { label: 'Cash', value: 'RiMoneyDollarCircleFill' },
    { label: 'KHQR', value: 'RiQrCodeFill' },
    { label: 'ABA Bank', value: 'RiBankCardFill' },
    { label: 'ACLEDA Bank', value: 'RiBankCardFill' },
    { label: 'Wing Bank', value: 'RiWallet3Fill' }
];

export default function FooterSettingsManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [settings, setSettings] = useState({
        footer: {
            payments: [],
            certifications: []
        }
    });

    const [newCert, setNewCert] = useState({ name: '', issuer: '', url: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [certPage, setCertPage] = useState(1);
    const certsPerPage = 10;

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            // Initialize if empty
            if (!data.footer) {
                data.footer = { 
                    payments: [
                        { name: "Visa", icon: "RiVisaFill" },
                        { name: "Mastercard", icon: "RiMastercardFill" },
                        { name: "PayPal", icon: "RiPaypalFill" },
                        { name: "Crypto", icon: "RiBitCoinFill" },
                        { name: "Bank Transfer", icon: "RiBankCardFill" }
                    ], 
                    certifications: [
                        { name: "Meta Social Media Marketing", issuer: "Coursera", url: "https://coursera.org/share/3dcb155e89b3d7fcc0b1e26ef1f9419e" },
                        { name: "Introduction to Social Media Marketing", issuer: "Coursera", url: "https://coursera.org/share/bb031a394483734bbba3245efa6dac49" },
                        { name: "Advertising with Meta", issuer: "Coursera", url: "https://coursera.org/share/968f05d4dd67ae05c8432bb0b9d55276" },
                        { name: "Measure and Optimize Social Media Marketing Campaigns", issuer: "Coursera", url: "https://coursera.org/share/eb6e90768759890afd3ac2d07603e827" },
                        { name: "Social Media Management", issuer: "Coursera", url: "https://coursera.org/share/45b5430afc796c4d2dda3a60f58781b8" },
                        { name: "Fundamentals of Social Media Advertising", issuer: "Coursera", url: "https://coursera.org/share/72ce912f1360b720429893d1e5b6ec7f" },
                        { name: "Meta Social Media Marketing Professional Certificate(v.2)", issuer: "Credly", url: "https://www.credly.com/badges/faf85ad3-9d60-41ca-aee3-164ff8e37946" }
                    ] 
                };
            }
            setSettings(data);
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Footer settings updated successfully!');
            } else {
                const errData = await res.json();
                alert(`Failed to save settings: ${errData.details || errData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    // --- Payment Logic ---
    const togglePayment = (iconValue, label) => {
        const currentList = settings.footer.payments || [];
        // Check by Name (label) instead of Icon, to allow multiple items with same icon (e.g. Banks)
        const exists = currentList.find(p => p.name === label);
        
        let newList;
        if (exists) {
            newList = currentList.filter(p => p.name !== label);
        } else {
            newList = [...currentList, { name: label, icon: iconValue }];
        }
        
        handleChange('payments', newList);
    };

    // --- Certification Logic ---
    const addCertification = () => {
        if (!newCert.name || !newCert.issuer) return alert("Name and Issuer are required");
        let newList = [...(settings.footer.certifications || [])];
        
        if (editingIndex !== null) {
            newList[editingIndex] = { ...newCert };
            setEditingIndex(null);
        } else {
            newList.push({ ...newCert });
        }
        
        handleChange('certifications', newList);
        setNewCert({ name: '', issuer: '', url: '' });
    };

    const editCertification = (index) => {
        const item = settings.footer.certifications[index];
        setNewCert({ ...item });
        setEditingIndex(index);
    };

    const cancelEdit = () => {
        setNewCert({ name: '', issuer: '', url: '' });
        setEditingIndex(null);
    };

    const removeCertification = (index) => {
        if (window.confirm('Are you sure you want to delete this certification?')) {
            const newList = [...(settings.footer.certifications || [])];
            newList.splice(index, 1);
            handleChange('certifications', newList);
            if (editingIndex === index) cancelEdit();
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            footer: {
                ...prev.footer,
                [key]: value
            }
        }));
    };

    if (loading) return <div>Loading settings...</div>;

    const certifications = settings.footer?.certifications || [];
    const totalCertPages = Math.ceil(certifications.length / certsPerPage);
    const indexOfLastCert = certPage * certsPerPage;
    const indexOfFirstCert = indexOfLastCert - certsPerPage;
    const currentCerts = certifications.slice(indexOfFirstCert, indexOfLastCert);

    const handleCertPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalCertPages) {
            setCertPage(newPage);
        }
    };

    return (
        <div className="admin-card">
            <h3 className="section-title">Footer Management</h3>
            
            {/* Accepted Payments */}
            <div className="mb-4">
                <h4>Accepted Payments</h4>
                <p className="text-muted mb-3">Select the payment methods to display in the footer.</p>
                <div className="d-flex flex-wrap gap-3">
                    {AVAILABLE_PAYMENT_ICONS.map((icon, idx) => {
                        const isSelected = settings.footer?.payments?.some(p => p.name === icon.label);
                        return (
                            <button 
                                key={`${icon.value}-${idx}`}
                                className={`btn ${isSelected ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => togglePayment(icon.value, icon.label)}
                            >
                                {isSelected ? '✓ ' : ''}{icon.label}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-3">
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Payments'}
                    </button>
                </div>
            </div>

            <hr className="my-4" />

            {/* Certifications */}
            <div className="mb-4">
                <h4>Verified & Certified By</h4>
                <div className="table-responsive mb-3">
                    <table className="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Issuer</th>
                                <th>URL</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCerts.map((cert, idx) => {
                                // Since we are slicing, the original index needs to be calculated for editing/removing
                                const originalIndex = indexOfFirstCert + idx;
                                return (
                                <tr key={originalIndex}>
                                    <td>{cert.name}</td>
                                    <td>{cert.issuer}</td>
                                    <td>
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-info">
                                            Link 
                                        </a>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => editCertification(originalIndex)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => removeCertification(originalIndex)}>Remove</button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalCertPages > 1 && (
                    <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <button 
                            onClick={() => handleCertPageChange(certPage - 1)} 
                            disabled={certPage === 1}
                            className="btn btn-sm btn-outline-light"
                        >
                            Previous
                        </button>
                        <span>Page {certPage} of {totalCertPages}</span>
                        <button 
                            onClick={() => handleCertPageChange(certPage + 1)} 
                            disabled={certPage === totalCertPages}
                            className="btn btn-sm btn-outline-light"
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="row g-3 align-items-end p-3 border rounded border-secondary bg-dark">
                    <div className="col-12">
                        <h5>{editingIndex !== null ? 'Edit Certification' : 'Add New Certification'}</h5>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Certificate Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={newCert.name}
                            onChange={e => setNewCert({...newCert, name: e.target.value})}
                            placeholder="e.g. Meta Marketing"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Issuer</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={newCert.issuer}
                            onChange={e => setNewCert({...newCert, issuer: e.target.value})}
                            placeholder="e.g. Coursera"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Validation URL</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={newCert.url}
                            onChange={e => setNewCert({...newCert, url: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="col-md-2 d-flex gap-2">
                        <button className={`btn w-100 ${editingIndex !== null ? 'btn-success' : 'btn-primary'}`} onClick={addCertification}>
                            {editingIndex !== null ? 'Update' : 'Add'}
                        </button>
                        {editingIndex !== null && (
                            <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}

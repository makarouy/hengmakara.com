'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import {
    RiVisaFill,
    RiMastercardFill,
    RiPaypalFill,
    RiBitCoinFill,
    RiBankCardFill,
    RiShieldCheckFill,
    RiAlipayFill,
    RiWechatPayFill,
    RiSecurePaymentFill,
    RiMoneyDollarCircleFill,
    RiQrCodeFill,
    RiWallet3Fill
} from '@remixicon/react'

const ICON_MAP = {
    'RiVisaFill': RiVisaFill,
    'RiMastercardFill': RiMastercardFill,
    'RiPaypalFill': RiPaypalFill,
    'RiBitCoinFill': RiBitCoinFill,
    'RiBankCardFill': RiBankCardFill,
    'RiAlipayFill': RiAlipayFill,
    'RiWechatPayFill': RiWechatPayFill,
    'RiSecurePaymentFill': RiSecurePaymentFill,
    'RiMoneyDollarCircleFill': RiMoneyDollarCircleFill,
    'RiQrCodeFill': RiQrCodeFill,
    'RiWallet3Fill': RiWallet3Fill,
};

const Footer = () => {
    const year = new Date().getFullYear()
    const [payments, setPayments] = useState([]);
    const [certifications, setCertifications] = useState([]);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.footer) {
                        setPayments(data.footer.payments || []);
                        setCertifications(data.footer.certifications || []);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch footer settings");
            }
            
            // Fallback defaults if API fails or empty
            setPayments([
                { icon: 'RiVisaFill', name: "Visa", color: "#fff" },
                { icon: 'RiMastercardFill', name: "Mastercard", color: "#fff" },
                { icon: 'RiPaypalFill', name: "PayPal", color: "#fff" },
                { icon: 'RiBitCoinFill', name: "Crypto", color: "#fff" },
                { icon: 'RiBankCardFill', name: "Bank Transfer", color: "#fff" }
            ]);
            setCertifications([
                { name: "Meta Social Media Marketing", issuer: "Coursera", url: "https://coursera.org/share/3dcb155e89b3d7fcc0b1e26ef1f9419e" },
                { name: "Introduction to Social Media Marketing", issuer: "Coursera", url: "https://coursera.org/share/bb031a394483734bbba3245efa6dac49" },
                { name: "Advertising with Meta", issuer: "Coursera", url: "https://coursera.org/share/968f05d4dd67ae05c8432bb0b9d55276" },
                { name: "Measure and Optimize Social Media Marketing Campaigns", issuer: "Coursera", url: "https://coursera.org/share/eb6e90768759890afd3ac2d07603e827" },
                { name: "Social Media Management", issuer: "Coursera", url: "https://coursera.org/share/45b5430afc796c4d2dda3a60f58781b8" },
                { name: "Fundamentals of Social Media Advertising", issuer: "Coursera", url: "https://coursera.org/share/72ce912f1360b720429893d1e5b6ec7f" },
                { name: "Meta Social Media Marketing Professional Certificate(v.2)", issuer: "Credly", url: "https://www.credly.com/badges/faf85ad3-9d60-41ca-aee3-164ff8e37946" }
            ]);
        };
        fetchFooterData();
    }, []);

    return (
        <footer className="main-footer">
            <div className="footer-bottom pt-50 pb-40">
                <div className="container">
                    {/* Trust & Verification Section */}
                    <div className="row mb-5 justify-content-center">
                        <div className="col-lg-12">
                            <div className="trust-badges-container text-center">
                                {/* Payment Methods */}
                                <div className="payment-methods mb-4">
                                    <h5 className="footer-heading mb-3" style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Accepted Payments</h5>
                                    <div className="d-flex justify-content-center gap-4 flex-wrap align-items-center">
                                        {payments.map((item, index) => {
                                            const Icon = ICON_MAP[item.icon] || ICON_MAP[item.iconName]
                                            
                                            // Special handling for Cambodian Banks to show Name + Icon or just Name
                                            const isTextPayment = ['KHQR', 'ABA Bank', 'ACLEDA Bank', 'Wing Bank'].includes(item.name);
                                            
                                            if (isTextPayment) {
                                                return (
                                                    <div key={index} className="payment-icon d-flex align-items-center gap-2" title={item.name} style={{ opacity: 0.7, color: 'var(--heading-color)', fontWeight: 'bold', fontSize: '14px' }}>
                                                        {item.icon && Icon && <Icon size={24} />}
                                                        <span>{item.name}</span>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div key={index} className="payment-icon" title={item.name} style={{ opacity: 0.7 }}>
                                                    {Icon ? <Icon size={32} color={item.color || 'var(--heading-color)'} /> : item.name}
                                                </div>
                                            )
                                        })}
                                        <div className="payment-icon" style={{ opacity: 0.7, color: 'var(--heading-color)', fontWeight: 'bold', fontSize: '14px' }}>
                                            USDC
                                        </div>
                                        <div className="payment-icon" style={{ opacity: 0.7, color: 'var(--heading-color)', fontWeight: 'bold', fontSize: '14px' }}>
                                            USDT
                                        </div>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="certifications mt-5">
                                    <h5 className="footer-heading mb-3" style={{ fontSize: '14px', color: 'var(--lighter-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified & Certified By</h5>
                                    <div className="d-flex justify-content-center gap-3 flex-wrap align-items-center">
                                        {certifications.map((cert, index) => (
                                            <a 
                                                key={index} 
                                                href={cert.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="cert-badge d-flex align-items-center gap-2" 
                                                style={{ 
                                                    background: 'var(--border-light)', 
                                                    padding: '8px 16px', 
                                                    borderRadius: '50px',
                                                    border: '1px solid var(--border-light)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--button-border)'
                                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'var(--border-light)'
                                                    e.currentTarget.style.transform = 'translateY(0)'
                                                }}
                                            >
                                                <RiShieldCheckFill size={18} color="#4CAF50" style={{ flexShrink: 0 }} />
                                                <div className="cert-info text-start" style={{ lineHeight: '1.2' }}>
                                                    <span style={{ display: 'block', fontSize: '13px', color: 'var(--heading-color)', fontWeight: '600' }}>{cert.name}</span>
                                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--lighter-color)' }}>{cert.issuer}</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row border-top pt-4" style={{ borderColor: 'var(--border-light)' }}>
                        <div className="col-lg-6">
                            <div className="copyright-text">
                                <p>
                                    © {year}, <Link href="/">HENG MAKARA</Link> All
                                    Rights Reserved.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="copyright-text extra-copyright text-lg-end">
                                <p>
                                    <Link href="/privacy-policy" style={{marginRight: '15px'}}>Privacy Policy</Link>
                                    <Link href="/terms">Terms of Service</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
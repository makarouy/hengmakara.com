"use client";
import { RiMailLine, RiMapPinLine, RiPhoneLine, RiTelegram2Line } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import SlideUp from '../../../utlits/animations/slideUp'

const ContactOption = () => {
    const [settings, setSettings] = useState({});
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data || {});
            } catch {
                setSettings({});
            }
        };
        fetchSettings();
    }, []);
    return (
        <div className="col-lg-4">
            <SlideUp>
                <div className="contact-content-part">
                    <SlideUp delay={2}>
                        <div className="single-contact">
                            <div className="contact-icon">
                                <i> <RiMapPinLine size={20} /></i>
                            </div>
                            <h2>our office:</h2>
                            <p>{settings.address || 'Phnom Penh, Cambodia'}</p>
                        </div>
                    </SlideUp>
                    <SlideUp delay={3}>
                        <div className="single-contact wow fadeInUp" data-wow-delay=".4s">
                            <div className="contact-icon">
                                <i> <RiPhoneLine size={20} /></i>
                            </div>
                            <h2>contact number:</h2>
                            <p>{settings.phone || '(+855) 061 212 226'}</p>
                        </div>
                    </SlideUp>
                    <SlideUp delay={4}>
                        <div className="single-contact wow fadeInUp" data-wow-delay=".6s">
                            <div className="contact-icon">
                                <i> <RiTelegram2Line size={20} /></i>
                            </div>
                            <h2>Telegram:</h2>
                            <p>{settings.telegram || 't.me/hengmakaraa'}</p>
                        </div>
                    </SlideUp>
                    <SlideUp delay={5}>
                        <div className="single-contact wow fadeInUp" data-wow-delay=".6s">
                            <div className="contact-icon">
                                <i> <RiMailLine size={20} /></i>
                            </div>
                            <h2>Email us:</h2>
                            <p>{settings.contactEmail || 'me@hengmakara.com'}</p>
                        </div>
                    </SlideUp>
                </div>
            </SlideUp>
        </div>
    )
}

export default ContactOption
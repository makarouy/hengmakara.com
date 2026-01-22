'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { RiFacebookCircleFill, RiTwitterXLine, RiLinkedinFill, RiYoutubeFill, RiCircleFill, RiDownloadLine, RiTelegramFill, RiInstagramFill } from '@remixicon/react'
import PartnersMarquee from './partnersMarquee';
import SlideUp from '@/utlits/animations/slideUp';

const Hero = () => {
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Failed to load settings', err))
    }, [])

    return (
        <section id="about" className="about-area">
            <div className="container">
                <div className="row">
                    {/* <!-- START ABOUT IMAGE DESIGN AREA --> */}
                    <div className="col-lg-4">
                        <SlideUp className="h-100">
                            <div className="about-image-part h-100 d-flex flex-column">
                                <Image 
                                    src="/images/about/profile.png" 
                                    alt="About Me" 
                                    width={300}
                                    height={300}
                                    priority
                                    style={{ width: '100%', height: 'auto', maxWidth: '300px' }}
                                />
                                <h3>{settings?.siteName || 'Heng Makara'}</h3>
                                <p>Digital Marketing & Media Production Specialist<br />based in {settings?.address || 'Phnom Penh'}.</p>
                                <div className="about-social text-center mt-auto">
                                    <ul className="social-icon-list">
                                        {settings?.socialFacebook && (
                                            <li><Link href={settings.socialFacebook} target="_blank" rel="noopener noreferrer"><RiFacebookCircleFill size={20} /></Link></li>
                                        )}
                                        {settings?.socialInstagram && (
                                            <li><Link href={settings.socialInstagram} target="_blank" rel="noopener noreferrer"><RiInstagramFill size={20} /></Link></li>
                                        )}
                                        {settings?.socialTwitter && (
                                            <li><Link href={settings.socialTwitter} target="_blank" rel="noopener noreferrer"><RiTwitterXLine size={20} /></Link></li>
                                        )}
                                        {settings?.socialLinkedin && (
                                            <li><Link href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer"><RiLinkedinFill size={20} /></Link></li>
                                        )}
                                        {settings?.socialTelegram && (
                                            <li><Link href={settings.socialTelegram} target="_blank" rel="noopener noreferrer"><RiTelegramFill size={20} /></Link></li>
                                        )}
                                        {settings?.socialYoutube && (
                                            <li><Link href={settings.socialYoutube} target="_blank" rel="noopener noreferrer"><RiYoutubeFill size={20} /></Link></li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </SlideUp>
                    </div>
                    {/* <!-- / END ABOUT IMAGE DESIGN AREA -->
                    <!-- START ABOUT TEXT DESIGN AREA --> */}
                    <div className="col-lg-8">
                        <SlideUp>
                            <div className="about-content-part">
                                <p>Hello There!</p>
                                <h1>
                                    I’m Heng Makara — Social Media Recovery & Digital Marketing Specialist.
                                </h1>
                                <div className="adress-field">
                                    <ul>
										 <li className='d-flex align-items-center'>Expert in Account Recovery (Facebook/Instagram), Digital Marketing, and Media Production.</li>
                                        <li className='d-flex align-items-center'><i><RiCircleFill size={14} /></i> Available for Freelancing</li>
                                    </ul>
                                </div>
                                <div className="hero-btns">
                                    <Link href="/contact" className="theme-btn" >Download CV <i><RiDownloadLine size={16} /></i> </Link>
                                </div>
                            </div>
                        </SlideUp>
                        <SlideUp>
                            <PartnersMarquee />
                        </SlideUp>
                    </div>
                    {/* <!-- / END ABOUT TEXT DESIGN AREA --> */}
                </div>
            </div>
        </section>
    )
}

export default Hero
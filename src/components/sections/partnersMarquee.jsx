import React from 'react'
import Marquee from "react-fast-marquee";
import { 
    RiFacebookCircleFill, 
    RiInstagramLine, 
    RiTiktokFill, 
    RiYoutubeFill, 
    RiTwitterXLine, 
    RiLinkedinBoxFill, 
    RiTelegramFill, 
    RiWhatsappFill 
} from '@remixicon/react';

const partners = [
    { icon: RiFacebookCircleFill, name: "Facebook", color: "#1877F2" },
    { icon: RiInstagramLine, name: "Instagram", color: "#E4405F" },
    { icon: RiTiktokFill, name: "TikTok", color: "#ffffff" }, // White for TikTok on dark
    { icon: RiYoutubeFill, name: "YouTube", color: "#FF0000" },
    { icon: RiTwitterXLine, name: "X (Twitter)", color: "#ffffff" },
    { icon: RiLinkedinBoxFill, name: "LinkedIn", color: "#0A66C2" },
    { icon: RiTelegramFill, name: "Telegram", color: "#0088cc" },
    { icon: RiWhatsappFill, name: "WhatsApp", color: "#25D366" }
];

const PartnersMarquee = () => {
    return (
        <div className="about-content-part-bottom">
            <h2>Company I Worked With</h2>
            <div className="company-list">
                <div className="scroller">
                    <div className="scroller__inner">
                        <Marquee gradient={false} speed={50}>
                            {partners.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div key={index} className="partner-logo-container" style={{ margin: '0 40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Icon 
                                            size={45} 
                                            color={item.color}
                                            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))' }}
                                        />
                                        <span style={{ 
                                            color: '#fff', 
                                            fontSize: '18px', 
                                            fontWeight: '600',
                                            opacity: 0.9 
                                        }}>
                                            {item.name}
                                        </span>
                                    </div>
                                )
                            })}
                        </Marquee>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartnersMarquee
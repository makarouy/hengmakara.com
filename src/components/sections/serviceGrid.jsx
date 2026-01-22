"use client";

import React, { useEffect, useState } from 'react'
import { RiGlobalFill, RiPantoneFill, RiQuillPenLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const ServiceGrid = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services')
                const data = await res.json()
                const activeServices = Array.isArray(data) ? data.filter(s => s.active !== false) : [];
                setServices(activeServices)
            } catch (e) {
                setServices([])
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [])

    return (
        <section id="services" className="services-area innerpage-single-area">
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <SlideUp>
                                <div className="section-title text-center">
                                    <p>Services</p>
                                    <h2>Quality Services</h2>
                                </div>
                            </SlideUp>
                        </div>
                    </div>
                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center"><p>Loading...</p></div>
                        ) : services.length === 0 ? (
                            <div className="col-12 text-center"><p>No services found.</p></div>
                        ) : (
                            services.map((service, idx) => (
                                <Card key={service.id || idx} id={idx+1} icon={service.icon} title={service.title} description={service.description} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ServiceGrid

const ICONS = {
    RiGlobalFill: <RiGlobalFill size={60} />,
    RiPantoneFill: <RiPantoneFill size={60} />,
    RiQuillPenLine: <RiQuillPenLine size={60} />
}

const Card = ({ icon, title, description, id }) => {
    return (
        <div className="col-lg-4 col-md-6">
            <SlideUp delay={id}>
                <div className="service-item">
                    <span className="service-icon">{ICONS[icon] || '🛠️'}</span>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
            </SlideUp>
        </div>
    )
}
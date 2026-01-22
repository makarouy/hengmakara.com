"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import SlideUp from '@/utlits/animations/slideUp'

const Pricing = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('/api/pricing')
                const data = await res.json()
                const activePlans = Array.isArray(data) ? data.filter(p => p.active !== false) : [];
                setPlans(activePlans)
            } catch (e) {
                setPlans([])
            } finally {
                setLoading(false)
            }
        }
        fetchPlans()
    }, [])

    return (
        <section className="pricing-area">
            <div className="container">
                <div className="container-inner">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12">
                            <SlideUp>
                                <div className="section-title text-center">
                                    <p>Pricing</p>
                                    <h2>Flexible Pricing Plan</h2>
                                </div>
                            </SlideUp>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {loading ? (
                            <div className="col-12 text-center"><p>Loading...</p></div>
                        ) : plans.length === 0 ? (
                            <div className="col-12 text-center"><p>No pricing plans found.</p></div>
                        ) : (
                            plans.map((plan, idx) => <Card key={plan.id || idx} id={idx+1} {...plan} />)
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Pricing

const Card = ({id, title, price, sortInfo, features, unit }) => {
    return (
        <div className="col-lg-4 col-md-6">
            <SlideUp delay={id}>
                <div className="pricing-item">
                    <div className="pricing-header">
                        <h4 className="title">{title}</h4>
                        <p className="save-percent" dangerouslySetInnerHTML={{ __html: sortInfo }} />
                        <span className="price">{price}<span className="price-unit">{unit}</span></span>
                    </div>
                    <div className="pricing-details">
                        <ul>
                            {Array.isArray(features) && features.map((f, i) => (
                                <li key={f.id || i} className={f.unable ? "unable" : ""}>
                                    <i>➡️</i>{f.feature}
                                </li>
                            ))}
                        </ul>
                        <Link href="/contact" className="theme-btn">Order Now <i>🛒</i> </Link>
                    </div>
                </div>
            </SlideUp>
        </div>
    )
}
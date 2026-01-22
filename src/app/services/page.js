export const metadata = {
    title: 'Services | Social Media Recovery & Digital Marketing',
    description: 'Professional services by Heng Makara: Facebook/Instagram Account Recovery, Gmail Security, Digital Marketing, and Media Production.',
    alternates: {
        canonical: 'https://hengmakara.com/services',
    },
    openGraph: {
        title: 'Services | Heng Makara',
        description: 'Explore professional services: Account Recovery, Digital Marketing, Media Production. Trusted & Secure.',
        url: 'https://hengmakara.com/services',
        type: 'website',
        images: [
            {
                url: '/images/og-services.jpg', // Make sure this image exists or fallback will use layout's
                width: 1200,
                height: 630,
                alt: 'Services - Heng Makara'
            }
        ]
    },
};
import React from 'react'
import Pricing from '@/components/sections/pricing'
import ServiceGrid from '@/components/sections/serviceGrid'

const Service = () => {
    return (
        <>
            <ServiceGrid />
            <Pricing />
        </>
    )
}

export default Service
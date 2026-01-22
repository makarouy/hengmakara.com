import React from 'react'
import Hero from '../components/sections/hero'
import PortfolioStats from '../components/sections/portfolioStats'
import Portfolio from '../components/sections/portfolio'

export const metadata = {
  title: 'Heng Makara | Social Media Recovery Expert & Digital Marketer',
  description: 'Pro Social Media Recovery (Facebook, Gmail, Instagram) & Digital Marketing. secure, fast & reliable service by Heng Makara.',
  alternates: {
    canonical: 'https://hengmakara.com',
  },
}

const Home = () => {
    return (
        <>
            <Hero />
            <PortfolioStats />
            <Portfolio/>
        </>
    )
}

export default Home
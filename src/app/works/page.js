import React from 'react'
import Portfolio from '../../components/sections/portfolio'

export const metadata = {
  title: 'Portfolio & Success Stories | Heng Makara',
  description: 'View the success stories and portfolio of Heng Makara. Digital Marketing styles, Media Production, and Account Recovery cases.',
  alternates: {
    canonical: 'https://hengmakara.com/works',
  },
}

const Works = () => {
    return (
        <>
            <Portfolio className={"innerpage-single-area"} />
        </>
    )
}

export default Works
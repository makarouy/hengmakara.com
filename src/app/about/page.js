import React from 'react'
import Summery from '@/components/sections/summery'
import Resume from '@/components/sections/resume'
import Testimonials from '@/components/sections/testimonials'

export const metadata = {
  title: 'About Me | Heng Makara',
  description: 'Learn about Heng Makara, a Digital Marketing Specialist and Social Media Recovery Expert based in Cambodia with years of experience.',
  alternates: {
    canonical: 'https://hengmakara.com/about',
  },
}

const About = () => {
    return (
        <>
            <Summery />
            <Resume />
            <Testimonials />
           
        </>
    )
}

export default About
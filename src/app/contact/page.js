import React from 'react'
import ContactOption from '../../components/sections/contact/contactOption'
import ContactForm from '../../components/sections/contact/contactForm'

export const metadata = {
  title: 'Contact Heng Makara | Fast Account Recovery & Marketing Support',
  description: 'Get in touch with Heng Makara for immediate assistance with Social Media Account Recovery or Digital Marketing inquiries.',
  alternates: {
    canonical: 'https://hengmakara.com/contact',
  },
}

const Contact = () => {
  return (
    <section id="contact" className="contact-area innerpage-single-area">
      <div className="container">
        <div className="container-inner">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="section-title text-center wow fadeInUp delay-0-2s">
                <p>contact</p>
                <h2>Get in Touch with Me!</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <ContactOption />
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
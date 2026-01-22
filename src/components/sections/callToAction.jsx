import React from 'react'
import Link from 'next/link'
import { RiDownloadLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const CallToAction = () => {
    return (
        <section className="call-to-action-area">
            <div className="container">
                <div className="row">
                    {/* <!-- START ABOUT TEXT DESIGN AREA --> */}
                    <div className="col-lg-12">
                        <SlideUp>
                            <div className="about-content-part call-to-action-part text-center">
                                <h2>Are You Ready to Grow Your Brand or Launch Your Next Project?</h2>
                                <p>Let’s work together on account recovery, digital marketing, and professional media production to achieve real results.</p>
                                <div className="hero-btns">
                                    <Link href="/contact" className="theme-btn">Let&apos;s Talk  <i><RiDownloadLine size={16} /></i></Link>
                                </div>
                            </div>
                        </SlideUp>
                    </div>
                    {/* <!-- / END ABOUT TEXT DESIGN AREA --> */}
                </div>
            </div>
        </section>
    )
}

export default CallToAction
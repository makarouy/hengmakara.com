import React from 'react'
import Image from 'next/image'
import { RiMailSendLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const Summery = () => {
    return (
        <section id="about" className="about-single-area innerpage-single-area">
            <div className="container">
                <div className="row">
                    {/* <!-- START ABOUT IMAGE DESIGN AREA --> */}
                    <div className="col-lg-4">
                        <SlideUp>
                            <div className="about-image-part">
                                <Image 
                                    src="/images/about/profile.png" 
                                    alt="About Me" 
                                    width={300}
                                    height={300}
                                    style={{ width: '100%', height: 'auto', maxWidth: '350px' }}
                                />
                            </div>
                        </SlideUp>
                    </div>
                    {/* <!-- / END ABOUT IMAGE DESIGN AREA -->
                    <!-- START ABOUT TEXT DESIGN AREA --> */}
                    <div className="col-lg-8">
                        <SlideUp>
                            <div className="about-content-part">
                                <h2>
                                    I’m Heng Makara, a Digital Marketing & Media Production Specialist.
                                </h2>
                                <p>I’m a Cambodia-based digital marketing professional with strong experience in Meta/Facebook advertising, account recovery, content creation, and media production.</p>
                                <p>I help brands grow online through strategic advertising, creative content, and reliable platform support, while also delivering BTS, TVC, and commercial video production.</p>
                                <p></p>
                                <div className="hero-btns">
                                    <a href="/contact" className="theme-btn">Get In touch<i> <RiMailSendLine size={16} /> </i></a>
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

export default Summery
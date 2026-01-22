import React from 'react'
import { RiBookLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const Resume = () => {
    return (
        <section id="resume" className="resume-area">
            <div className="container">
                <div className="resume-items">
                    <div className="row">
                        {/* <!-- START EXPERIENCE RESUME DESIGN AREA --> */}
                        <div className="col-xl-6 col-md-6">
                            <div className="single-resume">
                                <h2>Experience</h2>
                                <div className="experience-list">
                                    <Card year={'Present'} title={'Digital Marketing & Media Production Specialist'} institution={'Develop advertising strategies, manage Meta/Facebook ad campaigns, optimize targeting, support account recovery, deliver performance reports, and commercial video production. '} />
                                    <Card year={'2021 - 2023'} title={'Digital Marketing Specialist – Tesla Cambodia'} institution={'Planned and executed digital marketing strategies, managed advertising budgets, created social media content, conducted market research, and reported campaign performance to management.'} />
                                    <Card year={'2014 - 2021'} title={'Freelance Advertising Consultant'} institution={'Developed advertising strategies, managed Facebook ad campaigns, optimized targeting, and delivered performance reports while maintaining strong client communication.'} />
                                    <Card year={'2020 - 2021'} title={'Customer Support'} institution={'Delivered customer service support, resolved issues efficiently, and maintained customer satisfaction.'} />
                                    <Card year={'2019 - 2020'} title={'Computer Instructor – WIS'} institution={'Taught basic Excel skills, designed structured lesson plans, conducted hands-on training, and evaluated student progress.'} />
                                    <Card year={'2017 - 2019'} title={'Marketing – Bayon VIP Co., Ltd'} institution={'Executed marketing campaigns, created promotional content, conducted market research, and optimized campaign performance.'} />
                                </div>
                            </div>
                        </div>
                        {/* <!-- // END EXPERIENCE RESUME DESIGN AREA -->
                        <!-- START EDUCATION RESUME DESIGN AREA --> */}
                        <div className="col-xl-6 col-md-6">
                            <div className="experience-list">
                                <div className="single-resume">
                                    <h2>Education</h2>
                                    <Card year={'2019 - 2021'} title={'Bachelor Degree of Information Technology'} institution={'National Technical Training Institute'} />
                                    <Card year={'2018 - 2020'} title={'Bachelor’s Degree in Laws'} institution={'Royal University of Law and Economics'} />
                                    <Card year={'2016 - 2018'} title={'Bachelor’s Degree in Private Law'} institution={'University of South-East Asia'} />
								</div>
                            </div>
                            <div className="experience-list">
                                <div className="single-resume">
                                    <h2>Certified Skills (Professional Certificate)</h2>
                                    <Card year={'2025'} title={'Meta Social Media Marketing '} institution={'Coursera · Meta'} />
                                    <Card year={'2025'} title={'Facebook & Instagram Ads Management '} institution={'Coursera · Meta'} />
                                    <Card year={'2025'} title={'Social Media Strategy & Campaign Optimization '} institution={'Coursera · Meta'} />
                                    <Card year={'2025'} title={'Audience Targeting & Retargeting '} institution={'Coursera · Meta'} />
                                    <Card year={'2025'} title={'Campaign Measurement & Performance Analytics '} institution={'Coursera · Meta'} />

								</div>
                            </div>
                        </div>
                        {/* <!-- // END EDUCATION RESUME DESIGN AREA --> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Resume


const Card = ({ year, title, institution }) => {
    return (
        <SlideUp>
            <div className="resume-item">
                <div className="icon">
                    <RiBookLine />
                </div>
                <div className="content">
                    <span className="years">{year}</span>
                    <h4>{title}</h4>
                    <span className="company"> {institution} </span>
                </div>
            </div>
        </SlideUp>
    )
}
'use client'
import React, { useState } from 'react'
import { RiMailLine } from '@remixicon/react'
import SlideUp from '@/utlits/animations/slideUp'

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="col-lg-8">
            <SlideUp>
                <div className="contact-form contact-form-area" >
                    <form className="contactForm" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input 
                                        type="text" id="name" name="name" className="form-control" placeholder="Steve Milner" required data-error="Please enter your Name" 
                                        value={formData.name} onChange={handleChange} disabled={status === 'loading'}
                                    />
                                    <label htmlFor="name" className="for-icon"><i className="far fa-user"></i></label>
                                    <div className="help-block with-errors"></div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input 
                                        type="email" id="email" name="email" className="form-control" placeholder="hello@websitename.com" required data-error="Please enter your Email"
                                        value={formData.email} onChange={handleChange} disabled={status === 'loading'}
                                    />
                                    <label htmlFor="email" className="for-icon"><i className="far fa-envelope"></i></label>
                                    <div className="help-block with-errors"></div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="message">Your Message</label>
                                    <textarea 
                                        name="message" id="message" className="form-control" rows="4" placeholder="Write Your message" required data-error="Please Write your Message"
                                        value={formData.message} onChange={handleChange} disabled={status === 'loading'}
                                    ></textarea>
                                    <div className="help-block with-errors"></div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group mb-0">
                                    <button type="submit" className="theme-btn" disabled={status === 'loading'}>
                                        {status === 'loading' ? 'Sending...' : 'Send Me Message'} <i><RiMailLine size={15} /></i>
                                    </button>
                                    {status === 'success' && <div className="h6 text-success mt-3">Message sent successfully!</div>}
                                    {status === 'error' && <div className="h6 text-danger mt-3">{errorMessage}</div>}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </SlideUp>
        </div>
    )
}

export default ContactForm